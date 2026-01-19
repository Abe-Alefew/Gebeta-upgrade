import React, { useState } from 'react';
import './About.css';
import mockData from '../../Mock-data/mock-data.json'; // Adjust path as needed

const AboutPage = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    location: '',
    description: ''
  });

  // Get data from mock-data.json
  const aboutData = mockData.about;
  const statistics = aboutData.statistics;
  const team = aboutData.team;
  const contact = aboutData.contact;
  const faqs = aboutData.faqs;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    // Simulate API call with mock data
    const applicationData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      applicationId: 'APP_' + Date.now()
    };
    
    console.log('Application created:', applicationData);
    alert('Thank you for submitting your business application! We will review it shortly.');
    
    // Reset form
    setFormData({
      businessName: '',
      location: '',
      description: ''
    });
  };

  return (
    <main className="about-page">
      {/* Hero Section */}
      <section className="about-section">
        <div className="about-text">
          <h1>
            ABOUT <span className="script-font text-green">{aboutData.appInfo.name}</span><br />REVIEW
          </h1>

          <p className="tagline">{aboutData.appInfo.tagline}</p>
          <p className="app-description">{aboutData.appInfo.description}</p>

          {/* Features from mock data */}
          <div className="features-list">
            <h3>What We Offer:</h3>
            <ul>
              {aboutData.appInfo.features.map((feature, index) => (
                <li key={index}>
                  <i className="fas fa-check-circle text-green"></i> {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="about-gallery">
          <div 
            className="gallery-item large"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600')"
            }}
          >
            <span className="gallery-label">OFF-CAMPUS</span>
            <div className="gallery-overlay">
              <p>Discover restaurants near campus</p>
            </div>
          </div>
          <div 
            className="gallery-item"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=300')"
            }}
          >
            <span className="gallery-label">ON-CAMPUS</span>
            <div className="gallery-overlay">
              <p>Explore campus cafeterias</p>
            </div>
          </div>
          <div 
            className="gallery-item wide"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1695654390723-479197a8c4a3?q=80&w=1434&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
            }}
          >
            <span className="gallery-label">DELIVERY</span>
            <div className="gallery-overlay">
              <p>Student-run delivery services</p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="statistics-section">
          <h2 className="section-title text-center">Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{statistics.businessesListed}+</div>
              <div className="stat-label">Businesses Listed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{statistics.totalReviews}+</div>
              <div className="stat-label">Reviews</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{statistics.activeUsers}+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{statistics.campusesCovered}</div>
              <div className="stat-label">Campuses</div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Team Section */}
      <section className="team-section">
        <h2 className="section-title text-center">Meet Our Team</h2>
        <div className="team-grid">
          {team.map((member, index) => (
            <div className="team-card" key={index}>
              <div className="team-avatar">
                <img src={member.avatar} alt={member.name} />
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="section-title text-center">Frequently Asked Questions</h2>
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <div className="faq-card" key={index}>
              <h3 className="faq-question">Q: {faq.question}</h3>
              <p className="faq-answer">A: {faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* Business Application Form */}
      <section className="form-section" id="business-sec">
        <h2 className="section-title text-center">LIST YOUR BUSINESS</h2>
        <p className="form-subtitle text-center">
          Join our platform and connect with thousands of students looking for great food options!
        </p>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="businessName">BUSINESS NAME *</label>
              <input 
                type="text" 
                id="businessName"
                name="businessName"
                placeholder="Enter your business name"
                value={formData.businessName}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">LOCATION *</label>
              <input 
                type="text" 
                id="location"
                name="location"
                placeholder="e.g., Near 5k Campus Gate"
                value={formData.location}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">DESCRIPTION</label>
              <textarea 
                id="description"
                name="description"
                rows="5"
                placeholder="Describe your business, menu items, specialties..."
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
              <p className="form-hint">Tell students what makes your business special!</p>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary submit-btn"
            >
              Submit Application
            </button>
          </form>
        </div>
      </section>

      {/* Contact Info */}
      <section className="contact-section">
        <h2 className="section-title text-center">Get In Touch</h2>
        <div className="contact-info">
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <span>{contact.email}</span>
          </div>
          <div className="contact-item">
            <i className="fab fa-telegram"></i>
            <span>{contact.telegram}</span>
          </div>
          <div className="contact-item">
            <i className="fab fa-instagram"></i>
            <span>{contact.instagram}</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;