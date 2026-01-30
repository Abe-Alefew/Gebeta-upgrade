import React, { useState, useEffect } from 'react';
import './Approve.css';
import Button from '../../components/Button/Button';
import { adminService, applicationService } from '../../api/apiService';

const Approve = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  // Note modal state for adding admin notes
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [applicationToAct, setApplicationToAct] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    // Debounce search to avoid excessive API calls
    const timer = setTimeout(() => {
      fetchApplications();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  // Removed separate filterApplications effect as we now fetch from API directly

  const fetchApplications = async () => {
    try {
      setLoading(true); // Show loading state while fetching
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim(); // Assuming backend accepts 'search', or maybe 'q'

      const response = await adminService.listApplications(params);

      // Handle different response structures (standard API vs direct array)
      const data = response.data || response;
      const fetchedApplications = Array.isArray(data) ? data : (data.applications || []);

      const applicationsWithDefaults = fetchedApplications.map(app => ({
        ...app,
        status: app.status || 'pending',
        id: app._id || app.id
      }));

      // No need to locally filter anymore
      setApplications(applicationsWithDefaults);
      setFilteredApplications(applicationsWithDefaults); // Keep filtered synced for render usage
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
      setFilteredApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // filterApplications is no longer needed since we fetch filtered data
  // Keeping specific filteredApplications state to match render logic if needed, 
  // or just use 'applications' state directly.
  // For safety with existing render code, I'll update both.

  // Open the note modal for adding a note
  const openNoteModal = (id, existingNote = '') => {
    setApplicationToAct(id);
    setNoteText(existingNote || '');
    setNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setNoteModalOpen(false);
    setApplicationToAct(null);
    setNoteText('');
  };

  // Approve immediately
  const handleApprove = async (id) => {
    // Optimistic update
    setApplications(prev => prev.map(app => (app._id === id || app.id === id) ? { ...app, status: 'approved' } : app));

    try {
      await adminService.approveApplication(id);
      await fetchApplications(); // Refresh to ensure sync
    } catch (err) {
      console.error('Failed to persist approve:', err);
      // Revert on error could be added here
      await fetchApplications();
    }
  };

  // Reject immediately
  const handleReject = async (id) => {
    setApplications(prev => prev.map(app => (app._id === id || app.id === id) ? { ...app, status: 'rejected' } : app));

    try {
      await adminService.rejectApplication(id);
      await fetchApplications();
    } catch (err) {
      console.error('Failed to persist reject:', err);
      await fetchApplications();
    }
  };

  // Undo status (Revert to pending)
  const handleUndo = async (id) => {
    // Optimistic Update
    setApplications(prev => prev.map(app => (app._id === id || app.id === id) ? { ...app, status: 'pending' } : app));

    try {
      await adminService.updateApplication(id, { status: 'pending' });
      await fetchApplications();
    } catch (err) {
      console.error('Failed to undo:', err);
      alert(`Failed to undo: ${err.message || 'Unknown error'}`);
      await fetchApplications(); // Revert optimistic update
    }
  };

  // Save admin note (Add Note modal)
  const confirmNoteAction = async () => {
    if (!applicationToAct) return;

    // Update local state
    setApplications(prev => prev.map(app => (app._id === applicationToAct || app.id === applicationToAct) ? { ...app, reviewNotes: noteText } : app));

    try {
      // Using adminService.updateApplication to update notes
      await adminService.updateApplication(applicationToAct, { reviewNotes: noteText });
      await fetchApplications();
    } catch (err) {
      console.error('Failed to persist admin note:', err);
      if (err.statusCode === 403) {
        alert('Permission Denied: You are not authorized to edit this application.');
      } else {
        alert(`Failed to save note: ${err.message}`);
      }
      // Revert optimization strictly if we wanted, but often a refresh is enough
      await fetchApplications();
    }

    closeNoteModal();
  };

  const formatDate = (dateString) => {
    const s = (dateString ?? '').toString().trim();
    if (!s) return '';
    try {
      const date = new Date(s);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return s;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Pending Review';
    }
  };

  const isActiveFilter = (filter) => statusFilter === filter;

  return (
    <div className="admin-page">

      {noteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Add / Edit Note</h3>
            <p className="modal-message">Add an optional admin note to this application. It will be saved to the record.</p>

            <label className="modal-note-label" htmlFor="admin-note">Write a note (optional)</label>
            <textarea
              id="admin-note"
              className="note-textarea"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={5}
              placeholder={'Optional note...'}
            />

            <div className="modal-actions">
              <Button
                variant="neutral"
                className="modal-button modal-cancel"
                onClick={closeNoteModal}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="modal-button modal-confirm"
                onClick={confirmNoteAction}
              >
                Save Note
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <header className="header">
          <h1 className="page-title">Business Idea Approval</h1>

          <div className="controls-container">
            <div className="search-container">
              <div className="search-wrapper">
                <div className="search-icon">

                </div>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search by business name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-buttons">
              <button
                className={`filter-btn ${isActiveFilter('all') ? 'filter-btn-active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${isActiveFilter('pending') ? 'filter-btn-active' : ''}`}
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </button>
              <button
                className={`filter-btn ${isActiveFilter('approved') ? 'filter-btn-active' : ''}`}
                onClick={() => setStatusFilter('approved')}
              >
                Approved
              </button>
              <button
                className={`filter-btn ${isActiveFilter('rejected') ? 'filter-btn-active' : ''}`}
                onClick={() => setStatusFilter('rejected')}
              >
                Rejected
              </button>
            </div>
          </div>
        </header>

        <main className="applications-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
              <p>Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="no-results">No applications found</div>
          ) : (
            filteredApplications.map((application) => (
              <div className="application-card" key={application._id || application.id}>
                <div className="card-content">
                  <div className="card-details">
                    <div className="card-header">
                      <span className={`status-badge status-${application.status}`}>
                        {getStatusText(application.status)}
                      </span>
                      {(application.createdAt || application.date) && (
                        <div className="date-info">
                          <p className="date-label">Submission Date</p>
                          <p className="date-value">{formatDate(application.createdAt || application.date)}</p>
                        </div>
                      )}
                    </div>

                    <div className="business-info">
                      <div className="business-header">
                        <h2 className="business-name">{application.name || application.businessName}</h2>
                        <div className="location-info">
                          <span className="location-label">Location:</span>
                          <span className={`location-text`}>
                            {application.location ? (typeof application.location === 'object' ? application.location.address : application.location) : 'Not provided'}
                          </span>
                        </div>

                        {application.owner && (
                          <div className="location-info">
                            <span className="location-label">Business Owner:</span>
                            <span className={`location-text`}>
                              {typeof application.owner === 'object' ? application.owner.name : (application.ownerName || 'Not provided')}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="business-description">{application.description}</p>

                      {/* Display Admin Note if present and processed */}
                      {application.reviewNotes && (application.status === 'rejected' || application.status === 'approved') && (
                        <div className="admin-review-note" style={{ marginTop: '10px', fontSize: '0.9rem', color: '#ccc', borderLeft: '3px solid #666', paddingLeft: '8px' }}>
                          <strong>Note:</strong> {application.reviewNotes}
                        </div>
                      )}
                    </div>

                    <div className="card-actions">
                      <div className="action-buttons">
                        {application.status === 'pending' ? (
                          <>
                            <Button
                              variant="secondary"
                              size="medium"
                              onClick={() => openNoteModal(application._id || application.id, application.reviewNotes)}
                            >
                              Add Note
                            </Button>
                            <Button
                              variant="danger"
                              size="medium"
                              onClick={() => handleReject(application._id || application.id)}
                            >
                              Reject
                            </Button>
                            <Button
                              variant="primary"
                              size="medium"
                              onClick={() => handleApprove(application._id || application.id)}
                            >
                              Approve
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="secondary"
                              size="medium"
                              onClick={() => openNoteModal(application._id || application.id, application.reviewNotes)}
                            >
                              <i className="fa-solid fa-pen-to-square" style={{ marginRight: '6px' }}></i>
                              Edit Note
                            </Button>
                            <Button
                              variant="neutral"
                              size="medium"
                              style={{ backgroundColor: '#444', color: '#fff' }} /* Manual styling for neutral if variant not defined */
                              onClick={() => handleUndo(application._id || application.id)}
                            >
                              <i className="fa-solid fa-rotate-left" style={{ marginRight: '6px' }}></i>
                              Undo
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {!loading && filteredApplications.length > 0 && (
            <div className="applications-footer">
              <p className="footer-text">
                {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} showing
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Approve;