import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/admin/dashboard',
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setStats(data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('Access denied. Admin only.');
        } else {
          setError('Failed to load dashboard');
        }
        setLoading(false);
      }
    };

    fetchStats();
  }, [userInfo, navigate]);

  if (loading) {
    return <h2 style={{ textAlign: 'center', padding: '60px' }}>Loading dashboard...</h2>;
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2 style={{ color: '#B12704' }}>{error}</h2>
        <button onClick={() => navigate('/')} style={styles.btn}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Dashboard</h2>

      {/* Statistics Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <div>
            <p style={styles.statLabel}>Total Products</p>
            <p style={styles.statValue}>{stats.totalProducts}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🛒</div>
          <div>
            <p style={styles.statLabel}>Total Orders</p>
            <p style={styles.statValue}>{stats.totalOrders}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div>
            <p style={styles.statLabel}>Total Users</p>
            <p style={styles.statValue}>{stats.totalUsers}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div>
            <p style={styles.statLabel}>Total Revenue</p>
            <p style={styles.statValue}>₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.actionsSection}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionsGrid}>
          <button
            onClick={() => navigate('/admin/products')}
            style={styles.actionBtn}
          >
            📦 Manage Products
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            style={styles.actionBtn}
          >
            🛒 Manage Orders
          </button>
          <button
            onClick={() => navigate('/admin/products/new')}
            style={styles.actionBtnPrimary}
          >
            ➕ Add New Product
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
  heading: { fontSize: '28px', marginBottom: '30px', color: '#131921' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIcon: { fontSize: '40px' },
  statLabel: { margin: 0, fontSize: '14px', color: '#555' },
  statValue: {
    margin: '8px 0 0',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#131921',
  },
  actionsSection: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '24px',
  },
  sectionTitle: { fontSize: '20px', marginBottom: '20px', color: '#131921' },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  actionBtn: {
    backgroundColor: '#fff',
    border: '2px solid #131921',
    borderRadius: '8px',
    padding: '16px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#131921',
  },
  actionBtnPrimary: {
    backgroundColor: '#FFD814',
    border: 'none',
    borderRadius: '8px',
    padding: '16px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#131921',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  btn: {
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

export default AdminDashboardPage;