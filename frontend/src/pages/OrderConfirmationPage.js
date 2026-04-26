import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const ORDER_CSS = `
  .sk-order-layout { display:grid; grid-template-columns:1fr 260px; gap:20px; align-items:start; }
  .sk-order-section { border:1px solid #e5e7eb; border-radius:12px; padding:18px; margin-bottom:14px; background:#fff; }
  .sk-order-success-header { display:flex; align-items:center; gap:14px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:16px; margin-bottom:20px; }
  .sk-order-success-title { margin:0; font-size:18px; color:#15803d; font-weight:700; }
  .sk-order-item { display:flex; gap:10px; align-items:flex-start; margin-bottom:12px; }
  .sk-order-item-img { width:56px; height:56px; object-fit:cover; border-radius:6px; flex-shrink:0; }
  .sk-order-item-name { font-weight:600; margin:0 0 4px; font-size:13px; word-break:break-word; }
  .sk-order-item-meta { color:#6b7280; font-size:12px; margin:0; }
  .sk-order-summary-price { white-space:nowrap; font-weight:600; }
  .sk-summary-row { display:flex; justify-content:space-between; gap:8px; font-size:14px; padding:4px 0; }
  .sk-order-btn { width:100%; background:#FFD814; border:none; padding:12px; border-radius:9px; font-weight:700; font-size:14px; cursor:pointer; color:#131921; margin-bottom:8px; }
  .sk-order-outline-btn { width:100%; background:#fff; border:1px solid #e5e7eb; padding:12px; border-radius:9px; font-size:14px; cursor:pointer; }

  @media (max-width: 640px) {
    .sk-order-layout { grid-template-columns:1fr !important; gap:14px !important; }
    .sk-order-section { padding:14px !important; }
    .sk-order-success-header { padding:14px !important; gap:10px !important; }
    .sk-order-success-title { font-size:15px !important; }
    .sk-order-item-img { width:48px !important; height:48px !important; }
  }
`;

let orderCssInjected = false;

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return; }
    if (!orderCssInjected) {
      const style = document.createElement('style');
      style.textContent = ORDER_CSS;
      document.head.appendChild(style);
      orderCssInjected = true;
    }
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setOrder(data);
        setLoading(false);
      } catch {
        setError('Could not load order');
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, userInfo, navigate]);

  if (loading) return <h2 style={{ textAlign: 'center', padding: '60px' }}>Loading order...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center', padding: '60px' }}>{error}</h2>;

  const badge = (isPaid, paidLabel, pendingLabel) => (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
      fontSize: '12px', marginTop: '6px',
      backgroundColor: isPaid ? '#f0fdf4' : '#fff7ed',
      color: isPaid ? '#15803d' : '#c2410c',
    }}>
      {isPaid ? `✅ ${paidLabel}` : `⏳ ${pendingLabel}`}
    </span>
  );

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>

      {/* Success banner */}
      <div className='sk-order-success-header'>
        <span style={{ fontSize: '32px', flexShrink: 0 }}>✅</span>
        <div style={{ minWidth: 0 }}>
          <h2 className='sk-order-success-title'>Order Placed Successfully!</h2>
          <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6b7280', wordBreak: 'break-all' }}>
            Order ID: <strong>{order._id}</strong>
          </p>
        </div>
      </div>

      <div className='sk-order-layout'>

        {/* Left column */}
        <div>
          {/* Items */}
          <div className='sk-order-section'>
            <h3 style={sectionTitle}>📦 Items Ordered</h3>
            {order.orderItems.map((item, i) => (
              <div key={i} className='sk-order-item'>
                <img src={item.image} alt={item.name} className='sk-order-item-img' />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className='sk-order-item-name'>{item.name}</p>
                  <p className='sk-order-item-meta'>
                    {item.qty} × ₹{item.price.toLocaleString()} ={' '}
                    <strong>₹{(item.qty * item.price).toLocaleString()}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping */}
          <div className='sk-order-section'>
            <h3 style={sectionTitle}>🚚 Shipping Address</h3>
            <p style={infoText}><strong>{order.shippingAddress.fullName}</strong></p>
            <p style={infoText}>{order.shippingAddress.street}</p>
            <p style={infoText}>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
            <p style={infoText}>📞 {order.shippingAddress.phone}</p>
            {badge(order.isDelivered, 'Delivered', 'Not Delivered Yet')}
          </div>

          {/* Payment */}
          <div className='sk-order-section'>
            <h3 style={sectionTitle}>💳 Payment</h3>
            <p style={infoText}>Method: <strong>{order.paymentMethod}</strong></p>
            {badge(order.isPaid, 'Paid', 'Payment Pending')}
          </div>
        </div>

        {/* Right: Summary */}
        <div className='sk-order-section' style={{ position: 'sticky', top: '76px' }}>
          <h3 style={sectionTitle}>🧾 Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            {order.orderItems.map((item, i) => (
              <div key={i} className='sk-summary-row'>
                <span style={{ color: '#6b7280', fontSize: '13px', flex: 1, marginRight: '8px' }}>
                  {item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name} × {item.qty}
                </span>
                <span className='sk-order-summary-price' style={{ fontSize: '13px' }}>
                  ₹{(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '10px 0' }} />
          <div className='sk-summary-row'>
            <span style={{ color: '#6b7280' }}>Delivery</span>
            <span style={{ color: '#16a34a', fontWeight: '700' }}>FREE</span>
          </div>
          <div className='sk-summary-row' style={{ fontWeight: '800', fontSize: '17px', marginTop: '6px' }}>
            <span>Total</span>
            <span>₹{order.totalPrice.toLocaleString()}</span>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => navigate('/')} className='sk-order-btn'>
              Continue Shopping
            </button>
            <button onClick={() => navigate('/myorders')} className='sk-order-outline-btn'>
              View My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const sectionTitle = { fontSize: '14px', fontWeight: '700', margin: '0 0 12px', color: '#1a1a2e' };
const infoText = { margin: '0 0 5px', fontSize: '13px', color: '#374151', wordBreak: 'break-word' };

export default OrderConfirmationPage;
