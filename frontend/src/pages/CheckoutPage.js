import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const STEPS = ['Shipping', 'Payment', 'Review'];

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
  const [focusedField, setFocusedField] = useState(null);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  if (!userInfo) {
    return (
      <div style={styles.centeredPage}>
        <div style={styles.centeredBox}>
          <p style={styles.centeredIcon}>🔒</p>
          <h2 style={styles.centeredTitle}>Sign in to checkout</h2>
          <p style={styles.centeredText}>You need to be logged in to place an order.</p>
          <button onClick={() => navigate('/login')} style={styles.darkBtn}>
            Sign In →
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={styles.centeredPage}>
        <div style={styles.centeredBox}>
          <p style={styles.centeredIcon}>🛒</p>
          <h2 style={styles.centeredTitle}>Your cart is empty</h2>
          <p style={styles.centeredText}>Add some products before checking out.</p>
          <button onClick={() => navigate('/')} style={styles.darkBtn}>
            Browse Products →
          </button>
        </div>
      </div>
    );
  }

  const handleRazorpayPayment = async (orderData) => {
    try {
      const { data: paymentOrder } = await axios.post(
        'http://localhost:5000/api/payment/create-order',
        { amount: totalPrice },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      const options = {
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'SnapKart',
        description: 'Order Payment',
        order_id: paymentOrder.orderId,
        handler: async function (response) {
          try {
            await axios.post(
              'http://localhost:5000/api/payment/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData._id,
              },
              { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            clearCart();
            navigate(`/order/${orderData._id}`);
          } catch (err) {
            setError('Payment verification failed');
            setLoading(false);
          }
        },
        prefill: { name: address.fullName, contact: address.phone },
        theme: { color: '#FFD814' },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', () => {
        setError('Payment failed. Please try again.');
        setLoading(false);
      });
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  const placeOrderHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems: cartItems.map((item) => ({
            name: item.name, qty: item.qty,
            image: item.image, price: item.price, product: item._id,
          })),
          shippingAddress: address,
          paymentMethod,
          totalPrice,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      if (paymentMethod === 'COD') {
        clearCart();
        navigate(`/order/${data._id}`);
      } else {
        handleRazorpayPayment(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    ...styles.input,
    borderColor: focusedField === field ? '#4f46e5' : '#e5e7eb',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(79,70,229,0.1)' : 'none',
  });

  const paymentOptions = [
    { value: 'COD', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
    { value: 'UPI', icon: '📱', label: 'UPI Payment', desc: 'Pay via Razorpay UPI' },
    { value: 'Card', icon: '💳', label: 'Credit / Debit Card', desc: 'Pay securely via Razorpay' },
  ];

  return (
    <div style={styles.container}>

      {/* Page Header */}
      <div style={styles.pageHeader}>
        <h1 style={styles.heading}>Checkout</h1>
        <p style={styles.subheading}>{totalItems} item{totalItems !== 1 ? 's' : ''} · ₹{totalPrice.toLocaleString()}</p>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>
          ⚠️ {error}
        </div>
      )}

      {/* Step Indicator */}
      <div style={styles.stepBar}>
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = step > stepNum;
          const isActive = step === stepNum;
          return (
            <React.Fragment key={label}>
              <div
                style={styles.stepItem}
                onClick={() => isCompleted && setStep(stepNum)}
              >
                <div style={{
                  ...styles.stepCircle,
                  backgroundColor: isCompleted ? '#16a34a' : isActive ? '#0f1923' : '#f0f0f0',
                  color: isCompleted || isActive ? '#FFD814' : '#9ca3af',
                  cursor: isCompleted ? 'pointer' : 'default',
                }}>
                  {isCompleted ? '✓' : stepNum}
                </div>
                <span style={{
                  ...styles.stepLabel,
                  color: isActive ? '#0f1923' : isCompleted ? '#16a34a' : '#9ca3af',
                  fontWeight: isActive ? '700' : '500',
                }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  ...styles.stepConnector,
                  backgroundColor: step > stepNum ? '#16a34a' : '#e5e7eb',
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main Layout */}
      <div style={styles.layout}>

        {/* Left: Form */}
        <div style={styles.formCard}>

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div>
              <div style={styles.stepHeader}>
                <div style={styles.stepHeaderIcon}>📦</div>
                <div>
                  <h3 style={styles.stepTitle}>Shipping Address</h3>
                  <p style={styles.stepDesc}>Where should we deliver your order?</p>
                </div>
              </div>

              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    style={inputStyle('fullName')}
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    onFocus={() => setFocusedField('fullName')}
                    onBlur={() => setFocusedField(null)}
                    placeholder='Your full name'
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    style={inputStyle('phone')}
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    placeholder='10-digit mobile number'
                  />
                </div>

                <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>Street Address</label>
                  <input
                    style={inputStyle('street')}
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    onFocus={() => setFocusedField('street')}
                    onBlur={() => setFocusedField(null)}
                    placeholder='House no, Street name, Area, Landmark'
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>City</label>
                  <input
                    style={inputStyle('city')}
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    onFocus={() => setFocusedField('city')}
                    onBlur={() => setFocusedField(null)}
                    placeholder='City'
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>State</label>
                  <input
                    style={inputStyle('state')}
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    onFocus={() => setFocusedField('state')}
                    onBlur={() => setFocusedField(null)}
                    placeholder='State'
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Pincode</label>
                  <input
                    style={inputStyle('pincode')}
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    onFocus={() => setFocusedField('pincode')}
                    onBlur={() => setFocusedField(null)}
                    placeholder='6-digit pincode'
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (!address.fullName || !address.street || !address.city || !address.pincode || !address.phone) {
                    setError('Please fill in all address fields');
                    return;
                  }
                  setError(null);
                  setStep(2);
                }}
                style={styles.continueBtn}
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div>
              <div style={styles.stepHeader}>
                <div style={styles.stepHeaderIcon}>💳</div>
                <div>
                  <h3 style={styles.stepTitle}>Payment Method</h3>
                  <p style={styles.stepDesc}>Choose how you want to pay</p>
                </div>
              </div>

              <div style={styles.paymentOptions}>
                {paymentOptions.map((option) => (
                  <label
                    key={option.value}
                    style={{
                      ...styles.paymentOption,
                      borderColor: paymentMethod === option.value ? '#0f1923' : '#e5e7eb',
                      backgroundColor: paymentMethod === option.value ? '#f8f9fa' : '#fff',
                      boxShadow: paymentMethod === option.value
                        ? '0 0 0 2px rgba(15,25,35,0.15)'
                        : 'none',
                    }}
                  >
                    <input
                      type='radio'
                      name='payment'
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ display: 'none' }}
                    />
                    <span style={styles.paymentIcon}>{option.icon}</span>
                    <div style={styles.paymentText}>
                      <p style={styles.paymentLabel}>{option.label}</p>
                      <p style={styles.paymentDesc}>{option.desc}</p>
                    </div>
                    <div style={{
                      ...styles.radioIndicator,
                      borderColor: paymentMethod === option.value ? '#0f1923' : '#d1d5db',
                      backgroundColor: paymentMethod === option.value ? '#0f1923' : '#fff',
                    }}>
                      {paymentMethod === option.value && (
                        <div style={styles.radioDot} />
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <div style={styles.btnRow}>
                <button onClick={() => setStep(1)} style={styles.backBtn}>← Back</button>
                <button onClick={() => setStep(3)} style={styles.continueBtn}>
                  Continue to Review →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div>
              <div style={styles.stepHeader}>
                <div style={styles.stepHeaderIcon}>✅</div>
                <div>
                  <h3 style={styles.stepTitle}>Review Your Order</h3>
                  <p style={styles.stepDesc}>Confirm everything before placing</p>
                </div>
              </div>

              {/* Items */}
              <div style={styles.reviewItems}>
                {cartItems.map((item) => (
                  <div key={item._id} style={styles.reviewItem}>
                    <img src={item.image} alt={item.name} style={styles.reviewImage} />
                    <div style={{ flex: 1 }}>
                      <p style={styles.reviewName}>{item.name}</p>
                      <p style={styles.reviewQty}>
                        Qty {item.qty} × ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <p style={styles.reviewSubtotal}>
                      ₹{(item.qty * item.price).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary Info Cards */}
              <div style={styles.infoCards}>
                <div style={styles.infoCard}>
                  <p style={styles.infoCardTitle}>📦 Delivering to</p>
                  <p style={styles.infoCardText}>{address.fullName}</p>
                  <p style={styles.infoCardText}>
                    {address.street}, {address.city}, {address.state} — {address.pincode}
                  </p>
                  <p style={styles.infoCardText}>📞 {address.phone}</p>
                </div>
                <div style={styles.infoCard}>
                  <p style={styles.infoCardTitle}>💳 Payment</p>
                  <p style={styles.infoCardText}>
                    {paymentMethod === 'COD' ? '💵 Cash on Delivery'
                      : paymentMethod === 'UPI' ? '📱 UPI via Razorpay'
                      : '💳 Card via Razorpay'}
                  </p>
                  {paymentMethod !== 'COD' && (
                    <p style={styles.secureNote}>🔒 Secured by Razorpay</p>
                  )}
                </div>
              </div>

              <div style={styles.btnRow}>
                <button onClick={() => setStep(2)} style={styles.backBtn}>← Back</button>
                <button
                  onClick={placeOrderHandler}
                  style={{ ...styles.placeOrderBtn, opacity: loading ? 0.8 : 1 }}
                  disabled={loading}
                >
                  {loading
                    ? 'Processing...'
                    : paymentMethod === 'COD'
                    ? `Place Order · ₹${totalPrice.toLocaleString()}`
                    : `Pay ₹${totalPrice.toLocaleString()} →`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>

          <div style={styles.summaryItems}>
            {cartItems.map((item) => (
              <div key={item._id} style={styles.summaryItemRow}>
                <div style={styles.summaryItemLeft}>
                  <img src={item.image} alt={item.name} style={styles.summaryItemImg} />
                  <div>
                    <p style={styles.summaryItemName}>
                      {item.name.length > 22 ? item.name.substring(0, 22) + '...' : item.name}
                    </p>
                    <p style={styles.summaryItemQty}>Qty: {item.qty}</p>
                  </div>
                </div>
                <p style={styles.summaryItemPrice}>
                  ₹{(item.price * item.qty).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div style={styles.summaryDivider} />

          <div style={styles.summaryRows}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Subtotal ({totalItems} items)</span>
              <span style={styles.summaryValue}>₹{totalPrice.toLocaleString()}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Delivery</span>
              <span style={{ ...styles.summaryValue, color: '#16a34a', fontWeight: '700' }}>FREE</span>
            </div>
          </div>

          <div style={styles.summaryDivider} />

          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalValue}>₹{totalPrice.toLocaleString()}</span>
          </div>

          <p style={styles.taxNote}>Inclusive of all taxes</p>

          {/* Trust Badges */}
          <div style={styles.trustGrid}>
            {[
              { icon: '🔒', text: 'Secure Checkout' },
              { icon: '🚚', text: 'Free Delivery' },
              { icon: '↩️', text: 'Easy Returns' },
            ].map((t) => (
              <div key={t.text} style={styles.trustItem}>
                <span style={styles.trustIcon}>{t.icon}</span>
                <span style={styles.trustText}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto' },

  // Header
  pageHeader: { marginBottom: '28px' },
  heading: { fontSize: '26px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  subheading: { fontSize: '14px', color: '#9ca3af', margin: 0 },

  // Error
  errorBox: {
    backgroundColor: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', padding: '12px 16px',
    borderRadius: '10px', fontSize: '14px',
    marginBottom: '20px', fontWeight: '500',
  },

  // Step Bar
  stepBar: {
    display: 'flex', alignItems: 'center',
    marginBottom: '28px',
    backgroundColor: '#fff',
    borderRadius: '14px',
    padding: '20px 28px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  },
  stepItem: {
    display: 'flex', alignItems: 'center',
    gap: '10px',
  },
  stepCircle: {
    width: '34px', height: '34px',
    borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '14px',
    transition: 'all 0.3s', flexShrink: 0,
  },
  stepLabel: {
    fontSize: '14px', transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  stepConnector: {
    flex: 1, height: '2px',
    margin: '0 16px',
    transition: 'background-color 0.3s',
  },

  // Layout
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '24px',
    alignItems: 'start',
  },

  // Form Card
  formCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '28px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  },
  stepHeader: {
    display: 'flex', alignItems: 'center',
    gap: '14px', marginBottom: '24px',
    paddingBottom: '20px',
    borderBottom: '1px solid #f0f0f0',
  },
  stepHeaderIcon: {
    width: '44px', height: '44px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px', fontSize: '22px',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
  },
  stepTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 2px' },
  stepDesc: { fontSize: '13px', color: '#9ca3af', margin: 0 },

  // Form
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    fontSize: '12px', fontWeight: '700',
    color: '#374151', letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },
  input: {
    padding: '12px 14px', borderRadius: '10px',
    border: '1.5px solid #e5e7eb', fontSize: '14px',
    outline: 'none', transition: 'all 0.2s',
    backgroundColor: '#fafafa', fontFamily: 'Poppins, sans-serif',
    boxSizing: 'border-box',
  },

  // Payment
  paymentOptions: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' },
  paymentOption: {
    display: 'flex', alignItems: 'center',
    gap: '14px', padding: '16px 18px',
    borderRadius: '12px', cursor: 'pointer',
    border: '1.5px solid', transition: 'all 0.2s',
  },
  paymentIcon: { fontSize: '24px', flexShrink: 0 },
  paymentText: { flex: 1 },
  paymentLabel: { fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 2px' },
  paymentDesc: { fontSize: '12px', color: '#9ca3af', margin: 0 },
  radioIndicator: {
    width: '20px', height: '20px',
    borderRadius: '50%', border: '2px solid',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', transition: 'all 0.2s',
    flexShrink: 0,
  },
  radioDot: {
    width: '8px', height: '8px',
    borderRadius: '50%', backgroundColor: '#FFD814',
  },

  // Review step
  reviewItems: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' },
  reviewItem: {
    display: 'flex', gap: '14px',
    alignItems: 'center', padding: '12px 16px',
    backgroundColor: '#f8f9fa', borderRadius: '10px',
  },
  reviewImage: { width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 },
  reviewName: { fontSize: '14px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 4px' },
  reviewQty: { fontSize: '12px', color: '#9ca3af', margin: 0 },
  reviewSubtotal: { fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: 0, flexShrink: 0 },
  infoCards: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' },
  infoCard: {
    backgroundColor: '#f8f9fa', borderRadius: '10px',
    padding: '14px 16px', border: '1px solid #f0f0f0',
  },
  infoCardTitle: { fontSize: '12px', fontWeight: '700', color: '#374151', margin: '0 0 8px' },
  infoCardText: { fontSize: '13px', color: '#6b7280', margin: '0 0 4px', lineHeight: '1.5' },
  secureNote: { fontSize: '12px', color: '#16a34a', margin: '6px 0 0', fontWeight: '600' },

  // Buttons
  btnRow: { display: 'flex', gap: '12px', marginTop: '8px' },
  continueBtn: {
    backgroundColor: '#0f1923', color: '#FFD814',
    border: 'none', padding: '13px 24px',
    borderRadius: '10px', fontWeight: '700',
    fontSize: '14px', cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    letterSpacing: '0.3px',
  },
  backBtn: {
    backgroundColor: '#fff', border: '1.5px solid #e5e7eb',
    color: '#374151', padding: '13px 20px',
    borderRadius: '10px', fontSize: '14px',
    cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
    fontWeight: '500',
  },
  placeOrderBtn: {
    flex: 1, backgroundColor: '#16a34a',
    color: '#fff', border: 'none',
    padding: '13px 24px', borderRadius: '10px',
    fontWeight: '700', fontSize: '15px',
    cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
    letterSpacing: '0.3px', transition: 'opacity 0.2s',
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    position: 'sticky',
    top: '88px',
  },
  summaryTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 16px' },
  summaryItems: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' },
  summaryItemRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' },
  summaryItemLeft: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1 },
  summaryItemImg: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 },
  summaryItemName: { fontSize: '12px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 2px' },
  summaryItemQty: { fontSize: '11px', color: '#9ca3af', margin: 0 },
  summaryItemPrice: { fontSize: '13px', fontWeight: '700', color: '#1a1a2e', margin: 0, flexShrink: 0 },
  summaryDivider: { height: '1px', backgroundColor: '#f0f0f0', margin: '12px 0' },
  summaryRows: { display: 'flex', flexDirection: 'column', gap: '10px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: '13px', color: '#6b7280' },
  summaryValue: { fontSize: '13px', fontWeight: '600', color: '#1a1a2e' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  totalLabel: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e' },
  totalValue: { fontSize: '22px', fontWeight: '800', color: '#1a1a2e', letterSpacing: '-0.5px' },
  taxNote: { fontSize: '11px', color: '#9ca3af', margin: '0 0 16px', textAlign: 'right' },
  trustGrid: { display: 'flex', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #f0f0f0' },
  trustItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  trustIcon: { fontSize: '16px' },
  trustText: { fontSize: '10px', color: '#9ca3af', fontWeight: '500', textAlign: 'center' },

  // Centered pages
  centeredPage: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', minHeight: '60vh',
  },
  centeredBox: {
    textAlign: 'center', padding: '60px 40px',
    backgroundColor: '#fff', borderRadius: '20px',
    border: '1px solid #f0f0f0', maxWidth: '380px', width: '100%',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  centeredIcon: { fontSize: '48px', margin: '0 0 16px' },
  centeredTitle: { fontSize: '22px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 8px' },
  centeredText: { fontSize: '14px', color: '#9ca3af', margin: '0 0 24px', lineHeight: '1.6' },
  darkBtn: {
    backgroundColor: '#0f1923', color: '#FFD814',
    border: 'none', padding: '13px 28px',
    borderRadius: '10px', fontWeight: '700',
    fontSize: '14px', cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },
};

export default CheckoutPage;