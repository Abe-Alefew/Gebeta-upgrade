import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch featured businesses AND reviews
      const [businessesResponse, reviewsResponse] = await Promise.all([
        fetch('http://localhost:3004/featuredBusinesses?isFeatured=true'),
        fetch('http://localhost:3004/reviews?_limit=6&_sort=date&_order=desc')
      ]);
      
      if (!businessesResponse.ok || !reviewsResponse.ok) {
        throw new Error('Failed to fetch data from server');
      }
      
      const businessesData = await businessesResponse.json();
      const reviewsData = await reviewsResponse.json();
      
      setFeaturedBusinesses(businessesData);
      setReviews(reviewsData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get businesses to display
  const businessesToDisplay = featuredBusinesses.length > 0 
    ? featuredBusinesses.slice(0, 6)
    : [
        // Fallback static data if API returns nothing
        { id: 1, name: "DESTA CAFE", description: "Great coffee and sandwiches!", image: "./images/featured-1.png" },
        { id: 2, name: "123FASTFOOD", description: "Fast delivery and tasty burgers", image: "./images/featured-2.png" },
        { id: 3, name: "CHRISTINA CAFE", description: "Best traditional food on campus", image: "./images/featured-3.png" },
        { id: 4, name: "SLEEK DELIVERY", description: "Reliable delivery service", image: "./images/featured-4.png" },
        { id: 5, name: "DESTA CAFE", description: "Perfect for quick lunches", image: "./images/featured-5.png" },
        { id: 6, name: "DESTA CAFE", description: "Friendly staff and great prices", image: "./images/featured-1.png" }
      ];

  // Get reviews for each business
  const getBusinessReview = (business, index) => {
    // Try to find a review for this business
    if (reviews.length > 0) {
      const businessReview = reviews.find(review => review.businessId === business.id);
      if (businessReview) {
        return {
          text: businessReview.comment || businessReview.title,
          author: `- ${businessReview.userName}`,
          rating: `⭐ ${businessReview.rating}`,
          isReal: true
        };
      }
      
      // If no specific review, use any review
      const anyReview = reviews[index % reviews.length];
      if (anyReview) {
        return {
          text: anyReview.comment || anyReview.title,
          author: `- ${anyReview.userName}`,
          rating: `⭐ ${anyReview.rating}`,
          isReal: true
        };
      }
    }
    
    // Fallback static review
    return {
      text: "I ORDERED FROM HERE LAST WEEK - GOT MY ORDER IN 10 MINUTES! SUPER FAST AND FRIENDLY SERVICE.",
      author: "- ANNA, 2ND YEAR",
      rating: "⭐ 4.5",
      isReal: false
    };
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-image">
          <img 
            src="https://plus.unsplash.com/premium_photo-1695297516798-d275bdf26575?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MjAxN3wwfDF8c2VhcmNofDV8fGV0aGlvcGlhbiUyMGZvb2R8ZW58MHx8fHwxNzY4OTA0NTk3fDA&ixlib=rb-4.1.0&q=85&q=85&fmt=jpg&crop=entropy&cs=tinysrgb&w=450" 
            alt="Delicious campus food" 
          />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">DISCOVER THE BEST<br />EATS IN & AROUND<br />CAMPUS</h1>
          <p className="hero-description">
            From hidden cafeteria gems to top-rated street spots and student-run delivery
            startups, explore every bite your university has to offer.
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

      {/* Featured Businesses Section */}
      <section className="featured-businesses">
        <h2 className="section-title">FEATURED BUSINESSES</h2>
        
        {loading ? (
          <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-color)'}}>
            Loading featured businesses...
          </div>
        ) : error ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#ff4444'}}>
            Error loading businesses. Please make sure JSON Server is running on port 3004.
          </div>
        ) : (
          <div className="businesses-grid">
            {businessesToDisplay.map((business, index) => {
              const review = getBusinessReview(business, index);
              
              return (
                <div key={business.id || index} className="business-card">
                  <div className="business-image-wrapper">
                    <img 
                      src={business.image} 
                      alt={business.name} 
                      onError={(e) => {
                        e.target.src = `./images/featured-${(index % 5) + 1}.png`;
                      }}
                    />
                    <h3 className="business-overlay-title">{business.name.toUpperCase()}</h3>
                  </div>
                  <p className="business-review">
                    "{review.text.substring(0, 100)}{review.text.length > 100 ? '...' : ''}"
                  </p>
                  <p className="review-author">
                    {review.rating} • {review.author}
                  </p>
                  <button className="btn btn-outline">See More</button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;