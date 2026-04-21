import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data } = await api.get(
          `/api/orders/${id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError('Could not load order');
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, userInfo, navigate]);

  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading order...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center' }}>{error}</h2>;

  return (
    <div style={styles.container}>
      {/* Success Header */}
      <div style={styles.successHeader}>
        <span style={styles.checkIcon}>✅</span>
        <div>
          <h2 style={styles.successTitle}>Order Placed Successfully!</h2>
          <p style={styles.orderId}>Order ID: <strong>{order._id}</strong></p>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Left: Order Details */}
        <div>
          {/* Items */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📦 Items Ordered</h3>
            {order.orderItems.map((item, i) => (
              <div key={i} style={styles.item}>
                <img src={item.image} alt={item.name} style={styles.itemImage} />
                <div style={{ flex: 1 }}>
                  <p style={styles.itemName}>{item.name}</p>
                  <p style={styles.itemMeta}>
                    {item.qty} × ₹{item.price.toLocaleString()} ={' '}
                    <strong>₹{(item.qty * item.price).toLocaleString()}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🚚 Shipping Address</h3>
            <p style={styles.infoText}>{order.shippingAddress.fullName}</p>
            <p style={styles.infoText}>{order.shippingAddress.street}</p>
            <p style={styles.infoText}>
              {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
              {order.shippingAddress.pincode}
            </p>
            <p style={styles.infoText}>📞 {order.shippingAddress.phone}</p>
            <p style={{
              ...styles.badge,
              backgroundColor: order.isDelivered ? '#e6f4ea' : '#fff3e0',
              color: order.isDelivered ? 'green' : '#e65100',
            }}>
              {order.isDelivered ? '✅ Delivered' : '⏳ Not Delivered Yet'}
            </p>
          </div>

          {/* Payment */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💳 Payment</h3>
            <p style={styles.infoText}>Method: <strong>{order.paymentMethod}</strong></p>
            <p style={{
              ...styles.badge,
              backgroundColor: order.isPaid ? '#e6f4ea' : '#fff3e0',
              color: order.isPaid ? 'green' : '#e65100',
            }}>
              {order.isPaid ? '✅ Paid' : '⏳ Payment Pending'}
            </p>
          </div>
        </div>

        {/* Right: Price Summary */}
        <div style={styles.summary}>
          <h3 style={styles.sectionTitle}>🧾 Order Summary</h3>
          {order.orderItems.map((item, i) => (
            <div key={i} style={styles.summaryRow}>
              <span>{item.name} × {item.qty}</span>
              <span>₹{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <hr />
          <div style={styles.summaryRow}>
            <span>Delivery</span>
            <span style={{ color: 'green' }}>FREE</span>
          </div>
          <div style={{ ...styles.summaryRow, fontWeight: 'bold', fontSize: '17px' }}>
            <span>Total</span>
            <span>₹{order.totalPrice.toLocaleString()}</span>
          </div>
          <button onClick={() => navigate('/')} style={styles.btn}>
            Continue Shopping
          </button>
          <button onClick={() => navigate('/myorders')} style={styles.outlineBtn}>
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto' },
  successHeader: {
    display: 'flex', alignItems: 'center', gap: '16px',
    backgroundColor: '#e6f4ea', border: '1px solid #a8d5b5',
    borderRadius: '8px', padding: '20px', marginBottom: '30px',
  },
  checkIcon: { fontSize: '40px' },
  successTitle: { margin: 0, fontSize: '22px', color: '#1a5c2a' },
  orderId: { margin: '4px 0 0', fontSize: '13px', color: '#555' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' },
  section: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '16px', backgroundColor: '#fff' },
  sectionTitle: { fontSize: '16px', marginBottom: '14px', color: '#131921' },
  item: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' },
  itemImage: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' },
  itemName: { fontWeight: 'bold', margin: '0 0 4px', fontSize: '14px' },
  itemMeta: { color: '#555', fontSize: '13px', margin: 0 },
  infoText: { margin: '0 0 6px', fontSize: '14px', color: '#333' },
  badge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', marginTop: '8px' },
  summary: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '10px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px' },
  btn: { backgroundColor: '#FFD814', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', color: '#131921' },
  outlineBtn: { backgroundColor: '#fff', border: '1px solid #ccc', padding: '12px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
};

export default OrderConfirmationPage;