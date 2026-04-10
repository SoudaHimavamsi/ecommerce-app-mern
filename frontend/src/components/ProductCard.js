import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product._id);

  const toggleWishlist = (e) => {
    e.preventDefault();
    if (wishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div style={styles.card}>
      {/* Image + Wishlist Button */}
      <div style={styles.imageWrapper}>
        <Link to={`/product/${product._id}`}>
          <img src={product.image} alt={product.name} style={styles.image} />
        </Link>
        <button
          onClick={toggleWishlist}
          style={{
            ...styles.wishlistBtn,
            backgroundColor: wishlisted ? '#fff0f0' : '#fff',
            color: wishlisted ? '#e53935' : '#aaa',
          }}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      <div style={styles.info}>
        <Link to={`/product/${product._id}`} style={styles.name}>
          {product.name}
        </Link>
        <p style={styles.brand}>{product.brand}</p>
        <div style={styles.rating}>
          ⭐ {product.rating} ({product.numReviews} reviews)
        </div>
        <p style={styles.price}>₹{product.price.toLocaleString()}</p>
        <Link to={`/product/${product._id}`} style={styles.button}>
          View Details
        </Link>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    display: 'block',
  },
  wishlistBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    border: '1px solid #eee',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
  },
  info: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  name: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#131921',
    textDecoration: 'none',
  },
  brand: { fontSize: '13px', color: '#888', margin: 0 },
  rating: { fontSize: '13px', color: '#f0a500' },
  price: { fontSize: '18px', fontWeight: 'bold', color: '#B12704', margin: 0 },
  button: {
    backgroundColor: '#FFD814',
    color: '#131921',
    padding: '8px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    marginTop: '6px',
  },
};

export default ProductCard;