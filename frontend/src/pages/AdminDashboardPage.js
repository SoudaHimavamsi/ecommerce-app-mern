import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return; }
    const fetchStats = async () => {
      try {
        const { data } = await api.get(
          '/api/admin/dashboard',
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.status === 403 ? 'Access denied. Admin only.' : 'Failed to load dashboard');
        setLoading(false);
      }
    };
    fetchStats();
  }, [userInfo, navigate]);

  if (loading) {
    return (
      <div style={styles.loadingBox}>
        <div style={styles.loadingSpinner} />
        <p style={styles.loadingText}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorBox}>
        <p style={styles.errorIcon}>🚫</p>
        <h3 style={styles.errorTitle}>{error}</h3>
        <button onClick={() => navigate('/')} style={styles.yellowBtn}>Go Home</button>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
      color: '#4f46e5',
      lightColor: '#eef2ff',
      trend: 'Active listings',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: '🛒',
      color: '#0891b2',
      lightColor: '#ecfeff',
      trend: 'All time orders',
    },
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: '#059669',
      lightColor: '#ecfdf5',
      trend: 'Registered accounts',
    },
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: '#d97706',
      lightColor: '#fffbeb',
      trend: 'From paid orders',
    },
  ];

  const quickActions = [
    {
      label: 'Manage Products',
      desc: 'Add, edit or delete products',
      icon: '📦',
      path: '/admin/products',
      color: '#4f46e5',
      light: '#eef2ff',
    },
    {
      label: 'Manage Orders',
      desc: 'View and update order status',
      icon: '🛒',
      path: '/admin/orders',
      color: '#0891b2',
      light: '#ecfeff',
    },
    {
      label: 'Manage Users',
      desc: 'View and delete user accounts',
      icon: '👥',
      path: '/admin/users',
      color: '#059669',
      light: '#ecfdf5',
    },
    {
      label: 'Add New Product',
      desc: 'Create a new product listing',
      icon: '➕',
      path: '/admin/products/new',
      color: '#d97706',
      light: '#fffbeb',
      primary: true,
    },
  ];

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.headerLabel}>Admin Panel</p>
          <h1 style={styles.heading}>Dashboard</h1>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.adminBadge}>
            <span style={styles.adminDot} />
            <span style={styles.adminBadgeText}>Live</span>
          </div>
          <div style={styles.adminInfo}>
            <div style={styles.adminAvatar}>
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={styles.adminName}>{userInfo.name}</p>
              <p style={styles.adminRole}>Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={styles.statsGrid}>
        {statCards.map((card, i) => (
          <div key={i} style={styles.statCard}>
            <div style={styles.statCardTop}>
              <div>
                <p style={styles.statLabel}>{card.label}</p>
                <p style={styles.statValue}>{card.value}</p>
              </div>
              <div style={{
                ...styles.statIconBox,
                backgroundColor: card.lightColor,
              }}>
                <span style={styles.statIcon}>{card.icon}</span>
              </div>
            </div>
            <div style={styles.statDivider} />
            <p style={{ ...styles.statTrend, color: card.color }}>
              ● {card.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <p style={styles.sectionSubtitle}>Navigate to key management areas</p>
        </div>
        <div style={styles.actionsGrid}>
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.path)}
              style={{
                ...styles.actionCard,
                border: action.primary
                  ? '2px solid #FFD814'
                  : '1px solid #f0f0f0',
              }}
            >
              <div style={{
                ...styles.actionIconBox,
                backgroundColor: action.light,
              }}>
                <span style={styles.actionIcon}>{action.icon}</span>
              </div>
              <div style={styles.actionText}>
                <p style={{
                  ...styles.actionLabel,
                  color: action.primary ? '#d97706' : '#1a1a2e',
                }}>
                  {action.label}
                </p>
                <p style={styles.actionDesc}>{action.desc}</p>
              </div>
              <span style={{ ...styles.actionArrow, color: action.color }}>
                →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Table */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Store Overview</h2>
          <p style={styles.sectionSubtitle}>Key metrics at a glance</p>
        </div>
        <div style={styles.overviewTable}>
          {[
            { label: 'Products in Store', value: stats.totalProducts, icon: '📦', note: 'Active listings' },
            { label: 'Orders Received', value: stats.totalOrders, icon: '🛒', note: 'All time' },
            { label: 'Registered Users', value: stats.totalUsers, icon: '👥', note: 'Total accounts' },
            { label: 'Revenue Generated', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: '💰', note: 'Paid orders only' },
          ].map((row, i) => (
            <div key={i} style={{
              ...styles.overviewRow,
              borderBottom: i < 3 ? '1px solid #f5f5f5' : 'none',
            }}>
              <span style={styles.overviewIcon}>{row.icon}</span>
              <span style={styles.overviewLabel}>{row.label}</span>
              <span style={styles.overviewNote}>{row.note}</span>
              <span style={styles.overviewValue}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '8px 0 40px' },

  // Loading
  loadingBox: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '100px 20px', gap: '16px',
  },
  loadingSpinner: {
    width: '40px', height: '40px',
    border: '3px solid #f0f0f0',
    borderTop: '3px solid #FFD814',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: { color: '#888', fontSize: '15px' },

  // Error
  errorBox: {
    textAlign: 'center', padding: '80px 20px',
    backgroundColor: '#fff', borderRadius: '16px',
  },
  errorIcon: { fontSize: '48px', marginBottom: '12px' },
  errorTitle: { fontSize: '20px', marginBottom: '16px', color: '#1a1a2e' },
  yellowBtn: {
    backgroundColor: '#FFD814', border: 'none',
    padding: '12px 28px', borderRadius: '8px',
    fontWeight: '700', fontSize: '14px',
    cursor: 'pointer', color: '#0f1923',
  },

  // Header
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '28px',
    padding: '24px 28px',
    backgroundColor: '#0f1923',
    borderRadius: '16px',
  },
  headerLabel: {
    fontSize: '12px', color: '#FFD814',
    fontWeight: '600', letterSpacing: '1px',
    textTransform: 'uppercase', margin: '0 0 4px',
  },
  heading: {
    fontSize: '28px', fontWeight: '800',
    color: '#fff', margin: 0,
  },
  headerRight: {
    display: 'flex', alignItems: 'center', gap: '16px',
  },
  adminBadge: {
    display: 'flex', alignItems: 'center', gap: '6px',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: '6px 14px', borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  adminDot: {
    width: '8px', height: '8px',
    borderRadius: '50%', backgroundColor: '#22c55e',
    display: 'inline-block',
    boxShadow: '0 0 6px #22c55e',
  },
  adminBadgeText: { color: '#aaa', fontSize: '12px', fontWeight: '500' },
  adminInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  adminAvatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    backgroundColor: '#FFD814', color: '#0f1923',
    fontWeight: '800', fontSize: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  adminName: { color: '#fff', fontSize: '14px', fontWeight: '600', margin: 0 },
  adminRole: { color: '#667788', fontSize: '12px', margin: 0 },

  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '14px',
    padding: '20px 24px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  },
  statCardTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '16px',
  },
  statLabel: {
    fontSize: '13px', color: '#888',
    fontWeight: '500', margin: '0 0 8px',
  },
  statValue: {
    fontSize: '28px', fontWeight: '800',
    color: '#1a1a2e', margin: 0, letterSpacing: '-1px',
  },
  statIconBox: {
    width: '48px', height: '48px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  statIcon: { fontSize: '22px' },
  statDivider: {
    height: '1px', backgroundColor: '#f5f5f5', marginBottom: '12px',
  },
  statTrend: { fontSize: '12px', fontWeight: '500', margin: 0 },

  // Section
  section: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px 28px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    marginBottom: '20px',
  },
  sectionHeader: { marginBottom: '20px' },
  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px' },
  sectionSubtitle: { fontSize: '13px', color: '#aaa', margin: 0 },

  // Actions
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '14px',
  },
  actionCard: {
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '16px 18px', borderRadius: '12px',
    backgroundColor: '#fff', cursor: 'pointer',
    textAlign: 'left', transition: 'all 0.2s',
    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
  },
  actionIconBox: {
    width: '44px', height: '44px', borderRadius: '10px',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
  },
  actionIcon: { fontSize: '20px' },
  actionText: { flex: 1 },
  actionLabel: { fontSize: '14px', fontWeight: '700', margin: '0 0 2px' },
  actionDesc: { fontSize: '12px', color: '#aaa', margin: 0 },
  actionArrow: { fontSize: '18px', fontWeight: '700', flexShrink: 0 },

  // Overview
  overviewTable: {
    border: '1px solid #f0f0f0',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  overviewRow: {
    display: 'flex', alignItems: 'center',
    gap: '14px', padding: '16px 20px',
    backgroundColor: '#fff',
  },
  overviewIcon: { fontSize: '20px', flexShrink: 0 },
  overviewLabel: { flex: 1, fontSize: '14px', fontWeight: '500', color: '#333' },
  overviewNote: { fontSize: '12px', color: '#bbb', minWidth: '100px', textAlign: 'right' },
  overviewValue: {
    fontSize: '16px', fontWeight: '800',
    color: '#1a1a2e', minWidth: '80px', textAlign: 'right',
  },
};

export default AdminDashboardPage;