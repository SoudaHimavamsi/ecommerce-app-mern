import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const AdminOrdersPage = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [delivering, setDelivering] = useState(null);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [userInfo, navigate]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get(
        '/api/admin/orders',
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load orders');
      setLoading(false);
    }
  };

  const markDeliveredHandler = async (orderId) => {
    setDelivering(orderId);
    try {
      await api.put(
        `/api/admin/orders/${orderId}/deliver`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      fetchOrders();
    } catch (err) {
      alert('Failed to update order');
    }
    setDelivering(null);
  };

  if (loading) return <h2 style={{ textAlign: 'center', padding: '60px' }}>Loading orders...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center', padding: '60px' }}>{error}</h2>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>📦 Manage Orders</h2>
        <span style={styles.count}>{orders.length} total orders</span>
      </div>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <p>No orders found.</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Paid</th>
                <th style={styles.th}>Delivered</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={styles.tableRow}>
                  {/* Order ID */}
                  <td style={styles.td}>
                    <span style={styles.orderId}>
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </td>

                  {/* Customer */}
                  <td style={styles.td}>
                    <p style={styles.customerName}>{order.user?.name || 'N/A'}</p>
                    <p style={styles.customerEmail}>{order.user?.email || ''}</p>
                  </td>

                  {/* Date */}
                  <td style={styles.td}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>

                  {/* Items */}
                  <td style={styles.td}>
                    <div style={styles.itemsList}>
                      {order.orderItems.map((item, i) => (
                        <span key={i} style={styles.itemChip}>
                          {item.name} ×{item.qty}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Total */}
                  <td style={styles.td}>
                    <strong>₹{order.totalPrice.toLocaleString()}</strong>
                  </td>

                  {/* Paid */}
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: order.isPaid ? '#e6f4ea' : '#fff3e0',
                      color: order.isPaid ? 'green' : '#e65100',
                    }}>
                      {order.isPaid ? '✅ Paid' : '⏳ Pending'}
                    </span>
                  </td>

                  {/* Delivered */}
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: order.isDelivered ? '#e6f4ea' : '#fff3e0',
                      color: order.isDelivered ? 'green' : '#e65100',
                    }}>
                      {order.isDelivered ? '✅ Delivered' : '⏳ Pending'}
                    </span>
                  </td>

                  {/* Action */}
                  <td style={styles.td}>
                    {!order.isDelivered ? (
                      <button
                        onClick={() => markDeliveredHandler(order._id)}
                        style={styles.deliverBtn}
                        disabled={delivering === order._id}
                      >
                        {delivering === order._id ? 'Updating...' : '🚚 Mark Delivered'}
                      </button>
                    ) : (
                      <span style={styles.doneText}>Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button onClick={() => navigate('/admin')} style={styles.backBtn}>
        ← Back to Dashboard
      </button>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1400px', margin: '0 auto', padding: '20px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  heading: { fontSize: '28px', margin: 0, color: '#131921' },
  count: {
    backgroundColor: '#f0f2f5',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '14px',
    color: '#555',
  },
  empty: { textAlign: 'center', padding: '60px', color: '#888' },
  tableContainer: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'auto',
    marginBottom: '20px',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#f7f8fa', borderBottom: '2px solid #ddd' },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '13px',
    color: '#131921',
    whiteSpace: 'nowrap',
  },
  tableRow: { borderBottom: '1px solid #eee' },
  td: { padding: '14px 16px', fontSize: '13px', color: '#333', verticalAlign: 'top' },
  orderId: {
    fontFamily: 'monospace',
    fontSize: '13px',
    backgroundColor: '#f0f2f5',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  customerName: { margin: '0 0 2px', fontWeight: 'bold', fontSize: '13px' },
  customerEmail: { margin: 0, color: '#888', fontSize: '12px' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '4px' },
  itemChip: {
    backgroundColor: '#f0f2f5',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    display: 'inline-block',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  deliverBtn: {
    backgroundColor: '#131921',
    color: '#FFD814',
    border: 'none',
    padding: '7px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  doneText: { color: '#aaa', fontSize: '13px' },
  backBtn: {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default AdminOrdersPage;