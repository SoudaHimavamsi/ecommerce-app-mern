import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const moveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
    navigate('/cart');
  };

  if (wishlistItems.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyIcon}>🤍</p>
        <h2 style={styles.emptyTitle}>Your wishlist is empty</h2>
        <p style={styles.emptyText}>
          Save items you love by clicking the heart icon on any product.
        </p>
        <Link to='/' style={styles.shopBtn}>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        ❤️ My Wishlist
        <span style={styles.count}>{wishlistItems.length} items</span>
      </h2>

      <div style={styles.grid}>
        {wishlistItems.map((product) => (
          <div key={product._id} style={styles.card}>
            {/* Image */}
            <Link to={`/product/${product._id}`}>
              <img
                src={product.image}
                alt={product.name}
                style={styles.image}
              />
            </Link>

            {/* Info */}
            <div style={styles.info}>
              <Link to={`/product/${product._id}`} style={styles.name}>
                {product.name}
              </Link>
              <p style={styles.brand}>{product.brand}</p>
              <p style={styles.rating}>
                ⭐ {product.rating} ({product.numReviews} reviews)
              </p>
              <p style={styles.price}>₹{product.price.toLocaleString()}</p>

              {/* Buttons */}
              <div style={styles.btnRow}>
                <button
                  onClick={() => moveToCart(product)}
                  style={styles.cartBtn}
                >
                  🛒 Move to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  style={styles.removeBtn}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto' },
  heading: {
    fontSize: '24px',
    marginBottom: '24px',
    color: '#131921',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  count: {
    fontSize: '14px',
    backgroundColor: '#f0f2f5',
    padding: '4px 12px',
    borderRadius: '20px',
    color: '#555',
    fontWeight: 'normal',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '20px',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    display: 'block',
  },
  info: {
    padding: '14px',
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
  rating: { fontSize: '13px', color: '#f0a500', margin: 0 },
  price: { fontSize: '18px', fontWeight: 'bold', color: '#B12704', margin: 0 },
  btnRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '6px',
  },
  cartBtn: {
    flex: 1,
    backgroundColor: '#FFD814',
    border: 'none',
    padding: '9px 12px',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#131921',
  },
  removeBtn: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    padding: '9px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#B12704',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyIcon: { fontSize: '60px', margin: '0 0 16px' },
  emptyTitle: { fontSize: '24px', color: '#131921', marginBottom: '8px' },
  emptyText: { color: '#888', fontSize: '15px', marginBottom: '24px' },
  shopBtn: {
    backgroundColor: '#FFD814',
    padding: '12px 28px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#131921',
    fontWeight: 'bold',
    display: 'inline-block',
  },
};

export default WishlistPage;