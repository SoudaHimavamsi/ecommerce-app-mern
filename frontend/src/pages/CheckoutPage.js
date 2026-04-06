import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    fullName: userInfo ? userInfo.name : '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty, 0
  );
  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.qty, 0
  );

  if (!userInfo) {
    return (
      <div style={styles.centered}>
        <h2>Please log in to checkout</h2>
        <button onClick={() => navigate('/login')} style={styles.yellowBtn}>
          Go to Login
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={styles.centered}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/')} style={styles.yellowBtn}>
          Go Shopping
        </button>
      </div>
    );
  }

  const placeOrderHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems: cartItems.map((item) => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id,
          })),
          shippingAddress: address,
          paymentMethod,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      clearCart();
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Checkout</h2>

      {error && <p style={styles.error}>{error}</p>}

      {/* Step Indicator */}
      <div style={styles.steps}>
        {['Shipping', 'Payment', 'Review'].map((label, i) => (
          <div key={i} style={styles.stepItem}>
            <div
              style={{
                ...styles.stepCircle,
                backgroundColor: step >= i + 1 ? '#131921' : '#ddd',
                color: step >= i + 1 ? '#FFD814' : '#888',
              }}
            >
              {i + 1}
            </div>
            <span
              style={{
                ...styles.stepLabel,
                color: step >= i + 1 ? '#131921' : '#aaa',
                fontWeight: step === i + 1 ? 'bold' : 'normal',
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <div style={styles.layout}>
        {/* Left: Form Steps */}
        <div style={styles.formBox}>

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div>
              <h3 style={styles.stepTitle}>Shipping Address</h3>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    style={styles.input}
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder='Full name'
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    style={styles.input}
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder='10-digit phone number'
                  />
                </div>
                <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>Street Address</label>
                  <input
                    style={styles.input}
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder='House no, Street, Area'
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>City</label>
                  <input
                    style={styles.input}
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder='City'
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>State</label>
                  <input
                    style={styles.input}
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder='State'
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Pincode</label>
                  <input
                    style={styles.input}
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    placeholder='6-digit pincode'
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (!address.street || !address.city || !address.pincode) {
                    alert('Please fill in all address fields');
                    return;
                  }
                  setStep(2);
                }}
                style={styles.yellowBtn}
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div>
              <h3 style={styles.stepTitle}>Payment Method</h3>
              <div style={styles.paymentOptions}>
                {[
                  { value: 'COD', label: '💵 Cash on Delivery' },
                  { value: 'UPI', label: '📱 UPI Payment' },
                  { value: 'Card', label: '💳 Credit / Debit Card' },
                ].map((option) => (
                  <label key={option.value} style={styles.paymentOption}>
                    <input
                      type='radio'
                      name='payment'
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ marginRight: '10px' }}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
              <div style={styles.btnRow}>
                <button onClick={() => setStep(1)} style={styles.backBtn}>← Back</button>
                <button onClick={() => setStep(3)} style={styles.yellowBtn}>Continue to Review →</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div>
              <h3 style={styles.stepTitle}>Review Your Order</h3>
              <div style={styles.reviewItems}>
                {cartItems.map((item) => (
                  <div key={item._id} style={styles.reviewItem}>
                    <img src={item.image} alt={item.name} style={styles.reviewImage} />
                    <div style={{ flex: 1 }}>
                      <p style={styles.reviewName}>{item.name}</p>
                      <p style={styles.reviewMeta}>
                        Qty: {item.qty} × ₹{item.price.toLocaleString()} ={' '}
                        <strong>₹{(item.qty * item.price).toLocaleString()}</strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={styles.reviewSection}>
                <p style={styles.reviewSectionTitle}>📦 Shipping To</p>
                <p style={styles.reviewMeta}>
                  {address.fullName}, {address.street}, {address.city},{' '}
                  {address.state} - {address.pincode}
                </p>
                <p style={styles.reviewMeta}>📞 {address.phone}</p>
              </div>
              <div style={styles.reviewSection}>
                <p style={styles.reviewSectionTitle}>💳 Payment</p>
                <p style={styles.reviewMeta}>
                  {paymentMethod === 'COD' ? 'Cash on Delivery'
                    : paymentMethod === 'UPI' ? 'UPI Payment'
                    : 'Credit / Debit Card'}
                </p>
              </div>
              <div style={styles.btnRow}>
                <button onClick={() => setStep(2)} style={styles.backBtn}>← Back</button>
                <button
                  onClick={placeOrderHandler}
                  style={styles.placeOrderBtn}
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : `🛒 Place Order · ₹${totalPrice.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item._id} style={styles.summaryItem}>
              <span>{item.name} × {item.qty}</span>
              <span>₹{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <hr />
          <div style={styles.summaryItem}>
            <span>Items ({totalItems})</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
          <div style={styles.summaryItem}>
            <span>Delivery</span>
            <span style={{ color: 'green' }}>FREE</span>
          </div>
          <div style={{ ...styles.summaryItem, fontWeight: 'bold', fontSize: '17px' }}>
            <span>Total</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto' },
  heading: { fontSize: '24px', marginBottom: '20px', color: '#131921' },
  error: {
    backgroundColor: '#fff0f0',
    border: '1px solid #f5c6c6',
    color: '#B12704',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  steps: { display: 'flex', gap: '32px', marginBottom: '30px', alignItems: 'center' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  stepCircle: {
    width: '32px', height: '32px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 'bold', fontSize: '14px',
  },
  stepLabel: { fontSize: '14px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px', alignItems: 'start' },
  formBox: { border: '1px solid #ddd', borderRadius: '8px', padding: '24px', backgroundColor: '#fff' },
  stepTitle: { fontSize: '18px', marginBottom: '20px', color: '#131921' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: 'bold', color: '#131921' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' },
  paymentOptions: { display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' },
  paymentOption: { border: '1px solid #ddd', borderRadius: '6px', padding: '14px', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center' },
  btnRow: { display: 'flex', gap: '12px', marginTop: '16px' },
  yellowBtn: { backgroundColor: '#FFD814', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', color: '#131921' },
  backBtn: { backgroundColor: '#fff', border: '1px solid #ccc', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  placeOrderBtn: { backgroundColor: '#f08804', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', color: '#fff', flex: 1 },
  summary: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '10px' },
  summaryTitle: { fontSize: '18px', margin: 0 },
  summaryItem: { display: 'flex', justifyContent: 'space-between', fontSize: '14px' },
  reviewItems: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' },
  reviewItem: { display: 'flex', gap: '12px', alignItems: 'center', padding: '10px', border: '1px solid #eee', borderRadius: '6px' },
  reviewImage: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' },
  reviewName: { fontWeight: 'bold', margin: '0 0 4px', fontSize: '14px' },
  reviewMeta: { color: '#555', fontSize: '13px', margin: 0 },
  reviewSection: { border: '1px solid #eee', borderRadius: '6px', padding: '12px', marginBottom: '12px' },
  reviewSectionTitle: { fontWeight: 'bold', margin: '0 0 6px', fontSize: '14px' },
  centered: { textAlign: 'center', padding: '60px' },
};

export default CheckoutPage;