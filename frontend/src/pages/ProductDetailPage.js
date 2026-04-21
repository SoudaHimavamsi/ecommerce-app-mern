import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { userInfo } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);

  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/api/products/${id}`);
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError('Product not found');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const addToCartHandler = () => {
    addToCart(product, qty);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const toggleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError(null);
    setReviewSuccess(false);
    try {
      await api.post(
        `/api/products/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setReviewSuccess(true);
      setComment('');
      setRating(5);
      fetchProduct();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    }
    setReviewLoading(false);
  };

  const renderStars = (value, size = 16) =>
    [1, 2, 3, 4, 5].map((star) => (
      <span key={star} style={{ color: star <= Math.round(value) ? '#F5A623' : '#e0e0e0', fontSize: size }}>★</span>
    ));

  if (loading) {
    return (
      <div style={styles.loadingBox}>
        <div style={styles.loadingGrid}>
          <div style={styles.loadingSkeleton} />
          <div>
            {[80, 50, 40, 90, 60].map((w, i) => (
              <div key={i} style={{ ...styles.loadingLine, width: `${w}%`, marginBottom: 14 }} />
            ))}
          </div>
          <div style={styles.loadingSkeleton} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorBox}>
        <p style={{ fontSize: 48 }}>😕</p>
        <h2 style={styles.errorTitle}>Product not found</h2>
        <button onClick={() => navigate('/')} style={styles.backBtnSolid}>← Back to Products</button>
      </div>
    );
  }

  const wishlisted = isInWishlist(product._id);

  return (
    <div style={styles.container}>

      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <span onClick={() => navigate('/')} style={styles.breadcrumbLink}>Home</span>
        <span style={styles.breadcrumbSep}>›</span>
        <span style={styles.breadcrumbLink} onClick={() => navigate(`/?category=${product.category}`)}>
          {product.category}
        </span>
        <span style={styles.breadcrumbSep}>›</span>
        <span style={styles.breadcrumbCurrent}>{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div style={styles.mainLayout}>

        {/* Left: Image */}
        <div style={styles.imageSection}>
          <div style={styles.imageWrapper}>
            <img src={product.image} alt={product.name} style={styles.image} />
            {product.countInStock === 0 && (
              <div style={styles.outOfStockBadge}>Out of Stock</div>
            )}
          </div>
        </div>

        {/* Middle: Info */}
        <div style={styles.infoSection}>
          <p style={styles.brandLabel}>{product.brand}</p>
          <h1 style={styles.productName}>{product.name}</h1>

          {/* Rating Row */}
          <div style={styles.ratingRow}>
            <div style={styles.starsRow}>{renderStars(product.rating, 18)}</div>
            <span style={styles.ratingNumber}>{product.rating.toFixed(1)}</span>
            <span style={styles.ratingCount}>({product.numReviews} review{product.numReviews !== 1 ? 's' : ''})</span>
          </div>

          {/* Category Tag */}
          <div style={styles.tagRow}>
            <span style={styles.categoryTag}>{product.category}</span>
            {product.countInStock > 0 && product.countInStock <= 5 && (
              <span style={styles.lowStockTag}>Only {product.countInStock} left!</span>
            )}
          </div>

          {/* Tabs */}
          <div style={styles.tabs}>
            {['description', 'details'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.tab,
                  borderBottom: activeTab === tab ? '2px solid #0f1923' : '2px solid transparent',
                  color: activeTab === tab ? '#0f1923' : '#9ca3af',
                  fontWeight: activeTab === tab ? '700' : '400',
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'description' ? (
            <p style={styles.description}>{product.description}</p>
          ) : (
            <div style={styles.detailsTable}>
              {[
                ['Brand', product.brand],
                ['Category', product.category],
                ['Availability', product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'],
                ['Rating', `${product.rating.toFixed(1)} / 5`],
                ['Reviews', product.numReviews],
              ].map(([key, val]) => (
                <div key={key} style={styles.detailRow}>
                  <span style={styles.detailKey}>{key}</span>
                  <span style={styles.detailVal}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Buy Box */}
        <div style={styles.buyBox}>
          {/* Price */}
          <div style={styles.priceSection}>
            <p style={styles.price}>₹{product.price.toLocaleString()}</p>
            <p style={styles.priceNote}>Inclusive of all taxes</p>
          </div>

          {/* Stock */}
          <div style={{
            ...styles.stockBadge,
            backgroundColor: product.countInStock > 0 ? '#f0fdf4' : '#fef2f2',
            color: product.countInStock > 0 ? '#16a34a' : '#dc2626',
            border: `1px solid ${product.countInStock > 0 ? '#bbf7d0' : '#fecaca'}`,
          }}>
            {product.countInStock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
          </div>

          {product.countInStock > 0 && (
            <>
              {/* Qty */}
              <div style={styles.qtySection}>
                <label style={styles.qtyLabel}>Quantity</label>
                <div style={styles.qtyControl}>
                  <button
                    onClick={() => qty > 1 && setQty(qty - 1)}
                    style={{ ...styles.qtyBtn, opacity: qty <= 1 ? 0.4 : 1 }}
                    disabled={qty <= 1}
                  >−</button>
                  <span style={styles.qtyDisplay}>{qty}</span>
                  <button
                    onClick={() => qty < Math.min(product.countInStock, 5) && setQty(qty + 1)}
                    style={{ ...styles.qtyBtn, opacity: qty >= Math.min(product.countInStock, 5) ? 0.4 : 1 }}
                    disabled={qty >= Math.min(product.countInStock, 5)}
                  >+</button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={addToCartHandler}
                style={{
                  ...styles.cartBtn,
                  backgroundColor: addedToCart ? '#16a34a' : '#0f1923',
                  color: addedToCart ? '#fff' : '#FFD814',
                }}
              >
                {addedToCart ? '✓ Added to Cart!' : '🛒 Add to Cart'}
              </button>

              {/* Go to Cart */}
              <button
                onClick={() => navigate('/cart')}
                style={styles.goToCartBtn}
              >
                View Cart →
              </button>
            </>
          )}

          {/* Wishlist */}
          <button onClick={toggleWishlist} style={{
            ...styles.wishlistBtn,
            color: wishlisted ? '#e53935' : '#6b7280',
            border: `1px solid ${wishlisted ? '#fecaca' : '#e5e7eb'}`,
            backgroundColor: wishlisted ? '#fef2f2' : '#fafafa',
          }}>
            {wishlisted ? '❤️ Saved to Wishlist' : '🤍 Add to Wishlist'}
          </button>

          {/* Trust Row */}
          <div style={styles.trustRow}>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>🚚</span>
              <span style={styles.trustText}>Free Delivery</span>
            </div>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>↩️</span>
              <span style={styles.trustText}>Easy Returns</span>
            </div>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>🔒</span>
              <span style={styles.trustText}>Secure Pay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={styles.reviewsSection}>
        <div style={styles.reviewsHeader}>
          <h2 style={styles.reviewsTitle}>Customer Reviews</h2>
          {product.reviews.length > 0 && (
            <div style={styles.ratingOverview}>
              <span style={styles.bigRating}>{product.rating.toFixed(1)}</span>
              <div>
                <div style={styles.starsRow}>{renderStars(product.rating, 20)}</div>
                <p style={styles.reviewCountText}>
                  Based on {product.numReviews} review{product.numReviews !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}
        </div>

        <div style={styles.reviewsLayout}>
          {/* Left: Reviews List */}
          <div style={styles.reviewsList}>
            {product.reviews.length === 0 ? (
              <div style={styles.noReviewsBox}>
                <p style={styles.noReviewsIcon}>💬</p>
                <p style={styles.noReviewsText}>No reviews yet — be the first!</p>
              </div>
            ) : (
              product.reviews.map((review) => (
                <div key={review._id} style={styles.reviewCard}>
                  <div style={styles.reviewTop}>
                    <div style={styles.reviewAvatar}>
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.reviewMeta}>
                      <p style={styles.reviewerName}>{review.name}</p>
                      <p style={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div style={styles.reviewRating}>
                      <div style={styles.starsRow}>{renderStars(review.rating, 14)}</div>
                      <span style={styles.reviewRatingNum}>{review.rating}/5</span>
                    </div>
                  </div>
                  <p style={styles.reviewComment}>{review.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Right: Write Review */}
          <div style={styles.writeReviewBox}>
            <h3 style={styles.writeReviewTitle}>Write a Review</h3>

            {!userInfo ? (
              <div style={styles.loginPromptBox}>
                <p style={styles.loginPromptText}>
                  Sign in to share your experience with this product.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  style={styles.loginPromptBtn}
                >
                  Sign In to Review
                </button>
              </div>
            ) : (
              <form onSubmit={submitReviewHandler} style={styles.reviewForm}>
                {reviewSuccess && (
                  <div style={styles.successMsg}>
                    ✅ Review submitted successfully!
                  </div>
                )}
                {reviewError && (
                  <div style={styles.errorMsg}>⚠️ {reviewError}</div>
                )}

                <div style={styles.formField}>
                  <label style={styles.formLabel}>Your Rating</label>
                  <div style={styles.starSelector}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        style={{
                          fontSize: '32px',
                          cursor: 'pointer',
                          color: star <= (hoveredStar || rating) ? '#F5A623' : '#e0e0e0',
                          transition: 'color 0.1s',
                        }}
                      >★</span>
                    ))}
                    <span style={styles.ratingLabel}>
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hoveredStar || rating]}
                    </span>
                  </div>
                </div>

                <div style={styles.formField}>
                  <label style={styles.formLabel}>Your Review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={styles.textarea}
                    placeholder='Share your experience — what did you like or dislike?'
                    rows={5}
                    required
                  />
                  <p style={styles.charCount}>{comment.length} characters</p>
                </div>

                <button
                  type='submit'
                  style={{ ...styles.submitBtn, opacity: reviewLoading ? 0.8 : 1 }}
                  disabled={reviewLoading}
                >
                  {reviewLoading ? 'Submitting...' : '📝 Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto' },

  // Loading
  loadingBox: { padding: '40px 0' },
  loadingGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 300px',
    gap: '30px',
  },
  loadingSkeleton: {
    height: '380px', borderRadius: '16px',
    backgroundColor: '#e0e0e0',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  loadingLine: {
    height: '16px', borderRadius: '8px',
    backgroundColor: '#e0e0e0',
    animation: 'pulse 1.5s ease-in-out infinite',
  },

  // Error
  errorBox: {
    textAlign: 'center', padding: '80px 20px',
    backgroundColor: '#fff', borderRadius: '20px',
  },
  errorTitle: { fontSize: '24px', color: '#1a1a2e', margin: '0 0 20px' },
  backBtnSolid: {
    backgroundColor: '#0f1923', color: '#FFD814',
    border: 'none', padding: '12px 28px',
    borderRadius: '10px', fontWeight: '700',
    fontSize: '14px', cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },

  // Breadcrumb
  breadcrumb: {
    display: 'flex', alignItems: 'center',
    gap: '8px', marginBottom: '24px',
  },
  breadcrumbLink: {
    fontSize: '13px', color: '#6b7280',
    cursor: 'pointer', fontWeight: '500',
  },
  breadcrumbSep: { color: '#d1d5db', fontSize: '13px' },
  breadcrumbCurrent: {
    fontSize: '13px', color: '#1a1a2e',
    fontWeight: '600',
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  // Main Layout
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr 300px',
    gap: '32px',
    marginBottom: '48px',
    alignItems: 'start',
  },

  // Image
  imageSection: {},
  imageWrapper: {
    position: 'relative',
    backgroundColor: '#f8f9fa',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #f0f0f0',
  },
  image: { width: '100%', display: 'block', objectFit: 'cover', maxHeight: '420px' },
  outOfStockBadge: {
    position: 'absolute', top: '16px', left: '16px',
    backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff',
    padding: '6px 14px', borderRadius: '20px',
    fontSize: '12px', fontWeight: '600',
  },

  // Info
  infoSection: { display: 'flex', flexDirection: 'column', gap: '14px' },
  brandLabel: {
    fontSize: '11px', fontWeight: '700',
    color: '#9ca3af', textTransform: 'uppercase',
    letterSpacing: '1px', margin: 0,
  },
  productName: {
    fontSize: '26px', fontWeight: '800',
    color: '#1a1a2e', margin: 0,
    lineHeight: '1.3', letterSpacing: '-0.5px',
  },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  starsRow: { display: 'flex', gap: '2px' },
  ratingNumber: { fontSize: '15px', fontWeight: '700', color: '#F5A623' },
  ratingCount: { fontSize: '13px', color: '#9ca3af' },
  tagRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  categoryTag: {
    backgroundColor: '#eef2ff', color: '#4f46e5',
    fontSize: '12px', fontWeight: '600',
    padding: '4px 12px', borderRadius: '20px',
  },
  lowStockTag: {
    backgroundColor: '#fef2f2', color: '#dc2626',
    fontSize: '12px', fontWeight: '600',
    padding: '4px 12px', borderRadius: '20px',
    border: '1px solid #fecaca',
  },

  // Tabs
  tabs: {
    display: 'flex', gap: '0',
    borderBottom: '1px solid #f0f0f0',
  },
  tab: {
    padding: '10px 20px', fontSize: '14px',
    background: 'none', border: 'none',
    cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
    transition: 'all 0.2s',
  },
  description: {
    fontSize: '14px', color: '#6b7280',
    lineHeight: '1.8', margin: 0,
  },
  detailsTable: {
    border: '1px solid #f0f0f0',
    borderRadius: '10px', overflow: 'hidden',
  },
  detailRow: {
    display: 'flex', padding: '12px 16px',
    borderBottom: '1px solid #f9f9f9',
    backgroundColor: '#fff',
  },
  detailKey: {
    width: '120px', fontSize: '13px',
    color: '#9ca3af', fontWeight: '600', flexShrink: 0,
  },
  detailVal: { fontSize: '13px', color: '#1a1a2e', fontWeight: '500' },

  // Buy Box
  buyBox: {
    backgroundColor: '#fff',
    border: '1px solid #f0f0f0',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    position: 'sticky',
    top: '88px',
  },
  priceSection: {},
  price: {
    fontSize: '30px', fontWeight: '800',
    color: '#1a1a2e', margin: '0 0 2px',
    letterSpacing: '-1px',
  },
  priceNote: { fontSize: '11px', color: '#9ca3af', margin: 0 },
  stockBadge: {
    padding: '8px 14px', borderRadius: '8px',
    fontSize: '13px', fontWeight: '600',
    textAlign: 'center',
  },
  qtySection: {},
  qtyLabel: {
    fontSize: '12px', fontWeight: '700',
    color: '#6b7280', textTransform: 'uppercase',
    letterSpacing: '0.5px', display: 'block',
    marginBottom: '8px',
  },
  qtyControl: {
    display: 'flex', alignItems: 'center',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px', overflow: 'hidden',
    width: 'fit-content',
  },
  qtyBtn: {
    backgroundColor: '#f9fafb', border: 'none',
    width: '38px', height: '40px',
    fontSize: '20px', cursor: 'pointer',
    fontWeight: '400', color: '#374151',
    fontFamily: 'Poppins, sans-serif',
  },
  qtyDisplay: {
    width: '44px', textAlign: 'center',
    fontSize: '15px', fontWeight: '700',
    color: '#1a1a2e',
    borderLeft: '1px solid #e5e7eb',
    borderRight: '1px solid #e5e7eb',
    lineHeight: '40px',
  },
  cartBtn: {
    width: '100%', border: 'none',
    padding: '14px', borderRadius: '10px',
    fontWeight: '700', fontSize: '15px',
    cursor: 'pointer', letterSpacing: '0.3px',
    fontFamily: 'Poppins, sans-serif',
    transition: 'all 0.3s',
  },
  goToCartBtn: {
    width: '100%', backgroundColor: '#fff',
    border: '1.5px solid #e5e7eb', color: '#374151',
    padding: '12px', borderRadius: '10px',
    fontWeight: '600', fontSize: '14px',
    cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
  },
  wishlistBtn: {
    width: '100%', padding: '11px',
    borderRadius: '10px', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    transition: 'all 0.2s',
  },
  trustRow: {
    display: 'flex', justifyContent: 'space-between',
    paddingTop: '12px',
    borderTop: '1px solid #f0f0f0',
  },
  trustItem: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '4px',
  },
  trustIcon: { fontSize: '18px' },
  trustText: { fontSize: '10px', color: '#9ca3af', fontWeight: '500', textAlign: 'center' },

  // Reviews
  reviewsSection: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  },
  reviewsHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '28px',
  },
  reviewsTitle: {
    fontSize: '22px', fontWeight: '800',
    color: '#1a1a2e', margin: 0,
  },
  ratingOverview: {
    display: 'flex', alignItems: 'center', gap: '16px',
    backgroundColor: '#f8f9fa', padding: '12px 20px',
    borderRadius: '12px',
  },
  bigRating: {
    fontSize: '40px', fontWeight: '800',
    color: '#1a1a2e', lineHeight: 1,
  },
  reviewCountText: { fontSize: '12px', color: '#9ca3af', margin: '4px 0 0' },
  reviewsLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '32px',
    alignItems: 'start',
  },
  reviewsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  noReviewsBox: {
    textAlign: 'center', padding: '40px',
    backgroundColor: '#f8f9fa', borderRadius: '12px',
  },
  noReviewsIcon: { fontSize: '36px', margin: '0 0 8px' },
  noReviewsText: { color: '#9ca3af', fontSize: '15px', margin: 0 },
  reviewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '18px 20px',
    border: '1px solid #f0f0f0',
  },
  reviewTop: {
    display: 'flex', alignItems: 'center',
    gap: '12px', marginBottom: '12px',
  },
  reviewAvatar: {
    width: '38px', height: '38px',
    borderRadius: '50%', backgroundColor: '#0f1923',
    color: '#FFD814', fontWeight: '800',
    fontSize: '16px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  reviewMeta: { flex: 1 },
  reviewerName: { fontWeight: '700', margin: '0 0 2px', fontSize: '14px', color: '#1a1a2e' },
  reviewDate: { color: '#9ca3af', fontSize: '12px', margin: 0 },
  reviewRating: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' },
  reviewRatingNum: { fontSize: '12px', color: '#F5A623', fontWeight: '700' },
  reviewComment: {
    color: '#4b5563', fontSize: '14px',
    margin: 0, lineHeight: '1.7',
  },

  // Write Review
  writeReviewBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: '16px', padding: '24px',
    border: '1px solid #f0f0f0',
    position: 'sticky', top: '88px',
  },
  writeReviewTitle: {
    fontSize: '17px', fontWeight: '700',
    color: '#1a1a2e', margin: '0 0 20px',
  },
  loginPromptBox: { textAlign: 'center', padding: '20px 0' },
  loginPromptText: { color: '#6b7280', fontSize: '14px', marginBottom: '16px' },
  loginPromptBtn: {
    backgroundColor: '#0f1923', color: '#FFD814',
    border: 'none', padding: '12px 24px',
    borderRadius: '10px', fontWeight: '700',
    fontSize: '14px', cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },
  reviewForm: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formField: { display: 'flex', flexDirection: 'column', gap: '6px' },
  formLabel: {
    fontSize: '12px', fontWeight: '700',
    color: '#374151', textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  starSelector: { display: 'flex', alignItems: 'center', gap: '4px' },
  ratingLabel: {
    fontSize: '13px', color: '#F5A623',
    fontWeight: '600', marginLeft: '8px',
  },
  textarea: {
    padding: '12px 14px', borderRadius: '10px',
    border: '1.5px solid #e5e7eb', fontSize: '14px',
    outline: 'none', resize: 'vertical',
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: '#fff', lineHeight: '1.6',
  },
  charCount: { fontSize: '11px', color: '#9ca3af', margin: 0, textAlign: 'right' },
  submitBtn: {
    backgroundColor: '#0f1923', color: '#FFD814',
    border: 'none', padding: '13px 24px',
    borderRadius: '10px', fontWeight: '700',
    fontSize: '14px', cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    transition: 'opacity 0.2s',
  },
  successMsg: {
    backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
    color: '#16a34a', padding: '12px 16px',
    borderRadius: '10px', fontSize: '14px',
    fontWeight: '500',
  },
  errorMsg: {
    backgroundColor: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', padding: '12px 16px',
    borderRadius: '10px', fontSize: '14px',
  },
};

export default ProductDetailPage;