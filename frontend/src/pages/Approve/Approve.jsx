import React, { useState, useEffect } from 'react';
import './Approve.css';
import Button from '../../components/Button/Button';

const API_BASE = 'http://localhost:3000';
const DATA_URL = `${API_BASE}/applications`;
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
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error('Failed to fetch applications from API');
      const data = await response.json();
      // json-server returns an array at /applications
      const fetchedApplications = Array.isArray(data) ? data : (data.applications || []);
      const applicationsWithDefaults = fetchedApplications.map(app => ({
        ...app,
        status: app.status || 'pending'
      }));
      setApplications(applicationsWithDefaults);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }; 

  const filterApplications = () => {
    let filtered = [...applications];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.businessName?.toLowerCase().includes(term) ||
        app.location?.toLowerCase().includes(term)
      );
    }
    
    setFilteredApplications(filtered);
  };

  // Open the note modal for adding a note
  const openNoteModal = (id) => {
    setApplicationToAct(id);
    setNoteText('');
    setNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setNoteModalOpen(false);
    setApplicationToAct(null);
    setNoteText('');
  };

  // Approve immediately: update state, persist, and it will disappear from 'pending' filter
  const handleApprove = async (id) => {
    // optimistic update
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: 'approved' } : app));

    try {
      await updateApplicationStatus(id, { status: 'approved' });
      await fetchApplications();
    } catch (err) {
      console.error('Failed to persist approve:', err);
    }
  };

  // Reject immediately: update state, persist
  const handleReject = async (id) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: 'rejected' } : app));

    try {
      await updateApplicationStatus(id, { status: 'rejected' });
      await fetchApplications();
    } catch (err) {
      console.error('Failed to persist reject:', err);
    }
  };

  // Save admin note (Add Note modal)
  const confirmNoteAction = async () => {
    if (!applicationToAct) return;

    // Update local state
    setApplications(prev => prev.map(app => app.id === applicationToAct ? { ...app, adminNote: noteText } : app));

    try {
      await updateApplicationStatus(applicationToAct, { adminNote: noteText });
      await fetchApplications();
    } catch (err) {
      console.error('Failed to persist admin note:', err);
    }

    closeNoteModal();
  }; 

  // Backend sync helper (json-server required) - reads/writes use db.json via json-server
  const updateApplicationStatus = async (id, payload) => {
    try {
      const res = await fetch(`${API_BASE}/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to patch application');
      return await res.json();
    } catch (err) {
      console.error('updateApplicationStatus error:', err);
      throw err;
    }
  };

  const formatDate = (dateString) => {
    const s = (dateString ?? '').toString().trim();
    if (!s) return '';
    const date = new Date(s);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusText = (status) => {
    switch(status) {
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
            <h3 className="modal-title">Add Note</h3>
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
            <div className="loading">Loading applications...</div>
          ) : filteredApplications.length === 0 ? (
            <div className="no-results">No applications found</div>
          ) : (
            filteredApplications.map((application) => (
              <div className="application-card" key={application.id}>
                <div className="card-content">
                  <div className="card-details">
                    <div className="card-header">
                      <span className={`status-badge status-${application.status}`}>
                        {getStatusText(application.status)}
                      </span>
                      {application.date && (
                        <div className="date-info">
                          <p className="date-label">Submission Date</p>
                          <p className="date-value">{formatDate(application.date)}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="business-info">
                      <div className="business-header">
                        <h2 className="business-name">{application.businessName}</h2>
                        <div className="location-info">
                          <span className="location-label">Location:</span>
                          <span className={`location-text`}>
                            {application.location || 'Not provided'}
                          </span>
                        </div>

                        <div className="location-info">
                          <span className="location-label">Business Owner:</span>
                          <span className={`location-text`}>
                            {application.ownerName || 'Not provided'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="business-description">{application.description}</p>
                    </div>
                    
                    <div className="card-actions">
                      <div className="action-buttons">
                        <Button
                          variant="secondary"
                          size="medium"
                          onClick={() => openNoteModal(application.id)}
                        >
                          Add Note
                        </Button>
                        <Button
                          variant="danger"
                          size="medium"
                          onClick={() => handleReject(application.id)}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="primary"
                          size="medium"
                          onClick={() => handleApprove(application.id)}
                        >
                          Approve
                        </Button>
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