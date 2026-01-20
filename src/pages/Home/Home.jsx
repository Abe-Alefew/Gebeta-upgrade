import React from 'react';
import { Link } from 'react-router-dom';
import mockData from '../../Mock-data/mock-data.json';
import './Home.css';

const Home = () => {
  const { featuredBusinesses, statistics } = mockData.home;

  return (
    <div className="home-page">
    

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-image">
          <img src="./images/hero sec image.png" alt="Delicious campus food" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">DISCOVER THE BEST<br />EATS IN & AROUND<br />CAMPUS</h1>
          <p className="hero-description">
            From hidden cafeteria gems to top-rated street spots and student-run delivery startups, explore every bite your university has to offer.
          </p>
          <div className="hero-buttons">
            <Link to="/reviews">
              <button className="btn btn-primary">Explore</button>
            </Link>
            <Link to="/submit-review">
              <button className="btn btn-outline">Rate</button>
            </Link>
          </div>
        </div>
      </section>
      <hr className="divider" />

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <img src="./images/icon1.png" alt="On-Campus Meals" />
            <h3>ON-CAMPUS<br />MEALS</h3>
            <p>Discover & rate the food available right inside campus.</p>
          </div>
          <div className="feature-card highlight">
            <img src="./images/icon2.png" alt="Delivery Options" />
            <h3>DELIVERY<br />OPTIONS</h3>
            <p>Check delivery time, service quality, fees, and which meals are worth ordering according to student reviews.</p>
          </div>
          <div className="feature-card">
            <img src="./images/icon3.png" alt="Off-Campus Restaurants" />
            <h3>OFF-CAMPUS RESTAURANTS</h3>
            <p>Explore the best nearby places to eat around your campus.</p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Featured Businesses Section - USING MOCK DATA */}
      <section className="featured-businesses">
        <h2 className="section-title">FEATURED BUSINESSES</h2>
        <div className="businesses-grid">
          {featuredBusinesses.map((business, index) => (
            <div key={business.id} className="business-card">
              <div className="business-image-wrapper">
                <img 
                  src={business.image || `./images/featured-${(index % 5) + 1}.png`} 
                  alt={business.name} 
                />
                <h3 className="business-overlay-title">{business.name.toUpperCase()}</h3>
              </div>
              <p className="business-review">
                "{business.description.substring(0, 100)}..."
              </p>
              <p className="review-author">
                ⭐ {business.rating} • {business.reviewCount} reviews
              </p>
              <Link to={`/business/${business.slug}`}>
                <button className="btn btn-outline">See More</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Section - Optional */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>{statistics.totalBusinesses}+</h3>
            <p>Businesses Listed</p>
          </div>
          <div className="stat-item">
            <h3>{statistics.totalReviews}+</h3>
            <p>Student Reviews</p>
          </div>
          <div className="stat-item">
            <h3>{statistics.totalUsers}+</h3>
            <p>Active Users</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;