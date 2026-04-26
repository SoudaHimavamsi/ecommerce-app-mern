import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const WISHLIST_CSS = `
  .sk-wishlist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
  .sk-wishlist-card {
    border-radius: 12px; overflow: hidden; background: #fff;
    border: 1px solid #f0f0f0; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    display: flex; flex-direction: column;
  }
  .sk-wishlist-card-img {
    width: 100%; height: 180px; object-fit: cover; display: block;
  }
  .sk-wishlist-info { padding: 12px; display: flex; flex-direction: column; gap: 5px; flex: 1; }
  .sk-wishlist-name { font-size: 13px; font-weight: 600; color: #1a1a2e; text-decoration: none; line-height: 1.4; }
  .sk-wishlist-brand { font-size: 11px; color: #9ca3af; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
  .sk-wishlist-rating { font-size: 12px; color: #f0a500; margin: 0; }
  .sk-wishlist-price { font-size: 17px; font-weight: 700; color: #0f3460; margin: 0; }
  .sk-wishlist-btn-row { display: flex; gap: 6px; margin-top: 6px; }
  .sk-wishlist-cart-btn {
    flex: 1; background: #FFD814; border: none; padding: 8px 10px;
    border-radius: 7px; font-weight: 700; font-size: 12px;
    cursor: pointer; color: #131921;
  }
  .sk-wishlist-remove-btn {
    background: #fff; border: 1px solid #e5e7eb; padding: 8px 10px;
    border-radius: 7px; font-size: 13px; cursor: pointer;
    color: #ef4444; flex-shrink: 0;
  }
  @media (max-width: 480px) {
    .sk-wishlist-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
    .sk-wishlist-card-img { height: 130px !important; }
    .sk-wishlist-info { padding: 10px !important; }
    .sk-wishlist-price { font-size: 14px !important; }
    .sk-wishlist-cart-btn { font-size: 11px !important; padding: 7px 6px !important; }
  }
`;

let wlCssInjected = false;

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!wlCssInjected) {
      const style = document.createElement('style');
      style.textContent = WISHLIST_CSS;
      document.head.appendChild(style);
      wlCssInjected = true;
    }
  }, []);

  const moveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
    navigate('/cart');
  };

  if (wishlistItems.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={{ fontSize: '52px', margin: '0 0 14px' }}>🤍</p>
        <h2 style={{ fontSize: '20px', color: '#1a1a2e', margin: '0 0 8px' }}>Your wishlist is empty</h2>
        <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 20px' }}>
          Save items you love by clicking the heart icon on any product.
        </p>
        <Link to='/' style={styles.shopBtn}>Browse Products</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={styles.heading}>
        ❤️ My Wishlist
        <span style={styles.count}>{wishlistItems.length} items</span>
      </h2>

      <div className='sk-wishlist-grid'>
        {wishlistItems.map((product) => (
          <div key={product._id} className='sk-wishlist-card'>
            <Link to={`/product/${product._id}`}>
              <img
                src={product.image}
                alt={product.name}
                className='sk-wishlist-card-img'
              />
            </Link>
            <div className='sk-wishlist-info'>
              <p className='sk-wishlist-brand'>{product.brand}</p>
              <Link to={`/product/${product._id}`} className='sk-wishlist-name'>
                {product.name.length > 40 ? product.name.substring(0, 40) + '...' : product.name}
              </Link>
              <p className='sk-wishlist-rating'>⭐ {product.rating} ({product.numReviews})</p>
              <p className='sk-wishlist-price'>₹{product.price.toLocaleString()}</p>
              <div className='sk-wishlist-btn-row'>
                <button onClick={() => moveToCart(product)} className='sk-wishlist-cart-btn'>
                  🛒 Move to Cart
                </button>
                <button onClick={() => removeFromWishlist(product._id)} className='sk-wishlist-remove-btn'>
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
  heading: {
    fontSize: '22px', marginBottom: '20px', color: '#131921',
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  count: {
    fontSize: '13px', backgroundColor: '#f0f2f5',
    padding: '3px 10px', borderRadius: '20px',
    color: '#555', fontWeight: 'normal',
  },
  empty: { textAlign: 'center', padding: '60px 20px' },
  shopBtn: {
    backgroundColor: '#FFD814', padding: '11px 24px',
    borderRadius: '8px', textDecoration: 'none',
    color: '#131921', fontWeight: 'bold', display: 'inline-block',
  },
};

export default WishlistPage;
