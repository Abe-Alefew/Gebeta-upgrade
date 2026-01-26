import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import './About.css';

const About = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    location: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Submit to JSON Server API
      const response = await fetch('http://localhost:3000/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date().toISOString(),
          status: 'pending'
        }),
      });

      if (response.ok) {
        alert('Thank you! Your business application has been submitted.');
        setFormData({
          businessName: '',
          location: '',
          description: ''
        });
      } else {
        alert('There was an error submitting your application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your application. Please try again.');
    }
  };

  return (
    <div className="about-page">
      <main>
        <section className="about-section">
          <div className="about-text">
            <h1>ABOUT <span className="script-font text-green">Gebeta</span><br />REVIEW</h1>

            <p>
              <span className="script-font text-green">Gebeta</span> is a student-powered food discovery and review
              platform built to help university students find the best meals on and around campus.
            </p>
            <p>
              We make it easy to explore cafeterias, nearby restaurants, and student-run delivery services — all
              in one organized hub.
            </p>
          </div>

          <div className="about-gallery">
            <div className="gallery-item large"
              style={{backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600')"}}>
              <span className="gallery-label">OFF-CAMPUS</span>
            </div>
            <div className="gallery-item"
              style={{backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=300')"}}>
              <span className="gallery-label">ON-CAMPUS</span>
            </div>
            <div className="gallery-item wide"
              style={{backgroundImage: "url('https://images.unsplash.com/photo-1695654390723-479197a8c4a3?q=80&w=1434&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}>
              <span className="gallery-label">DELIVERY</span>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="form-section" id="business-sec">
          <h2 className="section-title text-center">LIST YOUR BUSINESS</h2>

          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>BUSINESS NAME</label>
                <input 
                  type="text" 
                  name="businessName"
                  placeholder="" 
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>LOCATION</label>
                <input 
                  type="text" 
                  name="location"
                  placeholder="" 
                  required
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>DESCRIPTION</label>
                <textarea 
                  rows="5"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <Button variant="primary" type="submit" style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}}>
                Submit
              </Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;