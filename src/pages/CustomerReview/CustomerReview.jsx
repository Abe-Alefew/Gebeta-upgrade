import React, { useState, useEffect } from 'react';
import { useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import './CustomerReview.css';

const CustomerReview = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Sync this menu items array with MenuItemDetail component
  const allMenuItems = [
    {
      id: 1,
      name: 'BEYAYNETU',
      price: '120 ETB',
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1000&auto=format&fit=crop',
      description: 'Traditional Ethiopian platter with assorted vegetables and injera',
      rating: 4.5,
      reviewCount: 234,
      category: 'Main Dish'
    },
    {
      id: 2,
      name: 'DORO WOT',
      price: '150 ETB',
      image: 'https://media.istockphoto.com/id/870064540/photo/ethiopian-doro-wot.webp?a=1&b=1&s=612x612&w=0&k=20&c=vnxlWJREiw8f4GN_D1pkF8NaGIhDZnajD_ihL9VUXQ8=',
      description: 'Spicy chicken stew served with injera',
      rating: 4.8,
      reviewCount: 189,
      category: 'Main Dish'
    },
    {
      id: 3,
      name: 'TIBES',
      price: '180 ETB',
      image: 'https://media.istockphoto.com/id/619254834/photo/traditional-oromo-and-ethiopian-cuisine-dish-aka-tibs-ethiopia.jpg?s=612x612&w=0&k=20&c=Box_8s0OZjiEpMZvWuXSHBEOqRbSfzir8oOU2kIJlwQ=',
      description: 'Fried meat cubes with spices and vegetables',
      rating: 4.3,
      reviewCount: 156,
      category: 'Main Dish'
    },
    {
      id: 4,
      name: 'SHIRO',
      price: '100 ETB',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
      description: 'Chickpea flour stew with spices',
      rating: 4.6,
      reviewCount: 201,
      category: 'Main Dish'
    },
    {
      id: 5,
      name: 'KITFO',
      price: '160 ETB',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
      description: 'Minced beef seasoned with spices',
      rating: 4.4,
      reviewCount: 178,
      category: 'Main Dish'
    },
    {
      id: 6,
      name: 'TIBS FIRFIR',
      price: '140 ETB',
      image: 'https://media.istockphoto.com/id/870064540/photo/ethiopian-doro-wot.webp?a=1&b=1&s=612x612&w=0&k=20&c=vnxlWJREiw8f4GN_D1pkF8NaGIhDZnajD_ihL9VUXQ8=',
      description: 'Shredded injera mixed with tibs',
      rating: 4.2,
      reviewCount: 145,
      category: 'Main Dish'
    },
    {
      id: 7,
      name: 'SPAGHETTI',
      price: '120 ETB',
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop',
      description: 'Italian pasta with tomato sauce and cheese',
      rating: 4.2,
      reviewCount: 189,
      category: 'Pasta'
    },
    {
      id: 8,
      name: 'PIZZA',
      price: '150 ETB',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
      description: 'Cheese pizza with fresh toppings',
      rating: 4.7,
      reviewCount: 312,
      category: 'Fast Food'
    }
  ];

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        if (location.state?.business) {
          setBusiness(location.state.business);
          setLoading(false);
        } else if (params.id) {
          const response = await fetch(`/api/businesses/${params.id}`);
          
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setBusiness(data.data);
            } else {
              throw new Error('Failed to fetch business data');
            }
          } else {
            setBusiness(getFallbackBusiness(params.id));
          }
        } else {
          setBusiness(getFallbackBusiness('b1'));
        }
      } catch (error) {
        console.error('Error fetching business:', error);
        setBusiness(getFallbackBusiness('b1'));
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const businessId = location.state?.business?.id || params.id || 'b1';
        const response = await fetch(`/api/reviews/business/${businessId}?limit=5&sort=newest`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setReviews(data.data);
            const initialExpanded = {};
            data.data.forEach(review => {
              initialExpanded[review.id] = false;
            });
            setExpandedReviews(initialExpanded);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews(mockReviews);
        const initialExpanded = {};
        mockReviews.forEach(review => {
          initialExpanded[review.id] = false;
        });
        setExpandedReviews(initialExpanded);
      }
    };

    // Fetch menu items from API, fallback to hardcoded
    const fetchMenuItems = async () => {
      try {
        const businessId = location.state?.business?.id || params.id || 'b1';
        const response = await fetch(`/api/menu/${businessId}`);
        
        if (response.ok) {
          const data = await response.json();
          // Map API data to expected format if needed
          const mappedItems = data.map(item => ({
            id: item.id,
            name: item.itemName,
            price: `${item.price} ${item.currency}`,
            image: item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop', // fallback image
            description: item.description,
            rating: item.rating || 4.5,
            reviewCount: item.reviewCount || 0,
            category: item.category
          }));
          setMenuItems(mappedItems);
        } else {
          throw new Error('API response not ok');
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setMenuItems(allMenuItems.slice(0, 8)); // Fallback to hardcoded
      }
    };

    fetchBusinessData();
    fetchReviews();
    fetchMenuItems();
  }, [location, params.id]);

  const getFallbackBusiness = (id) => {
    const businesses = {
      'b1': {
        id: 'b1',
        name: 'STUDENT CENTER CAFETERIA',
        mainImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
        rating: 4.5,
        reviews: 234,
        location: '5K DORMITORY',
        groupFriendly: true,
        hours: '6pm',
        category: 'On-Campus',
        description: 'The main cafeteria serving students with a variety of meals throughout the day.',
        menuItems: ['Pizza', 'Pasta', 'Salads', 'Burgers', 'Daily Specials'],
        priceRange: '$',
        phone: '(123) 456-7890',
        website: 'https://university.edu/cafeteria'
      },
      'd1': {
        id: 'd1',
        name: 'ARRIVE DELIVERY',
        mainImage: 'https://images.unsplash.com/photo-1587476351660-e9fa4bb8b26c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D',
        rating: 3.5,
        reviews: 280,
        location: '5K, 4K, 6K DORMITORY',
        groupFriendly: false,
        hours: '8pm',
        category: 'Delivery',
        description: 'Fast food delivery service covering all dormitories on campus.',
        menuItems: ['Burgers', 'Fries', 'Wings', 'Pizza', 'Soft Drinks'],
        priceRange: '$$',
        phone: '(123) 456-7891',
        website: 'https://arrivedelivery.com'
      }
    };
    return businesses[id] || businesses['b1'];
  };

  // Mock data as fallback with longer reviews
  const mockReviews = [
    {
      id: 1,
      name: 'SELAM TADESSE',
      year: '4th Year',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      review: '"I HAD AN AMAZING EXPERIENCE AT THIS RESTAURANT! THE PLACE WAS CLEAN, BEAUTIFULLY DECORATED, AND THE STAFF WERE INCREDIBLY POLITE. I ORDERED THE BEEF TIBS WITH INJERA, AND IT WAS ABSOLUTELY PERFECT. THE FLAVORS WERE AUTHENTIC AND THE PORTION WAS VERY GENEROUS. I WILL DEFINITELY BE COMING BACK WITH MY FRIENDS NEXT WEEK!"'
    },
    {
      id: 2,
      name: 'Miheret',
      year: 'CC, AAU',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      review: '"I HAD AN AMAZING EXPERIENCE AT THIS RESTAURANT! THE PLACE WAS CLEAN, BEAUTIFULLY DECORATED, AND THE STAFF WERE INCREDIBLY POLITE. TASTED FRESH AND NATURAL. NOT SUGARY LIKE OTHER PLACES. THE ATMOSPHERE WAS VERY WELCOMING AND THE PRICES ARE REASONABLE FOR STUDENTS."'
    },
    {
      id: 3,
      name: 'Kenean Eshetu',
      year: 'Freshman, AAU',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
      review: '"I HAD AN AMAZING EXPERIENCE AT THIS RESTAURANT! THE PLACE WAS CLEAN, BEAUTIFULLY DECORATED, AND THE STAFF WERE INCREDIBLY POLITE. I ORDERED THE BEEF TIBS WITH INJERA AND IT WAS SERVED HOT AND FRESH. THE SERVICE WAS QUICK AND EFFICIENT EVEN DURING PEAK HOURS."'
    }
  ];

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

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleLoadMoreReviews = async () => {
    try {
      const businessId = business?.id || params.id || 'b1';
      const currentPage = Math.ceil(reviews.length / 3) + 1;
      const response = await fetch(`/api/reviews/business/${businessId}?page=${currentPage}&limit=2&sort=newest`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setReviews(prev => [...prev, ...data.data]);
          const newExpanded = {};
          data.data.forEach(review => {
            newExpanded[review.id] = false;
          });
          setExpandedReviews(prev => ({ ...prev, ...newExpanded }));
        } else {
          const additionalMockReviews = [
            {
              id: 4,
              name: 'Beza Tadesse',
              year: '3rd Year',
              rating: 4,
              image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=200&auto=format&fit=crop',
              review: '"GOOD FOOD OVERALL, BUT THE SERVICE CAN BE SLOW DURING PEAK HOURS. THE MANGO JUICE WAS EXCELLENT - FRESH AND NOT TOO SWEET. THE SEATING AREA IS COMFORTABLE AND CLEAN. I RECOMMEND COMING DURING OFF-PEAK HOURS FOR BETTER SERVICE."'
            },
            {
              id: 5,
              name: 'Dawit Assefa',
              year: '2nd Year',
              rating: 5,
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
              review: '"BEST BEYAYNET IN CAMPUS! THE VARIETY OF VEGETABLES IS IMPRESSIVE AND EVERYTHING TASTES FRESH. THE INJERA IS SOFT AND PERFECTLY FERMENTED. VERY AFFORDABLE FOR STUDENTS. THE STAFF ARE FRIENDLY AND ALWAYS SMILING."'
            }
          ];
          setReviews(prev => [...prev, ...additionalMockReviews]);
          const newExpanded = {};
          additionalMockReviews.forEach(review => {
            newExpanded[review.id] = false;
          });
          setExpandedReviews(prev => ({ ...prev, ...newExpanded }));
        }
      }
    } catch (error) {
      console.error('Error loading more reviews:', error);
      const additionalMockReviews = [
        {
          id: 4,
          name: 'Beza Tadesse',
          year: '3rd Year',
          rating: 4,
          image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=200&auto=format&fit=crop',
          review: '"GOOD FOOD OVERALL, BUT THE SERVICE CAN BE SLOW DURING PEAK HOURS. THE MANGO JUICE WAS EXCELLENT - FRESH AND NOT TOO SWEET. THE SEATING AREA IS COMFORTABLE AND CLEAN. I RECOMMEND COMING DURING OFF-PEAK HOURS FOR BETTER SERVICE."'
        }
      ];
      setReviews(prev => [...prev, ...additionalMockReviews]);
      const newExpanded = {};
      additionalMockReviews.forEach(review => {
        newExpanded[review.id] = false;
      });
      setExpandedReviews(prev => ({ ...prev, ...newExpanded }));
    }
  };

  // Function to handle menu item click - Whole box is clickable
  const handleMenuItemClick = (menuItem) => {
    navigate('/menu-item', {
      state: {
        menuItem: menuItem,
        business: business
      }
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading business details...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="error-container">
        <p>No business data found.</p>
        <Link to="/reviews">
          <button className="btn btn-primary">Back to Reviews</button>
        </Link>
      </div>
    );
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <main>
      {/* Business Header Section */}
      <section className="container" style={{ padding: '40px 20px' }}>
        <h2 className="section-title">{business.category}</h2>

        <div className="hero-grid">
          <div className="main-card">
            <div 
              className="main-card-image"
              style={{ backgroundImage: `url('${business.mainImage}')` }}
            ></div>
            <div className="main-card-content">
              <h3>{business.name}</h3>
              <div className="rating-stars">
                {renderStars(business.rating)}
                <span>{business.rating.toFixed(1)} ({business.reviews} REVIEWS)</span>
              </div>
              <div className="card-details">
                <div><i className="fa-solid fa-location-dot"></i> {business.location}</div>
                <div>
                  {business.groupFriendly && (
                    <><i className="fa-solid fa-users"></i> Large Group Friendly &nbsp; &nbsp; &nbsp;</>
                  )}
                  <i className="fa-solid fa-calendar"></i> Open Until {business.hours}
                </div>
                {business.phone && (
                  <div><i className="fa-solid fa-phone"></i> {business.phone}</div>
                )}
                {business.website && (
                  <div><i className="fa-solid fa-globe"></i> {business.website}</div>
                )}
                <div><i className="fa-solid fa-tag"></i> Price Range: {business.priceRange}</div>
              </div>
            </div>
          </div>

          <div className="peek-card">
            <div 
              className="peek-image"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400&auto=format&fit=crop')` }}
            ></div>
            <div 
              className="peek-image"
              style={{ 
                backgroundImage: `url('https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=400&auto=format&fit=crop')`,
                marginTop: '10px'
              }}
            ></div>
          </div>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <Link 
            to="/submit-review" 
            state={{ business: business }}
          >
            <button className="btn btn-primary">Review</button>
          </Link>
        </div>
      </section>

      <hr className="divider" />

      {/* Menu Section - UPDATED WITH WHOLE BOX CLICKABLE */}
      <section className="container" style={{ padding: '40px 20px' }}>
        <h2 className="section-title">MENU</h2>
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '20px' }}>TOP</h3>

        {/* Horizontal scrolling menu container */}
        <div className="menu-horizontal-scroll">
          {menuItems.map((item) => (
            <div 
              key={item.id} 
              className="menu-card clickable-menu-item"
              onClick={() => handleMenuItemClick(item)}
            >
              {/* Image with price tag */}
              <div className="menu-image-wrapper">
                <img src={item.image} alt={item.name} />
                <div className="menu-price-tag">{item.price}</div>
              </div>
              <h4 style={{ margin: '10px 0' }}>{item.name}</h4>
              <div className="rating-stars" style={{ fontSize: '0.8rem', marginBottom: '10px' }}>
                {renderStars(item.rating || 4.5)}
                <span>{item.rating?.toFixed(1) || '4.5'} ({item.reviewCount || 234})</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button className="btn btn-outline">Full Menu</button>
        </div>
      </section>

      <hr className="divider" />

      {/* Reviews Section */}
      <section className="container" style={{ padding: '40px 20px' }}>
        <h2 className="section-title">CUSTOMER REVIEWS</h2>

        <div className="reviews-list">
          {displayedReviews.map((review) => {
            const isExpanded = expandedReviews[review.id];
            const displayText = isExpanded || review.review.length <= 200 
              ? review.review 
              : `${review.review.substring(0, 200)}...`;

            return (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <img className="reviewer-img" src={review.image} alt={review.name} />
                  <div className="reviewer-info">
                    <h4>{review.name}</h4>
                    <p>{review.year}</p>
                    <div className="rating-stars" style={{ fontSize: '0.8rem', margin: 0 }}>
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <p className="review-body">{displayText}</p>
                
                {review.review.length > 200 && (
                  <button 
                    className="btn btn-outline read-more-btn"
                    onClick={() => toggleReviewExpansion(review.id)}
                  >
                    {isExpanded ? 'SHOW LESS' : 'READ MORE'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          {!showAllReviews && reviews.length > 3 && (
            <button 
              className="btn btn-outline"
              onClick={() => setShowAllReviews(true)}
              style={{ marginRight: '15px' }}
            >
              View More Reviews
            </button>
          )}
          
          {showAllReviews && reviews.length < 8 && (
            <button 
              className="btn btn-outline"
              onClick={handleLoadMoreReviews}
            >
              Load More Reviews
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

export default CustomerReview;