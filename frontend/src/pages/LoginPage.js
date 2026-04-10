import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password }
      );
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    ...styles.input,
    borderColor: focusedField === field ? '#4f46e5' : '#e5e7eb',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(79,70,229,0.1)' : 'none',
  });

  return (
    <div style={styles.page}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <Link to='/' style={styles.brandLink}>
            <div style={styles.brandIconBox}>S</div>
            <span style={styles.brandName}>ShopClone</span>
          </Link>
          <h2 style={styles.leftTitle}>
            Your favourite<br />
            <span style={styles.leftAccent}>store awaits.</span>
          </h2>
          <p style={styles.leftSubtitle}>
            Sign in to access your orders, wishlist, and exclusive deals — all in one place.
          </p>
          <div style={styles.featureList}>
            {[
              { icon: '🚚', text: 'Free delivery on all orders' },
              { icon: '🔒', text: 'Secure & encrypted payments' },
              { icon: '↩️', text: 'Hassle-free 30-day returns' },
              { icon: '❤️', text: 'Save items to your wishlist' },
            ].map((f, i) => (
              <div key={i} style={styles.featureItem}>
                <span style={styles.featureIcon}>{f.icon}</span>
                <span style={styles.featureText}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Decorative circles */}
        <div style={styles.deco1} />
        <div style={styles.deco2} />
      </div>

      {/* Right Panel — Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Welcome back 👋</h1>
            <p style={styles.formSubtitle}>Sign in to your ShopClone account</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={submitHandler} style={styles.form}>
            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email address</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle('email')}
                placeholder='you@example.com'
                required
              />
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle('password'), paddingRight: '44px' }}
                  placeholder='Enter your password'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type='submit'
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.8 : 1,
              }}
              disabled={loading}
            >
              {loading ? (
                <span style={styles.btnLoading}>
                  <span style={styles.spinner} /> Signing in...
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          <div style={styles.dividerRow}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>New to ShopClone?</span>
            <div style={styles.dividerLine} />
          </div>

          <Link to='/register' style={styles.switchBtn}>
            Create a free account
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    minHeight: 'calc(100vh - 68px)',
    margin: '-20px',
    backgroundColor: '#f0f2f5',
  },
  // Left Panel
  leftPanel: {
    flex: '1',
    background: 'linear-gradient(145deg, #0f1923 0%, #1a2a3a 60%, #0d1f2d 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 48px',
    position: 'relative',
    overflow: 'hidden',
    minWidth: '340px',
  },
  leftContent: { position: 'relative', zIndex: 1, maxWidth: '380px' },
  brandLink: {
    display: 'flex', alignItems: 'center', gap: '10px',
    textDecoration: 'none', marginBottom: '40px',
  },
  brandIconBox: {
    width: '38px', height: '38px', backgroundColor: '#FFD814',
    color: '#0f1923', borderRadius: '10px', fontWeight: '800',
    fontSize: '20px', display: 'flex', alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: { color: '#fff', fontSize: '22px', fontWeight: '700' },
  leftTitle: {
    fontSize: '38px', fontWeight: '800', color: '#fff',
    lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-1px',
  },
  leftAccent: { color: '#FFD814' },
  leftSubtitle: {
    fontSize: '14px', color: '#8899aa',
    lineHeight: '1.7', marginBottom: '36px',
  },
  featureList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '12px' },
  featureIcon: { fontSize: '18px', flexShrink: 0 },
  featureText: { color: '#aabbcc', fontSize: '14px' },
  deco1: {
    position: 'absolute', width: '300px', height: '300px',
    borderRadius: '50%', background: 'rgba(255,216,20,0.05)',
    top: '-80px', right: '-80px', pointerEvents: 'none',
  },
  deco2: {
    position: 'absolute', width: '200px', height: '200px',
    borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
    bottom: '-60px', left: '-40px', pointerEvents: 'none',
  },

  // Right Panel
  rightPanel: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 32px',
    backgroundColor: '#f0f2f5',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
    border: '1px solid #f0f0f0',
  },
  formHeader: { marginBottom: '28px' },
  formTitle: {
    fontSize: '26px', fontWeight: '800',
    color: '#1a1a2e', margin: '0 0 6px',
  },
  formSubtitle: { fontSize: '14px', color: '#999', margin: 0 },
  errorBox: {
    backgroundColor: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', padding: '12px 16px', borderRadius: '10px',
    fontSize: '14px', marginBottom: '20px',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    fontSize: '13px', fontWeight: '600',
    color: '#374151', letterSpacing: '0.3px',
  },
  input: {
    padding: '12px 14px', borderRadius: '10px',
    border: '1.5px solid #e5e7eb', fontSize: '14px',
    outline: 'none', transition: 'all 0.2s',
    backgroundColor: '#fafafa', width: '100%',
    boxSizing: 'border-box',
  },
  passwordWrapper: { position: 'relative' },
  eyeBtn: {
    position: 'absolute', right: '12px', top: '50%',
    transform: 'translateY(-50%)', background: 'none',
    border: 'none', cursor: 'pointer', fontSize: '16px',
    padding: '0',
  },
  submitBtn: {
    backgroundColor: '#0f1923', color: '#FFD814',
    border: 'none', padding: '14px',
    borderRadius: '10px', fontWeight: '700',
    fontSize: '15px', cursor: 'pointer',
    letterSpacing: '0.3px', marginTop: '4px',
    transition: 'opacity 0.2s',
  },
  btnLoading: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px',
  },
  spinner: {
    width: '16px', height: '16px',
    border: '2px solid rgba(255,216,20,0.3)',
    borderTop: '2px solid #FFD814',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.8s linear infinite',
  },
  dividerRow: {
    display: 'flex', alignItems: 'center',
    gap: '12px', margin: '24px 0 16px',
  },
  dividerLine: { flex: 1, height: '1px', backgroundColor: '#f0f0f0' },
  dividerText: { fontSize: '13px', color: '#bbb', whiteSpace: 'nowrap' },
  switchBtn: {
    display: 'block', textAlign: 'center',
    padding: '13px', borderRadius: '10px',
    border: '1.5px solid #e5e7eb', color: '#374151',
    fontSize: '14px', fontWeight: '600',
    textDecoration: 'none', backgroundColor: '#fafafa',
    transition: 'all 0.2s',
  },
};

export default LoginPage;