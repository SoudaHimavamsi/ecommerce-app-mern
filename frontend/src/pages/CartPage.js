import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div style={styles.empty}>
        <h2>Your cart is empty</h2>
        <Link to='/' style={styles.shopBtn}>
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Shopping Cart</h2>

      <div style={styles.layout}>
        {/* Cart Items */}
        <div style={styles.itemsList}>
          {cartItems.map((item) => (
            <div key={item._id} style={styles.item}>
              <img src={item.image} alt={item.name} style={styles.image} />

              <div style={styles.itemInfo}>
                <Link to={`/product/${item._id}`} style={styles.itemName}>
                  {item.name}
                </Link>
                <p style={styles.itemBrand}>{item.brand}</p>
                <p style={styles.itemPrice}>₹{item.price.toLocaleString()}</p>
              </div>

              <div style={styles.qtyBox}>
                <select
                  value={item.qty}
                  onChange={(e) => addToCart(item, Number(e.target.value))}
                  style={styles.select}
                >
                  {[...Array(Math.min(item.countInStock, 5)).keys()].map(
                    (x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    )
                  )}
                </select>
              </div>

              <p style={styles.subtotal}>
                ₹{(item.price * item.qty).toLocaleString()}
              </p>

              <button
                onClick={() => removeFromCart(item._id)}
                style={styles.removeBtn}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          <div style={styles.summaryRow}>
            <span>Items ({totalItems})</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Delivery</span>
            <span style={{ color: 'green' }}>FREE</span>
          </div>
          <hr />
          <div style={styles.summaryTotal}>
            <span>Order Total</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            style={styles.checkoutBtn}
          >
            Proceed to Checkout
          </button>
          <Link to='/' style={styles.continueBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto' },
  heading: { fontSize: '24px', marginBottom: '20px', color: '#131921' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '12px',
    backgroundColor: '#fff',
  },
  image: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: '15px', fontWeight: 'bold', color: '#131921', textDecoration: 'none' },
  itemBrand: { color: '#888', fontSize: '13px', margin: '4px 0' },
  itemPrice: { color: '#B12704', fontWeight: 'bold', margin: 0 },
  qtyBox: {},
  select: { padding: '4px', borderRadius: '4px', border: '1px solid #ccc' },
  subtotal: { fontWeight: 'bold', minWidth: '80px', textAlign: 'right' },
  removeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#888',
  },
  summary: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fff',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  summaryTitle: { fontSize: '18px', margin: 0 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '15px' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '17px' },
  checkoutBtn: {
    backgroundColor: '#FFD814',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    color: '#131921',
  },
  continueBtn: {
    textAlign: 'center',
    color: '#0066c0',
    fontSize: '14px',
    textDecoration: 'none',
  },
  empty: { textAlign: 'center', padding: '60px' },
  shopBtn: {
    backgroundColor: '#FFD814',
    padding: '10px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#131921',
    fontWeight: 'bold',
    display: 'inline-block',
    marginTop: '16px',
  },
};

export default CartPage;