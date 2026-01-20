import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CustomerReview.css';

const CustomerReview = () => {
  const [business, setBusiness] = useState(null);
  const [topMenuItems, setTopMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(true);

  // Business ID - can be dynamic from URL params
  const businessId = 'b1';

  // MOCK DATA - From your HTML
  const mockBusiness = {
    id: 'b1',
    name: 'STUDENT CENTER CAFETERIA',
    category: 'on-campus',
    image: [
      { url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=400&auto=format&fit=crop' }
    ],
    rating: { average: 4.5, count: 234 },
    location: { address: '5K DORMITORY' },
    hours: { closeTime: '6pm' }
  };

  const mockMenuItems = [
    { 
      id: 'm1', 
      itemName: 'BEYAYNET', 
      price: 120, 
      rating: 4.5, 
      reviewCount: 234,
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=400&auto=format&fit=crop'
    },
    { 
      id: 'm2', 
      itemName: 'SPAGHETTI', 
      price: 120, 
      rating: 4.5, 
      reviewCount: 220,
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=400&auto=format&fit=crop'
    },
    { 
      id: 'm3', 
      itemName: 'BEYAYNET', 
      price: 120, 
      rating: 4.5, 
      reviewCount: 234,
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=400&auto=format&fit=crop'
    },
    { 
      id: 'm4', 
      itemName: 'BEYAYNET', 
      price: 120, 
      rating: 4.5, 
      reviewCount: 234,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop'
    }
  ];

  const mockReviews = [
    { 
      id: 'r1', 
      user: { 
        name: 'SELAM TADESSE', 
        yearOfStudy: '4th Year',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
      }, 
      rating: 5, 
      body: 'I HAD AN AMAZING EXPERIENCE AT THIS RESTAURANT! THE PLACE WAS CLEAN, BEAUTIFULLY DECORATED, AND THE STAFF WERE INCREDIBLY POLITE. I ORDERED THE BEEF TIBS WITH INJERA, AND IT WAS ABSOLUTELY PERFECT.' 
    },
    { 
      id: 'r2', 
      user: { 
        name: 'Miheret', 
        yearOfStudy: 'CC, AAU',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
      }, 
      rating: 5, 
      body: 'I HAD AN AMAZING EXPERIENCE AT THIS RESTAURANT! THE PLACE WAS CLEAN, BEAUTIFULLY DECORATED, AND THE STAFF WERE INCREDIBLY POLITE. TASTED FRESH AND NATURAL. NOT SUGARY LIKE OTHER PLACES.' 
    },
    { 
      id: 'r3', 
      user: { 
        name: 'Kenean Eshetu', 
        yearOfStudy: 'Freshman, AAU',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop'
      }, 
      rating: 5, 
      body: 'I HAD AN AMAZING EXPERIENCE AT THIS RESTAURANT! THE PLACE WAS CLEAN, BEAUTIFULLY DECORATED, AND THE STAFF WERE INCREDIBLY POLITE. I ORDERED THE BEEF TIBS WITH INJERA.' 
    },
    { 
      id: 'r4', 
      user: { 
        name: 'Beza', 
        yearOfStudy: '3rd Year',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
      }, 
      rating: 5, 
      body: 'THE MANGO JUICE TASTED FRESH AND NATURAL, NOT SUGARY LIKE OTHER PLACES. I WILL DEFINITELY COME BACK WITH FRIENDS!' 
    }
  ];

  useEffect(() => {
    fetchBusinessData();
  }, [businessId]);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      setUsingMockData(false);
      setError(null);

      // Try to fetch from API (commented for now since you don't have API running)
      /*
      const businessData = await businessService.getById(businessId);
      const menuData = await menuService.getTopItems(businessId, 4);
      const reviewsData = await reviewService.getBusinessReviews(businessId, { limit: 4 });

      setBusiness(businessData.data || mockBusiness);
      setTopMenuItems(menuData.data || mockMenuItems);
      setReviews(reviewsData.data || mockReviews);
      */
      
      // For now, use mock data
      setTimeout(() => {
        setBusiness(mockBusiness);
        setTopMenuItems(mockMenuItems);
        setReviews(mockReviews);
        setUsingMockData(true);
        setLoading(false);
      }, 500);

    } catch (err) {
      console.log('API Error, using mock data:', err.message);
      setError('Could not connect to server. Showing demo data.');
      setUsingMockData(true);
      
      // Use mock data as fallback
      setBusiness(mockBusiness);
      setTopMenuItems(mockMenuItems);
      setReviews(mockReviews);
      
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fa-solid fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fa-solid fa-star-half-stroke"></i>);
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="fa-regular fa-star"></i>);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading business information...</p>
      </div>
    );
  }

  if (error && !usingMockData) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={fetchBusinessData} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (!business) {
    return <div>Business not found</div>;
  }

  return (
    <>
      {/* Demo Data Notice */}
      {usingMockData && (
        <div className="demo-notice" style={{
          backgroundColor: 'rgba(140, 255, 100, 0.1)',
          border: '1px solid var(--accent-green)',
          borderRadius: '10px',
          padding: '15px',
          margin: '20px auto',
          maxWidth: 'var(--container-width)',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          <i className="fa-solid fa-info-circle" style={{ color: 'var(--accent-green)', marginRight: '10px' }}></i>
          Showing demo data from your HTML
        </div>
      )}

      <main>
        {/* On-Campus Business Section */}
        <section className="container" style={{ padding: '40px 20px' }}>
          <h2 className="section-title">{business.category?.toUpperCase() || 'ON-CAMPUS'}</h2>

          <div className="hero-grid">
            <div className="main-card">
              <div
                className="main-card-image"
                style={{
                  backgroundImage: `url('${business.image[0].url}')`
                }}
              ></div>
              <div className="main-card-content">
                <h3>{business.name}</h3>
                <div className="rating-stars">
                  {renderStars(business.rating.average)}
                  <span>{business.rating.average.toFixed(1)} ({business.rating.count} REVIEWS)</span>
                </div>
                <div className="card-details">
                  <div><i className="fa-solid fa-location-dot"></i> {business.location.address}</div>
                  <div><i className="fa-solid fa-users"></i> Large Group Friendly</div>
                  <div><i className="fa-solid fa-calendar"></i> Open Until {business.hours.closeTime}</div>
                </div>
              </div>
            </div>

            <div className="peek-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'transparent' }}>
              {business.image.slice(1, 3).map((img, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    backgroundImage: `url('${img.url}')`,
                    backgroundSize: 'cover',
                    borderRadius: '10px'
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link to={`/business/${business.id}/submit-review`}>
              <button className="btn btn-primary">Review</button>
            </Link>
          </div>
        </section>

        <hr className="divider" />

        {/* Menu Section */}
        <section className="container" style={{ padding: '40px 20px' }}>
          <h2 className="section-title">MENU</h2>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '20px' }}>TOP</h3>

          <div className="businesses-grid">
            {topMenuItems.map((item) => (
              <div key={item.id} className="business-card">
                <div className="business-image-wrapper">
                  <img
                    src={item.image}
                    alt={item.itemName}
                  />
                  <div className="menu-item-price">
                    {item.price} ETB
                  </div>
                </div>
                <h4 style={{ margin: '10px 0' }}>{item.itemName}</h4>
                <div className="rating-stars" style={{ fontSize: '0.8rem', marginBottom: '10px' }}>
                  {renderStars(item.rating)}
                  <span>{item.rating.toFixed(1)} ({item.reviewCount})</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link to={`/business/${business.id}/menu`}>
              <button className="btn btn-outline">Full Menu</button>
            </Link>
          </div>
        </section>

        <hr className="divider" />

        {/* Reviews Section */}
        <section className="container" style={{ padding: '40px 20px' }}>
          <h2 className="section-title">REVIEWS</h2>

          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <img
                    className="reviewer-img"
                    src={review.user.avatar}
                    alt="User"
                  />
                  <div className="reviewer-info">
                    <h4>{review.user.name.toUpperCase()}</h4>
                    <p>{review.user.yearOfStudy}</p>
                    <div className="rating-stars" style={{ fontSize: '0.8rem', margin: 0 }}>
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <p className="review-body">"{review.body}"</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default CustomerReview;