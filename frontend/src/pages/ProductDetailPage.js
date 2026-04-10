import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { userInfo } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError('Product not found');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError(null);
    setReviewSuccess(false);

    try {
      await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setReviewSuccess(true);
      setComment('');
      setRating(5);
      fetchProduct(); // Refresh to show new review
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    }
    setReviewLoading(false);
  };

  const renderStars = (value) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star} style={{ color: star <= value ? '#f0a500' : '#ddd', fontSize: '18px' }}>
        ★
      </span>
    ));
  };

  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center' }}>{error}</h2>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={styles.backBtn}>
        ← Back to Products
      </button>

      {/* Product Info Section */}
      <div style={styles.layout}>
        {/* Image */}
        <div style={styles.imageBox}>
          <img src={product.image} alt={product.name} style={styles.image} />
        </div>

        {/* Info */}
        <div style={styles.info}>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.brand}>Brand: {product.brand}</p>
          <div style={styles.ratingRow}>
            {renderStars(product.rating)}
            <span style={styles.ratingText}>
              {product.rating.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>
          <p style={styles.category}>Category: {product.category}</p>
          <p style={styles.description}>{product.description}</p>
        </div>

        {/* Buy Box */}
        <div style={styles.buyBox}>
          <p style={styles.price}>₹{product.price.toLocaleString()}</p>
          <p style={styles.stock}>
            Status:{' '}
            <span style={{ color: product.countInStock > 0 ? 'green' : 'red' }}>
              {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </p>
          {product.countInStock > 0 && (
            <>
              <div style={styles.qtyRow}>
                <label style={styles.label}>Qty:</label>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  style={styles.select}
                >
                  {[...Array(Math.min(product.countInStock, 5)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
              </div>
              <button onClick={addToCartHandler} style={styles.cartBtn}>
                Add to Cart
              </button>
            </>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div style={styles.reviewsSection}>
        <h2 style={styles.reviewsTitle}>Customer Reviews</h2>

        {/* Existing Reviews */}
        {product.reviews.length === 0 ? (
          <p style={styles.noReviews}>No reviews yet. Be the first to review!</p>
        ) : (
          <div style={styles.reviewsList}>
            {product.reviews.map((review) => (
              <div key={review._id} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <div style={styles.reviewerAvatar}>
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={styles.reviewerName}>{review.name}</p>
                    <p style={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div style={styles.reviewStars}>
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p style={styles.reviewComment}>{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Write a Review */}
        <div style={styles.writeReview}>
          <h3 style={styles.writeReviewTitle}>Write a Review</h3>

          {!userInfo ? (
            <p style={styles.loginPrompt}>
              Please{' '}
              <span
                onClick={() => navigate('/login')}
                style={styles.loginLink}
              >
                log in
              </span>{' '}
              to write a review.
            </p>
          ) : (
            <form onSubmit={submitReviewHandler} style={styles.reviewForm}>
              {reviewSuccess && (
                <p style={styles.successMsg}>✅ Review submitted successfully!</p>
              )}
              {reviewError && (
                <p style={styles.errorMsg}>{reviewError}</p>
              )}

              <div style={styles.formField}>
                <label style={styles.formLabel}>Your Rating</label>
                <div style={styles.starSelector}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        fontSize: '28px',
                        cursor: 'pointer',
                        color: star <= rating ? '#f0a500' : '#ddd',
                      }}
                    >
                      ★
                    </span>
                  ))}
                  <span style={{ fontSize: '14px', color: '#888', marginLeft: '8px' }}>
                    {rating}/5
                  </span>
                </div>
              </div>

              <div style={styles.formField}>
                <label style={styles.formLabel}>Your Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={styles.textarea}
                  placeholder='Share your experience with this product...'
                  rows={4}
                  required
                />
              </div>

              <button
                type='submit'
                style={styles.submitBtn}
                disabled={reviewLoading}
              >
                {reviewLoading ? 'Submitting...' : '📝 Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto' },
  backBtn: {
    background: 'none', border: '1px solid #ccc', padding: '8px 14px',
    borderRadius: '6px', cursor: 'pointer', marginBottom: '20px', fontSize: '14px',
  },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr 300px', gap: '30px', marginBottom: '40px' },
  imageBox: { borderRadius: '8px', overflow: 'hidden' },
  image: { width: '100%', borderRadius: '8px', objectFit: 'cover' },
  info: { display: 'flex', flexDirection: 'column', gap: '10px' },
  name: { fontSize: '22px', color: '#131921', margin: 0 },
  brand: { color: '#555', margin: 0 },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '6px' },
  ratingText: { fontSize: '14px', color: '#888' },
  category: { color: '#555', margin: 0 },
  description: { color: '#333', lineHeight: '1.6' },
  buyBox: {
    border: '1px solid #ddd', borderRadius: '8px', padding: '20px',
    display: 'flex', flexDirection: 'column', gap: '14px',
    height: 'fit-content', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  price: { fontSize: '26px', fontWeight: 'bold', color: '#B12704', margin: 0 },
  stock: { fontSize: '15px', margin: 0 },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  label: { fontSize: '15px' },
  select: { padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' },
  cartBtn: {
    backgroundColor: '#FFD814', border: 'none', padding: '12px',
    borderRadius: '8px', fontWeight: 'bold', fontSize: '15px',
    cursor: 'pointer', color: '#131921',
  },
  reviewsSection: { borderTop: '2px solid #eee', paddingTop: '30px' },
  reviewsTitle: { fontSize: '22px', marginBottom: '20px', color: '#131921' },
  noReviews: { color: '#888', fontStyle: 'italic' },
  reviewsList: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' },
  reviewCard: {
    border: '1px solid #eee', borderRadius: '8px',
    padding: '16px', backgroundColor: '#fff',
  },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' },
  reviewerAvatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    backgroundColor: '#131921', color: '#FFD814',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 'bold', fontSize: '16px', flexShrink: 0,
  },
  reviewerName: { fontWeight: 'bold', margin: '0 0 2px', fontSize: '14px' },
  reviewDate: { color: '#888', fontSize: '12px', margin: 0 },
  reviewStars: { marginLeft: 'auto' },
  reviewComment: { color: '#333', fontSize: '14px', margin: 0, lineHeight: '1.6' },
  writeReview: {
    backgroundColor: '#f7f8fa', border: '1px solid #eee',
    borderRadius: '8px', padding: '24px',
  },
  writeReviewTitle: { fontSize: '18px', marginBottom: '16px', color: '#131921' },
  loginPrompt: { color: '#555', fontSize: '15px' },
  loginLink: { color: '#0066c0', cursor: 'pointer', textDecoration: 'underline' },
  reviewForm: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formField: { display: 'flex', flexDirection: 'column', gap: '6px' },
  formLabel: { fontSize: '13px', fontWeight: 'bold', color: '#131921' },
  starSelector: { display: 'flex', alignItems: 'center', gap: '4px' },
  textarea: {
    padding: '10px', borderRadius: '6px', border: '1px solid #ccc',
    fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit',
  },
  submitBtn: {
    backgroundColor: '#FFD814', border: 'none', padding: '12px 24px',
    borderRadius: '8px', fontWeight: 'bold', fontSize: '15px',
    cursor: 'pointer', color: '#131921', alignSelf: 'flex-start',
  },
  successMsg: {
    backgroundColor: '#e6f4ea', border: '1px solid #a8d5b5',
    color: '#1a5c2a', padding: '10px', borderRadius: '6px', fontSize: '14px',
  },
  errorMsg: {
    backgroundColor: '#fff0f0', border: '1px solid #f5c6c6',
    color: '#B12704', padding: '10px', borderRadius: '6px', fontSize: '14px',
  },
};

export default ProductDetailPage;