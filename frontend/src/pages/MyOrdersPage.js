import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MyOrdersPage = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return; }
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/orders/myorders',
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders');
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo, navigate]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.pageHeader}>
          <h1 style={styles.heading}>My Orders</h1>
        </div>
        <div style={styles.skeletonList}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={styles.skeletonCard}>
              <div style={styles.skeletonHeader} />
              <div style={styles.skeletonBody}>
                <div style={styles.skeletonRow} />
                <div style={{ ...styles.skeletonRow, width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.centeredPage}>
        <div style={styles.centeredBox}>
          <p style={styles.centeredIcon}>⚠️</p>
          <h2 style={styles.centeredTitle}>{error}</h2>
          <button onClick={() => navigate('/')} style={styles.darkBtn}>Go Home</button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={styles.centeredPage}>
        <div style={styles.centeredBox}>
          <p style={styles.centeredIcon}>📦</p>
          <h2 style={styles.centeredTitle}>No orders yet</h2>
          <p style={styles.centeredText}>
            You haven't placed any orders yet.<br />
            Start shopping to see your orders here!
          </p>
          <button onClick={() => navigate('/')} style={styles.darkBtn}>
            Browse Products →
          </button>
        </div>
      </div>
    );
  }

  const getStatusInfo = (order) => {
    if (order.isDelivered) return { label: 'Delivered', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: '✓' };
    if (order.isPaid) return { label: 'In Transit', color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '🚚' };
    return { label: 'Processing', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe', icon: '⏳' };
  };

  return (
    <div style={styles.container}>

      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.heading}>My Orders</h1>
          <p style={styles.subheading}>
            {orders.length} order{orders.length !== 1 ? 's' : ''} placed
          </p>
        </div>
        <button onClick={() => navigate('/')} style={styles.shopMoreBtn}>
          + Shop More
        </button>
      </div>

      {/* Orders List */}
      <div style={styles.orderList}>
        {orders.map((order) => {
          const status = getStatusInfo(order);
          return (
            <div key={order._id} style={styles.orderCard}>

              {/* Card Header */}
              <div style={styles.orderHeader}>
                <div style={styles.orderHeaderLeft}>
                  <div>
                    <p style={styles.orderIdLabel}>ORDER ID</p>
                    <p style={styles.orderId}>#{order._id.slice(-10).toUpperCase()}</p>
                  </div>
                  <div style={styles.headerDivider} />
                  <div>
                    <p style={styles.orderIdLabel}>PLACED ON</p>
                    <p style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div style={styles.headerDivider} />
                  <div>
                    <p style={styles.orderIdLabel}>PAYMENT</p>
                    <p style={styles.orderDate}>{order.paymentMethod}</p>
                  </div>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  color: status.color,
                  backgroundColor: status.bg,
                  border: `1px solid ${status.border}`,
                }}>
                  {status.icon} {status.label}
                </span>
              </div>

              {/* Items */}
              <div style={styles.itemsSection}>
                {order.orderItems.slice(0, 3).map((item, i) => (
                  <div key={i} style={styles.orderItem}>
                    <div style={styles.itemImageWrapper}>
                      <img src={item.image} alt={item.name} style={styles.itemImage} />
                    </div>
                    <div style={styles.itemInfo}>
                      <p style={styles.itemName}>{item.name}</p>
                      <p style={styles.itemMeta}>
                        Qty: {item.qty} · ₹{item.price.toLocaleString()} each
                      </p>
                    </div>
                    <p style={styles.itemSubtotal}>
                      ₹{(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>
                ))}
                {order.orderItems.length > 3 && (
                  <div style={styles.moreItems}>
                    +{order.orderItems.length - 3} more item{order.orderItems.length - 3 !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div style={styles.orderFooter}>
                <div style={styles.footerLeft}>
                  <div style={styles.footerBadge}>
                    <span style={styles.footerBadgeIcon}>💳</span>
                    <span style={styles.footerBadgeText}>
                      {order.isPaid ? 'Paid' : 'Payment Pending'}
                    </span>
                  </div>
                  <div style={styles.footerBadge}>
                    <span style={styles.footerBadgeIcon}>🚚</span>
                    <span style={styles.footerBadgeText}>
                      {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                    </span>
                  </div>
                </div>
                <div style={styles.footerRight}>
                  <div style={styles.totalSection}>
                    <p style={styles.totalLabel}>Order Total</p>
                    <p style={styles.totalPrice}>₹{order.totalPrice.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/order/${order._id}`)}
                    style={styles.viewBtn}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto' },

  // Header
  pageHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '28px',
  },
  heading: {
    fontSize: '26px', fontWeight: '800',
    color: '#1a1a2e', margin: '0 0 4px',
  },
  subheading: { fontSize: '14px', color: '#9ca3af', margin: 0 },
  shopMoreBtn: {
    backgroundColor: '#0f1923', color: '#FFD814',
    border: 'none', padding: '10px 20px',
    borderRadius: '10px', fontWeight: '700',
    fontSize: '13px', cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },

  // Skeleton
  skeletonList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  skeletonCard: {
    backgroundColor: '#fff', borderRadius: '16px',
    border: '1px solid #f0f0f0', overflow: 'hidden',
  },
  skeletonHeader: {
    height: '64px', backgroundColor: '#f0f0f0',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  skeletonBody: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  skeletonRow: {
    height: '14px', backgroundColor: '#e0e0e0',
    borderRadius: '8px', width: '80%',
    animation: 'pulse 1.5s ease-in-out infinite',
  },

  // Order Card
  orderList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },

  // Order Header
  orderHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '16px 20px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #f0f0f0',
  },
  orderHeaderLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
  orderIdLabel: {
    fontSize: '10px', fontWeight: '700',
    color: '#9ca3af', margin: '0 0 3px',
    letterSpacing: '0.6px',
  },
  orderId: {
    fontSize: '13px', fontWeight: '700',
    color: '#1a1a2e', margin: 0,
    fontFamily: 'monospace',
  },
  orderDate: { fontSize: '13px', fontWeight: '600', color: '#374151', margin: 0 },
  headerDivider: { width: '1px', height: '28px', backgroundColor: '#e5e7eb' },
  statusBadge: {
    padding: '6px 14px', borderRadius: '20px',
    fontSize: '12px', fontWeight: '700',
    flexShrink: 0,
  },

  // Items
  itemsSection: {
    padding: '16px 20px',
    display: 'flex', flexDirection: 'column', gap: '14px',
  },
  orderItem: { display: 'flex', gap: '14px', alignItems: 'center' },
  itemImageWrapper: {
    width: '64px', height: '64px',
    borderRadius: '10px', overflow: 'hidden',
    border: '1px solid #f0f0f0', flexShrink: 0,
    backgroundColor: '#f8f9fa',
  },
  itemImage: { width: '100%', height: '100%', objectFit: 'cover' },
  itemInfo: { flex: 1 },
  itemName: {
    fontSize: '14px', fontWeight: '600',
    color: '#1a1a2e', margin: '0 0 4px',
    lineHeight: '1.4',
  },
  itemMeta: { fontSize: '12px', color: '#9ca3af', margin: 0 },
  itemSubtotal: {
    fontSize: '14px', fontWeight: '700',
    color: '#1a1a2e', margin: 0, flexShrink: 0,
  },
  moreItems: {
    fontSize: '13px', color: '#6366f1',
    fontWeight: '600', textAlign: 'center',
    padding: '6px', backgroundColor: '#eef2ff',
    borderRadius: '8px',
  },

  // Footer
  orderFooter: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '14px 20px',
    borderTop: '1px solid #f0f0f0',
    backgroundColor: '#fafafa',
  },
  footerLeft: { display: 'flex', gap: '12px' },
  footerBadge: {
    display: 'flex', alignItems: 'center', gap: '6px',
    backgroundColor: '#fff', border: '1px solid #e5e7eb',
    padding: '5px 12px', borderRadius: '20px',
  },
  footerBadgeIcon: { fontSize: '13px' },
  footerBadgeText: { fontSize: '12px', fontWeight: '600', color: '#374151' },
  footerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  totalSection: { textAlign: 'right' },
  totalLabel: { fontSize: '11px', color: '#9ca3af', margin: '0 0 2px', fontWeight: '500' },
  totalPrice: {
    fontSize: '18px', fontWeight: '800',
    color: '#1a1a2e', margin: 0, letterSpacing: '-0.5px',
  },
  viewBtn: {
    backgroundColor: '#0f1923', color: '#FFD814',
    border: 'none', padding: '10px 18px',
    borderRadius: '10px', fontWeight: '700',
    fontSize: '13px', cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    whiteSpace: 'nowrap',
  },

  // Centered states
  centeredPage: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', minHeight: '60vh',
  },
  centeredBox: {
    textAlign: 'center', padding: '60px 40px',
    backgroundColor: '#fff', borderRadius: '20px',
    border: '1px solid #f0f0f0', maxWidth: '380px',
    width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  centeredIcon: { fontSize: '52px', margin: '0 0 16px' },
  centeredTitle: { fontSize: '22px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 8px' },
  centeredText: { fontSize: '14px', color: '#9ca3af', margin: '0 0 24px', lineHeight: '1.7' },
  darkBtn: {
    backgroundColor: '#0f1923', color: '#FFD814',
    border: 'none', padding: '13px 28px',
    borderRadius: '10px', fontWeight: '700',
    fontSize: '14px', cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },
};

export default MyOrdersPage;