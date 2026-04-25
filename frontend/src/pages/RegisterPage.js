import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const REGISTER_CSS = `
  .sk-reg-page { display:flex; min-height:calc(100vh - 68px); margin:-20px; background-color:#f0f2f5; }
  .sk-reg-left { flex:1; background:linear-gradient(145deg,#0f1923 0%,#1a2a3a 60%,#0d1f2d 100%); display:flex; align-items:center; justify-content:center; padding:60px 48px; position:relative; overflow:hidden; }
  .sk-reg-left-content { position:relative; z-index:1; max-width:380px; }
  .sk-reg-brand-link { display:flex; align-items:center; gap:10px; text-decoration:none; margin-bottom:40px; }
  .sk-reg-brand-icon { width:38px; height:38px; background-color:#FFD814; color:#0f1923; border-radius:10px; font-weight:800; font-size:20px; display:flex; align-items:center; justify-content:center; }
  .sk-reg-brand-name { color:#fff; font-size:22px; font-weight:700; }
  .sk-reg-title { font-size:36px; font-weight:800; color:#fff; line-height:1.2; margin-bottom:16px; letter-spacing:-1px; }
  .sk-reg-accent { color:#FFD814; }
  .sk-reg-subtitle { font-size:14px; color:#8899aa; line-height:1.7; margin-bottom:36px; }
  .sk-reg-steps { display:flex; flex-direction:column; gap:14px; }
  .sk-reg-step { display:flex; align-items:center; gap:14px; }
  .sk-reg-step-num { width:32px; height:32px; border-radius:8px; background:rgba(255,216,20,0.15); color:#FFD814; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .sk-reg-step-text { color:#aabbcc; font-size:14px; }
  .sk-reg-deco1 { position:absolute; width:300px; height:300px; border-radius:50%; background:rgba(255,216,20,0.05); top:-80px; right:-80px; pointer-events:none; }
  .sk-reg-deco2 { position:absolute; width:200px; height:200px; border-radius:50%; background:rgba(255,255,255,0.03); bottom:-60px; left:-40px; pointer-events:none; }
  .sk-reg-right { flex:1; display:flex; align-items:center; justify-content:center; padding:40px 32px; background-color:#f0f2f5; }
  .sk-reg-card { background:#fff; border-radius:20px; padding:40px; width:100%; max-width:420px; box-shadow:0 4px 32px rgba(0,0,0,0.08); border:1px solid #f0f0f0; }
  .sk-reg-card-title { font-size:26px; font-weight:800; color:#1a1a2e; margin:0 0 6px; }
  .sk-reg-card-subtitle { font-size:14px; color:#999; margin:0 0 24px; }
  .sk-reg-error { background:#fef2f2; border:1px solid #fecaca; color:#dc2626; padding:12px 16px; border-radius:10px; font-size:14px; margin-bottom:20px; display:flex; align-items:center; gap:8px; }
  .sk-reg-form { display:flex; flex-direction:column; gap:16px; }
  .sk-reg-field { display:flex; flex-direction:column; gap:6px; }
  .sk-reg-label { font-size:13px; font-weight:600; color:#374151; letter-spacing:0.3px; }
  .sk-reg-input { padding:12px 14px; border-radius:10px; border:1.5px solid #e5e7eb; font-size:14px; outline:none; transition:all 0.2s; background:#fafafa; width:100%; box-sizing:border-box; }
  .sk-reg-input:focus { border-color:#4f46e5; box-shadow:0 0 0 3px rgba(79,70,229,0.1); }
  .sk-reg-pw-wrap { position:relative; }
  .sk-reg-eye { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:16px; padding:0; }
  .sk-reg-field-error { font-size:12px; color:#dc2626; margin:2px 0 0; }
  .sk-reg-submit { background-color:#0f1923; color:#FFD814; border:none; padding:14px; border-radius:10px; font-weight:700; font-size:15px; cursor:pointer; letter-spacing:0.3px; margin-top:4px; width:100%; }
  .sk-reg-divider { display:flex; align-items:center; gap:12px; margin:24px 0 16px; }
  .sk-reg-divider-line { flex:1; height:1px; background:#f0f0f0; }
  .sk-reg-divider-text { font-size:13px; color:#bbb; white-space:nowrap; }
  .sk-reg-switch { display:block; text-align:center; padding:13px; border-radius:10px; border:1.5px solid #e5e7eb; color:#374151; font-size:14px; font-weight:600; text-decoration:none; background:#fafafa; }

  /* Mobile: stack panels */
  @media (max-width: 640px) {
    .sk-reg-page { flex-direction:column; margin:0; min-height:auto; }
    .sk-reg-left { padding:32px 24px; flex:none; }
    .sk-reg-title { font-size:28px; }
    .sk-reg-brand-link { margin-bottom:20px; }
    .sk-reg-subtitle { margin-bottom:20px; }
    .sk-reg-right { padding:24px 16px 40px; flex:none; }
    .sk-reg-card { padding:28px 20px; border-radius:16px; max-width:100%; }
  }
`;

let regCssInjected = false;

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (!regCssInjected) {
      const style = document.createElement('style');
      style.textContent = REGISTER_CSS;
      document.head.appendChild(style);
      regCssInjected = true;
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='sk-reg-page'>
      {/* Left Panel */}
      <div className='sk-reg-left'>
        <div className='sk-reg-left-content'>
          <Link to='/' className='sk-reg-brand-link'>
            <div className='sk-reg-brand-icon'>S</div>
            <span className='sk-reg-brand-name'>SnapKart</span>
          </Link>
          <h2 className='sk-reg-title'>
            Join thousands of<br />
            <span className='sk-reg-accent'>happy shoppers.</span>
          </h2>
          <p className='sk-reg-subtitle'>
            Create your free account today and start exploring the best products across all categories.
          </p>
          <div className='sk-reg-steps'>
            {[
              { step: '01', text: 'Create your free account' },
              { step: '02', text: 'Browse thousands of products' },
              { step: '03', text: 'Checkout safely & securely' },
              { step: '04', text: 'Track your orders easily' },
            ].map((s, i) => (
              <div key={i} className='sk-reg-step'>
                <div className='sk-reg-step-num'>{s.step}</div>
                <span className='sk-reg-step-text'>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='sk-reg-deco1' />
        <div className='sk-reg-deco2' />
      </div>

      {/* Right Panel */}
      <div className='sk-reg-right'>
        <div className='sk-reg-card'>
          <h1 className='sk-reg-card-title'>Create account ✨</h1>
          <p className='sk-reg-card-subtitle'>Join SnapKart — it's free!</p>

          {error && (
            <div className='sk-reg-error'>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={submitHandler} className='sk-reg-form'>
            <div className='sk-reg-field'>
              <label className='sk-reg-label'>Full Name</label>
              <input type='text' value={name} onChange={(e) => setName(e.target.value)} className='sk-reg-input' placeholder='Himavamsi' required />
            </div>

            <div className='sk-reg-field'>
              <label className='sk-reg-label'>Email address</label>
              <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='sk-reg-input' placeholder='you@example.com' required />
            </div>

            <div className='sk-reg-field'>
              <label className='sk-reg-label'>Password</label>
              <div className='sk-reg-pw-wrap'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='sk-reg-input'
                  style={{ paddingRight: '44px' }}
                  placeholder='Min 6 characters'
                  required
                />
                <button type='button' onClick={() => setShowPassword(!showPassword)} className='sk-reg-eye'>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className='sk-reg-field'>
              <label className='sk-reg-label'>Confirm Password</label>
              <input
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='sk-reg-input'
                style={{ borderColor: confirmPassword && confirmPassword !== password ? '#dc2626' : '' }}
                placeholder='Repeat your password'
                required
              />
              {confirmPassword && confirmPassword !== password && (
                <p className='sk-reg-field-error'>Passwords don't match</p>
              )}
            </div>

            <button type='submit' className='sk-reg-submit' style={{ opacity: loading ? 0.8 : 1 }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <div className='sk-reg-divider'>
            <div className='sk-reg-divider-line' />
            <span className='sk-reg-divider-text'>Already have an account?</span>
            <div className='sk-reg-divider-line' />
          </div>

          <Link to='/login' className='sk-reg-switch'>Sign in instead</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
