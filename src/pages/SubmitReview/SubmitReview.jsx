import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SubmitReview.css';

const SubmitReview = () => {
  const { id: businessId } = useParams(); // Get business ID from URL
  const navigate = useNavigate();
  
  // State for form
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [business, setBusiness] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (businessId) {
      fetchBusinessAndReviews();
    } else {
      // If no business ID in URL, redirect or use default
      navigate('/reviews');
    }
  }, [businessId]);

  const fetchBusinessAndReviews = async () => {
    try {
      setLoading(true);
      
      // Fetch business details
      const businessData = await businessService.getById(businessId);
      setBusiness(businessData.data);

      // Fetch recent reviews for this business
      const reviewsData = await reviewService.getBusinessReviews(businessId, { limit: 5 });
      setRecentReviews(reviewsData.data || []);

    } catch (err) {
      setError(err.message || 'Failed to load business information');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleRatingHover = (value) => {
    setHoverRating(value);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      alert('Please select a rating');
      return;
    }

    if (!reviewText.trim()) {
      alert('Please write your review');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const reviewData = {
        businessId: businessId,
        rating: rating,
        body: reviewText.trim()
      };

      // Submit review using API
      const response = await reviewService.create(reviewData);
      
      // Success - show message and redirect
      alert('Review submitted successfully!');
      navigate(`/business/${businessId}`);
      
    } catch (err) {
      if (err.error?.code === 'DUPLICATE_REVIEW') {
        setError('You have already reviewed this business');
      } else {
        setError(err.error?.message || 'Failed to submit review. Please try again.');
      }
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (ratingValue, interactive = false) => {
    const stars = [];
    const displayRating = interactive ? (hoverRating || rating) : ratingValue;
    
    for (let i = 1; i <= 5; i++) {
      const starClass = i <= displayRating ? 'fa-solid fa-star' : 'fa-regular fa-star';
      
      if (interactive) {
        stars.push(
          <i
            key={i}
            className={starClass}
            onClick={() => handleRatingClick(i)}
            onMouseEnter={() => handleRatingHover(i)}
            onMouseLeave={handleRatingLeave}
            style={{ cursor: 'pointer', transition: 'color 0.2s' }}
          />
        );
      } else {
        stars.push(<i key={i} className={starClass} />);
      }
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading review form...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="error-container">
        <p>Business not found</p>
        <button onClick={() => navigate('/reviews')} className="btn btn-primary">
          Back to Reviews
        </button>
      </div>
    );
  }

  return (
    <main>
      <div className="submit-review-container">
        {/* Left Column: Submit Form */}
        <div className="submit-form-area">
          <div className="place-info">
            <img 
              src={business.image?.[0]?.url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop'} 
              alt={business.name}
            />
            <div className="cafeteriaDescription">
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>
                {business.name.toUpperCase()}
              </h3>
              <p style={{ color: 'var(--text-grey)', margin: 0 }}>
                {business.location?.address || 'Location not specified'}
              </p>
            </div>
          </div>
          
          <hr className="divider" />
          
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '15px' }}>
            How would you rate your experience?
          </h3>
          
          <div className="rating-select">
            {renderStars(rating, true)}
            <span style={{ fontSize: '1rem', marginLeft: '10px' }}>
              {rating ? `You rated: ${rating} star${rating !== 1 ? 's' : ''}` : 'SELECT YOUR RATING'}
            </span>
          </div>
          
          <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
            TELL US ABOUT YOUR EXPERIENCE
          </p>
          
          <div className="form-group">
            <textarea 
              name="experience" 
              id="experience" 
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="6"
              maxLength="500"
            />
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-grey)', marginTop: '5px' }}>
              {reviewText.length}/500 characters
            </div>
          </div>

          {error && (
            <div className="error-message" style={{ color: '#ff6b6b', marginTop: '10px' }}>
              {error}
            </div>
          )}

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '20px' }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Post Review'}
          </button>
        </div>

        {/* Right Column: Recent Reviews */}
        <div className="recent-reviews-area">
          <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Recent Reviews</h2>
          <hr className="divider" />
          
          {recentReviews.length > 0 ? (
            recentReviews.map((review) => (
              <div key={review.id} className="review-item" style={{ marginBottom: '20px' }}>
                <div className="review-header">
                  <img 
                    className="reviewer-img"
                    src={review.user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D'} 
                    alt="Reviewer"
                  />
                  <div className="reviewer-info">
                    <h4>{review.user?.name?.toUpperCase() || 'ANONYMOUS USER'}</h4>
                    <p>{review.user?.dormitory || 'AAU'}</p>
                    <div className="rating-stars" style={{ fontSize: '0.8rem', margin: 0 }}>
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <p className="review-body">"{review.body.length > 150 ? `${review.body.substring(0, 150)}...` : review.body}"</p>
                <button 
                  className="btn btn-outline" 
                  style={{ fontSize: '0.8rem', padding: '5px 15px', marginTop: '10px' }}
                  onClick={() => navigate(`/business/${businessId}`)}
                >
                  READ MORE
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-grey)', textAlign: 'center', padding: '20px' }}>
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default SubmitReview;