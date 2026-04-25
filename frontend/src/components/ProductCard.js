import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const CARD_CSS = `
  .sk-card-img { width:100%; height:210px; object-fit:cover; display:block; transition:transform 0.35s ease; }
  @media (max-width: 480px) {
    .sk-card-img { height: 150px; }
  }
`;
let cardCssInjected = false;

const ProductCard = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [hovered, setHovered] = useState(false);
  const wishlisted = isInWishlist(product._id);

  useEffect(() => {
    if (!cardCssInjected) {
      const style = document.createElement('style');
      style.textContent = CARD_CSS;
      document.head.appendChild(style);
      cardCssInjected = true;
    }
  }, []);

  const toggleWishlist = (e) => {
    e.preventDefault();
    wishlisted ? removeFromWishlist(product._id) : addToWishlist(product);
  };

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star} style={{ color: star <= Math.round(rating) ? '#F5A623' : '#E0E0E0', fontSize: '13px' }}>★</span>
    ));
  };

  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.14)' : '0 2px 12px rgba(0,0,0,0.07)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.imageWrapper}>
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className='sk-card-img'
            style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        </Link>
        <button
          onClick={toggleWishlist}
          style={{
            ...styles.wishlistBtn,
            background: wishlisted ? '#ffe0e0' : 'rgba(255,255,255,0.95)',
            color: wishlisted ? '#e53935' : '#bbb',
          }}
        >
          {wishlisted ? '❤️' : '♡'}
        </button>
        {product.countInStock === 0 && (
          <div style={styles.outOfStockOverlay}>
            <span style={styles.outOfStockText}>Out of Stock</span>
          </div>
        )}
      </div>

      <div style={styles.info}>
        <p style={styles.brand}>{product.brand}</p>
        <Link to={`/product/${product._id}`} style={styles.name}>
          {product.name.length > 42 ? product.name.substring(0, 42) + '...' : product.name}
        </Link>
        <div style={styles.ratingRow}>
          <div style={styles.stars}>{renderStars(product.rating)}</div>
          <span style={styles.ratingText}>
            {product.rating.toFixed(1)}<span style={styles.reviewCount}> ({product.numReviews})</span>
          </span>
        </div>
        <div style={styles.priceRow}>
          <span style={styles.price}>₹{product.price.toLocaleString()}</span>
          {product.countInStock > 0 && product.countInStock <= 5 && (
            <span style={styles.lowStockBadge}>Only {product.countInStock} left!</span>
          )}
        </div>
        <Link
          to={`/product/${product._id}`}
          style={{
            ...styles.button,
            background: product.countInStock === 0 ? '#e0e0e0' : '#FFD814',
            color: product.countInStock === 0 ? '#999' : '#111',
            pointerEvents: product.countInStock === 0 ? 'none' : 'auto',
          }}
        >
          {product.countInStock === 0 ? 'Unavailable' : 'View Details'}
        </Link>
      </div>
    </div>
  );
};

const styles = {
  card: { borderRadius:'14px', overflow:'hidden', backgroundColor:'#fff', display:'flex', flexDirection:'column', transition:'transform 0.25s ease, box-shadow 0.25s ease', border:'1px solid #f0f0f0', cursor:'pointer' },
  imageWrapper: { position:'relative', overflow:'hidden', backgroundColor:'#f8f8f8' },
  wishlistBtn: { position:'absolute', top:'10px', right:'10px', border:'none', borderRadius:'50%', width:'34px', height:'34px', fontSize:'15px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.12)', transition:'transform 0.2s' },
  outOfStockOverlay: { position:'absolute', inset:0, backgroundColor:'rgba(255,255,255,0.65)', display:'flex', alignItems:'center', justifyContent:'center' },
  outOfStockText: { backgroundColor:'#333', color:'#fff', padding:'6px 16px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', letterSpacing:'0.5px' },
  info: { padding:'14px 16px 16px', display:'flex', flexDirection:'column', gap:'6px', flex:1 },
  brand: { fontSize:'11px', fontWeight:'600', color:'#999', textTransform:'uppercase', letterSpacing:'0.8px', margin:0 },
  name: { fontSize:'14px', fontWeight:'600', color:'#1a1a2e', textDecoration:'none', lineHeight:'1.4', flex:1 },
  ratingRow: { display:'flex', alignItems:'center', gap:'6px' },
  stars: { display:'flex', gap:'1px' },
  ratingText: { fontSize:'12px', fontWeight:'600', color:'#F5A623' },
  reviewCount: { color:'#aaa', fontWeight:'400' },
  priceRow: { display:'flex', alignItems:'center', gap:'8px', marginTop:'2px' },
  price: { fontSize:'20px', fontWeight:'700', color:'#0f3460', letterSpacing:'-0.5px' },
  lowStockBadge: { fontSize:'10px', fontWeight:'600', color:'#c0392b', backgroundColor:'#fdecea', padding:'2px 8px', borderRadius:'10px', border:'1px solid #f5c6c6' },
  button: { display:'block', textAlign:'center', padding:'10px', borderRadius:'8px', fontWeight:'700', fontSize:'13px', textDecoration:'none', marginTop:'6px', letterSpacing:'0.3px', transition:'opacity 0.2s' },
};

export default ProductCard;
