import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/register',
        { name, email, password }
      );
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
            Join thousands of<br />
            <span style={styles.leftAccent}>happy shoppers.</span>
          </h2>
          <p style={styles.leftSubtitle}>
            Create your free account today and start exploring the best products across all categories.
          </p>
          <div style={styles.stepList}>
            {[
              { step: '01', text: 'Create your free account' },
              { step: '02', text: 'Browse thousands of products' },
              { step: '03', text: 'Checkout safely & securely' },
              { step: '04', text: 'Track your orders easily' },
            ].map((s, i) => (
              <div key={i} style={styles.stepItem}>
                <div style={styles.stepNum}>{s.step}</div>
                <span style={styles.stepText}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.deco1} />
        <div style={styles.deco2} />
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Create account ✨</h1>
            <p style={styles.formSubtitle}>Join ShopClone — it's free!</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={submitHandler} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle('name')}
                placeholder='Himavamsi'
                required
              />
            </div>

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
                  placeholder='Min 6 characters'
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

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField('confirm')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...inputStyle('confirm'),
                  borderColor: confirmPassword && confirmPassword !== password
                    ? '#dc2626'
                    : focusedField === 'confirm'
                    ? '#4f46e5'
                    : '#e5e7eb',
                }}
                placeholder='Repeat your password'
                required
              />
              {confirmPassword && confirmPassword !== password && (
                <p style={styles.fieldError}>Passwords don't match</p>
              )}
            </div>

            <button
              type='submit'
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.8 : 1,
              }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <div style={styles.dividerRow}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>Already have an account?</span>
            <div style={styles.dividerLine} />
          </div>

          <Link to='/login' style={styles.switchBtn}>
            Sign in instead
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
    fontSize: '36px', fontWeight: '800', color: '#fff',
    lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-1px',
  },
  leftAccent: { color: '#FFD814' },
  leftSubtitle: {
    fontSize: '14px', color: '#8899aa',
    lineHeight: '1.7', marginBottom: '36px',
  },
  stepList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '14px' },
  stepNum: {
    width: '32px', height: '32px', borderRadius: '8px',
    backgroundColor: 'rgba(255,216,20,0.15)',
    color: '#FFD814', fontSize: '12px', fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  stepText: { color: '#aabbcc', fontSize: '14px' },
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
  formHeader: { marginBottom: '24px' },
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
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
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
    border: 'none', cursor: 'pointer', fontSize: '16px', padding: '0',
  },
  fieldError: { fontSize: '12px', color: '#dc2626', margin: '2px 0 0' },
  submitBtn: {
    backgroundColor: '#0f1923', color: '#FFD814',
    border: 'none', padding: '14px', borderRadius: '10px',
    fontWeight: '700', fontSize: '15px', cursor: 'pointer',
    letterSpacing: '0.3px', marginTop: '4px',
    transition: 'opacity 0.2s',
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
  },
};

export default RegisterPage;