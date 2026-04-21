import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const AdminUsersPage = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [userInfo, navigate]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get(
        '/api/admin/users',
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load users');
      setLoading(false);
    }
  };

  const deleteHandler = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      setDeleting(id);
      try {
        await api.delete(
          `/api/admin/users/${id}`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
      setDeleting(null);
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center', padding: '60px' }}>Loading users...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center', padding: '60px' }}>{error}</h2>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>👥 Manage Users</h2>
        <span style={styles.count}>{users.length} total users</span>
      </div>

      {users.length === 0 ? (
        <div style={styles.empty}>No users found.</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Joined</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} style={styles.tableRow}>
                  {/* Index */}
                  <td style={styles.td}>
                    <span style={styles.indexNum}>{index + 1}</span>
                  </td>

                  {/* Name */}
                  <td style={styles.td}>
                    <div style={styles.nameRow}>
                      <div style={styles.avatar}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={styles.userName}>{user.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td style={styles.td}>
                    <span style={styles.email}>{user.email}</span>
                  </td>

                  {/* Role */}
                  <td style={styles.td}>
                    <span style={{
                      ...styles.roleBadge,
                      backgroundColor: user.isAdmin ? '#131921' : '#f0f2f5',
                      color: user.isAdmin ? '#FFD814' : '#555',
                    }}>
                      {user.isAdmin ? '👑 Admin' : '👤 Customer'}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td style={styles.td}>
                    {new Date(user.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>

                  {/* Action */}
                  <td style={styles.td}>
                    {user.isAdmin ? (
                      <span style={styles.protectedText}>🔒 Protected</span>
                    ) : (
                      <button
                        onClick={() => deleteHandler(user._id, user.name)}
                        style={styles.deleteBtn}
                        disabled={deleting === user._id}
                      >
                        {deleting === user._id ? 'Deleting...' : '🗑️ Delete'}
                      </button>
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
  container: { maxWidth: '1100px', margin: '0 auto', padding: '20px' },
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
  },
  tableRow: { borderBottom: '1px solid #eee' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333', verticalAlign: 'middle' },
  indexNum: { color: '#aaa', fontSize: '13px' },
  nameRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#131921',
    color: '#FFD814',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '15px',
    flexShrink: 0,
  },
  userName: { fontWeight: 'bold', fontSize: '14px' },
  email: { color: '#555', fontSize: '13px' },
  roleBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  protectedText: { color: '#aaa', fontSize: '13px' },
  deleteBtn: {
    backgroundColor: '#fff',
    border: '1px solid #B12704',
    color: '#B12704',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  backBtn: {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default AdminUsersPage;