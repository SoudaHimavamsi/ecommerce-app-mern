import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const PROFILE_CSS = `
  .sk-profile-wrap { max-width:900px; margin:0 auto; }
  .sk-profile-header { display:flex; align-items:center; gap:16px; margin-bottom:28px; }
  .sk-profile-avatar { width:60px; height:60px; border-radius:50%; background:#FFD814; color:#0f1923; font-size:24px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .sk-profile-meta h1 { font-size:22px; font-weight:800; color:#1a1a2e; margin:0 0 4px; }
  .sk-profile-meta p { font-size:13px; color:#9ca3af; margin:0; }
  .sk-profile-layout { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .sk-profile-card { background:#fff; border-radius:14px; border:1px solid #f0f0f0; padding:22px; box-shadow:0 2px 12px rgba(0,0,0,0.05); }
  .sk-profile-card-full { grid-column:1/-1; }
  .sk-profile-section-title { font-size:14px; font-weight:700; color:#1a1a2e; margin:0 0 16px; display:flex; align-items:center; gap:8px; }
  .sk-profile-field { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }
  .sk-profile-label { font-size:12px; font-weight:600; color:#6b7280; letter-spacing:0.3px; text-transform:uppercase; }
  .sk-profile-value { font-size:14px; color:#1a1a2e; font-weight:500; }
  .sk-profile-input { padding:10px 12px; border:1.5px solid #e5e7eb; border-radius:9px; font-size:14px; outline:none; width:100%; box-sizing:border-box; background:#fafafa; transition:border-color 0.2s; }
  .sk-profile-input:focus { border-color:#4f46e5; background:#fff; }
  .sk-profile-textarea { resize:vertical; min-height:80px; }
  .sk-profile-save-btn { background:#0f1923; color:#FFD814; border:none; padding:11px 24px; border-radius:9px; font-weight:700; font-size:13px; cursor:pointer; margin-top:4px; }
  .sk-profile-success { background:#f0fdf4; border:1px solid #bbf7d0; color:#15803d; padding:10px 14px; border-radius:9px; font-size:13px; margin-bottom:14px; }
  .sk-profile-error { background:#fef2f2; border:1px solid #fecaca; color:#dc2626; padding:10px 14px; border-radius:9px; font-size:13px; margin-bottom:14px; }
  .sk-profile-logout-card { background:#fff; border-radius:14px; border:1px solid #fee2e2; padding:22px; grid-column:1/-1; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
  .sk-profile-logout-text h3 { font-size:14px; font-weight:700; color:#1a1a2e; margin:0 0 4px; }
  .sk-profile-logout-text p { font-size:13px; color:#9ca3af; margin:0; }
  .sk-profile-logout-btn { background:#ef4444; color:#fff; border:none; padding:11px 24px; border-radius:9px; font-weight:700; font-size:13px; cursor:pointer; }

  @media (max-width: 640px) {
    .sk-profile-layout { grid-template-columns:1fr !important; }
    .sk-profile-card-full { grid-column:auto; }
    .sk-profile-logout-card { grid-column:auto; }
    .sk-profile-card { padding:16px; }
  }
`;

let profileCssInjected = false;

const ProfilePage = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: '', city: '', state: '', pincode: '', phone: '',
  });
  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: '',
  });
  const [addrMsg, setAddrMsg] = useState(null);
  const [pwMsg, setPwMsg] = useState(null);
  const [addrLoading, setAddrLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return; }
    if (!profileCssInjected) {
      const style = document.createElement('style');
      style.textContent = PROFILE_CSS;
      document.head.appendChild(style);
      profileCssInjected = true;
    }
  }, [userInfo, navigate]);

  const handleAddressSave = async (e) => {
    e.preventDefault();
    setAddrLoading(true);
    setAddrMsg(null);
    // Store address locally (no backend endpoint for this yet)
    try {
      localStorage.setItem('snapkart_address', JSON.stringify(address));
      setAddrMsg({ type: 'success', text: 'Address saved successfully!' });
    } catch {
      setAddrMsg({ type: 'error', text: 'Failed to save address.' });
    } finally {
      setAddrLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwords.newPass.length < 6) {
      setPwMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    setPwLoading(true);
    setPwMsg(null);
    try {
      await api.put(
        '/api/auth/changepassword',
        { currentPassword: passwords.current, newPassword: passwords.newPass },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setPwMsg({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      setPwMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Load saved address
  useEffect(() => {
    const saved = localStorage.getItem('snapkart_address');
    if (saved) {
      try { setAddress(JSON.parse(saved)); } catch {}
    }
  }, []);

  if (!userInfo) return null;

  return (
    <div className='sk-profile-wrap'>
      {/* Header */}
      <div className='sk-profile-header'>
        <div className='sk-profile-avatar'>
          {userInfo.name.charAt(0).toUpperCase()}
        </div>
        <div className='sk-profile-meta'>
          <h1>{userInfo.name}</h1>
          <p>{userInfo.email} {userInfo.isAdmin && '· Administrator'}</p>
        </div>
      </div>

      <div className='sk-profile-layout'>

        {/* Basic Info */}
        <div className='sk-profile-card'>
          <h2 className='sk-profile-section-title'>👤 Basic Info</h2>
          <div className='sk-profile-field'>
            <span className='sk-profile-label'>Full Name</span>
            <span className='sk-profile-value'>{userInfo.name}</span>
          </div>
          <div className='sk-profile-field'>
            <span className='sk-profile-label'>Email Address</span>
            <span className='sk-profile-value'>{userInfo.email}</span>
          </div>
          <div className='sk-profile-field'>
            <span className='sk-profile-label'>Account Type</span>
            <span className='sk-profile-value'>{userInfo.isAdmin ? '⚙️ Administrator' : '🛍️ Customer'}</span>
          </div>
        </div>

        {/* Default Address */}
        <div className='sk-profile-card'>
          <h2 className='sk-profile-section-title'>🚚 Default Shipping Address</h2>
          {addrMsg && (
            <div className={addrMsg.type === 'success' ? 'sk-profile-success' : 'sk-profile-error'}>
              {addrMsg.text}
            </div>
          )}
          <form onSubmit={handleAddressSave}>
            <div className='sk-profile-field'>
              <label className='sk-profile-label'>Street Address</label>
              <input
                className='sk-profile-input'
                placeholder='House no, Street, Area'
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className='sk-profile-field'>
                <label className='sk-profile-label'>City</label>
                <input className='sk-profile-input' placeholder='City' value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </div>
              <div className='sk-profile-field'>
                <label className='sk-profile-label'>State</label>
                <input className='sk-profile-input' placeholder='State' value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className='sk-profile-field'>
                <label className='sk-profile-label'>Pincode</label>
                <input className='sk-profile-input' placeholder='6-digit pincode' value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
              </div>
              <div className='sk-profile-field'>
                <label className='sk-profile-label'>Phone</label>
                <input className='sk-profile-input' placeholder='Mobile number' value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
              </div>
            </div>
            <button type='submit' className='sk-profile-save-btn' disabled={addrLoading}>
              {addrLoading ? 'Saving...' : 'Save Address'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className='sk-profile-card sk-profile-card-full'>
          <h2 className='sk-profile-section-title'>🔒 Change Password</h2>
          {pwMsg && (
            <div className={pwMsg.type === 'success' ? 'sk-profile-success' : 'sk-profile-error'}>
              {pwMsg.text}
            </div>
          )}
          <form onSubmit={handlePasswordChange} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', alignItems: 'end' }}>
            <div className='sk-profile-field' style={{ margin: 0 }}>
              <label className='sk-profile-label'>Current Password</label>
              <input type='password' className='sk-profile-input' placeholder='Current password' value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} required />
            </div>
            <div className='sk-profile-field' style={{ margin: 0 }}>
              <label className='sk-profile-label'>New Password</label>
              <input type='password' className='sk-profile-input' placeholder='Min 6 characters' value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} required />
            </div>
            <div className='sk-profile-field' style={{ margin: 0 }}>
              <label className='sk-profile-label'>Confirm New Password</label>
              <input type='password' className='sk-profile-input' placeholder='Repeat new password' value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} required />
            </div>
            <button type='submit' className='sk-profile-save-btn' disabled={pwLoading}>
              {pwLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Logout */}
        <div className='sk-profile-logout-card'>
          <div className='sk-profile-logout-text'>
            <h3>Sign Out</h3>
            <p>You'll need to sign in again to access your account.</p>
          </div>
          <button onClick={handleLogout} className='sk-profile-logout-btn'>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
