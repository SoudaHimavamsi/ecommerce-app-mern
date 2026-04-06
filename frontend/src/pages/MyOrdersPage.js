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
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/orders/myorders',
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
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
    return <h2 style={{ textAlign: 'center', padding: '60px' }}>Loading your orders...</h2>;
  }

  if (error) {
    return <h2 style={{ color: 'red', textAlign: 'center', padding: '60px' }}>{error}</h2>;
  }

  if (orders.length === 0) {
    return (
      <div style={styles.empty}>
        <h2>You haven't placed any orders yet</h2>
        <button onClick={() => navigate('/')} style={styles.yellowBtn}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Orders</h2>
      <p style={styles.subtext}>Total Orders: {orders.length}</p>

      <div style={styles.orderList}>
        {orders.map((order) => (
          <div key={order._id} style={styles.orderCard}>
            {/* Header */}
            <div style={styles.orderHeader}>
              <div>
                <p style={styles.orderId}>Order ID: {order._id}</p>
                <p style={styles.orderDate}>
                  Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div style={styles.statusBadge}>
                {order.isDelivered ? (
                  <span style={{ ...styles.badge, backgroundColor: '#e6f4ea', color: 'green' }}>
                    ✅ Delivered
                  </span>
                ) : (
                  <span style={{ ...styles.badge, backgroundColor: '#fff3e0', color: '#e65100' }}>
                    ⏳ In Transit
                  </span>
                )}
              </div>
            </div>

            {/* Items */}
            <div style={styles.itemsSection}>
              {order.orderItems.slice(0, 3).map((item, i) => (
                <div key={i} style={styles.orderItem}>
                  <img src={item.image} alt={item.name} style={styles.itemImage} />
                  <div style={{ flex: 1 }}>
                    <p style={styles.itemName}>{item.name}</p>
                    <p style={styles.itemQty}>Qty: {item.qty}</p>
                  </div>
                  <p style={styles.itemPrice}>₹{(item.price * item.qty).toLocaleString()}</p>
                </div>
              ))}
              {order.orderItems.length > 3 && (
                <p style={styles.moreItems}>+ {order.orderItems.length - 3} more items</p>
              )}
            </div>

            {/* Footer */}
            <div style={styles.orderFooter}>
              <div>
                <p style={styles.totalLabel}>Total Amount</p>
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
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '20px' },
  heading: { fontSize: '28px', marginBottom: '8px', color: '#131921' },
  subtext: { fontSize: '14px', color: '#555', marginBottom: '24px' },
  orderList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  orderCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    padding: '16px',
    borderBottom: '1px solid #ddd',
  },
  orderId: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#131921',
  },
  orderDate: {
    margin: '4px 0 0',
    fontSize: '13px',
    color: '#555',
  },
  statusBadge: { display: 'flex', gap: '8px' },
  badge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  itemsSection: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  orderItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  itemImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
    border: '1px solid #eee',
  },
  itemName: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#131921',
  },
  itemQty: {
    margin: '4px 0 0',
    fontSize: '13px',
    color: '#555',
  },
  itemPrice: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#131921',
  },
  moreItems: {
    margin: 0,
    fontSize: '13px',
    color: '#0066c0',
    fontStyle: 'italic',
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderTop: '1px solid #ddd',
    backgroundColor: '#f7f8fa',
  },
  totalLabel: {
    margin: 0,
    fontSize: '13px',
    color: '#555',
  },
  totalPrice: {
    margin: '4px 0 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#B12704',
  },
  viewBtn: {
    backgroundColor: '#FFD814',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#131921',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  yellowBtn: {
    backgroundColor: '#FFD814',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    color: '#131921',
    marginTop: '16px',
  },
};

export default MyOrdersPage;