import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const LOGIN_CSS = `
  .sk-auth-page { display:flex; min-height:calc(100vh - 68px); margin:-20px; background-color:#f0f2f5; }
  .sk-auth-left { flex:1; background:linear-gradient(145deg,#0f1923 0%,#1a2a3a 60%,#0d1f2d 100%); display:flex; align-items:center; justify-content:center; padding:60px 48px; position:relative; overflow:hidden; }
  .sk-auth-left-content { position:relative; z-index:1; max-width:380px; }
  .sk-auth-brand-link { display:flex; align-items:center; gap:10px; text-decoration:none; margin-bottom:40px; }
  .sk-auth-brand-icon { width:38px; height:38px; background-color:#FFD814; color:#0f1923; border-radius:10px; font-weight:800; font-size:20px; display:flex; align-items:center; justify-content:center; }
  .sk-auth-brand-name { color:#fff; font-size:22px; font-weight:700; }
  .sk-auth-title { font-size:38px; font-weight:800; color:#fff; line-height:1.2; margin-bottom:16px; letter-spacing:-1px; }
  .sk-auth-accent { color:#FFD814; }
  .sk-auth-subtitle { font-size:14px; color:#8899aa; line-height:1.7; margin-bottom:36px; }
  .sk-auth-features { display:flex; flex-direction:column; gap:14px; }
  .sk-auth-feature { display:flex; align-items:center; gap:12px; }
  .sk-auth-feature-icon { font-size:18px; flex-shrink:0; }
  .sk-auth-feature-text { color:#aabbcc; font-size:14px; }
  .sk-auth-deco1 { position:absolute; width:300px; height:300px; border-radius:50%; background:rgba(255,216,20,0.05); top:-80px; right:-80px; pointer-events:none; }
  .sk-auth-deco2 { position:absolute; width:200px; height:200px; border-radius:50%; background:rgba(255,255,255,0.03); bottom:-60px; left:-40px; pointer-events:none; }
  .sk-auth-right { flex:1; display:flex; align-items:center; justify-content:center; padding:40px 32px; background-color:#f0f2f5; }
  .sk-auth-card { background:#fff; border-radius:20px; padding:40px; width:100%; max-width:420px; box-shadow:0 4px 32px rgba(0,0,0,0.08); border:1px solid #f0f0f0; }
  .sk-auth-card-title { font-size:26px; font-weight:800; color:#1a1a2e; margin:0 0 6px; }
  .sk-auth-card-subtitle { font-size:14px; color:#999; margin:0 0 28px; }
  .sk-auth-error { background:#fef2f2; border:1px solid #fecaca; color:#dc2626; padding:12px 16px; border-radius:10px; font-size:14px; margin-bottom:20px; display:flex; align-items:center; gap:8px; }
  .sk-auth-form { display:flex; flex-direction:column; gap:18px; }
  .sk-auth-field { display:flex; flex-direction:column; gap:6px; }
  .sk-auth-label { font-size:13px; font-weight:600; color:#374151; letter-spacing:0.3px; }
  .sk-auth-input { padding:12px 14px; border-radius:10px; border:1.5px solid #e5e7eb; font-size:14px; outline:none; transition:all 0.2s; background:#fafafa; width:100%; box-sizing:border-box; }
  .sk-auth-input:focus { border-color:#4f46e5; box-shadow:0 0 0 3px rgba(79,70,229,0.1); }
  .sk-auth-pw-wrap { position:relative; }
  .sk-auth-eye { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:16px; padding:0; }
  .sk-auth-submit { background-color:#0f1923; color:#FFD814; border:none; padding:14px; border-radius:10px; font-weight:700; font-size:15px; cursor:pointer; letter-spacing:0.3px; margin-top:4px; width:100%; }
  .sk-auth-divider { display:flex; align-items:center; gap:12px; margin:24px 0 16px; }
  .sk-auth-divider-line { flex:1; height:1px; background:#f0f0f0; }
  .sk-auth-divider-text { font-size:13px; color:#bbb; white-space:nowrap; }
  .sk-auth-switch { display:block; text-align:center; padding:13px; border-radius:10px; border:1.5px solid #e5e7eb; color:#374151; font-size:14px; font-weight:600; text-decoration:none; background:#fafafa; }

  /* Mobile: stack panels vertically */
  @media (max-width: 640px) {
    .sk-auth-page { flex-direction:column; margin:0; min-height:auto; }
    .sk-auth-left { padding:32px 24px; flex:none; }
    .sk-auth-title { font-size:28px; }
    .sk-auth-brand-link { margin-bottom:20px; }
    .sk-auth-subtitle { margin-bottom:20px; }
    .sk-auth-right { padding:24px 16px 40px; flex:none; }
    .sk-auth-card { padding:28px 20px; border-radius:16px; max-width:100%; }
  }
`;

let loginCssInjected = false;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (!loginCssInjected) {
      const style = document.createElement('style');
      style.textContent = LOGIN_CSS;
      document.head.appendChild(style);
      loginCssInjected = true;
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='sk-auth-page'>
      {/* Left Panel */}
      <div className='sk-auth-left'>
        <div className='sk-auth-left-content'>
          <Link to='/' className='sk-auth-brand-link'>
            <div className='sk-auth-brand-icon'>S</div>
            <span className='sk-auth-brand-name'>SnapKart</span>
          </Link>
          <h2 className='sk-auth-title'>
            Your favourite<br />
            <span className='sk-auth-accent'>store awaits.</span>
          </h2>
          <p className='sk-auth-subtitle'>
            Sign in to access your orders, wishlist, and exclusive deals — all in one place.
          </p>
          <div className='sk-auth-features'>
            {[
              { icon: '🚚', text: 'Free delivery on all orders' },
              { icon: '🔒', text: 'Secure & encrypted payments' },
              { icon: '↩️', text: 'Hassle-free 30-day returns' },
              { icon: '❤️', text: 'Save items to your wishlist' },
            ].map((f, i) => (
              <div key={i} className='sk-auth-feature'>
                <span className='sk-auth-feature-icon'>{f.icon}</span>
                <span className='sk-auth-feature-text'>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='sk-auth-deco1' />
        <div className='sk-auth-deco2' />
      </div>

      {/* Right Panel */}
      <div className='sk-auth-right'>
        <div className='sk-auth-card'>
          <h1 className='sk-auth-card-title'>Welcome back 👋</h1>
          <p className='sk-auth-card-subtitle'>Sign in to your SnapKart account</p>

          {error && (
            <div className='sk-auth-error'>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={submitHandler} className='sk-auth-form'>
            <div className='sk-auth-field'>
              <label className='sk-auth-label'>Email address</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='sk-auth-input'
                placeholder='you@example.com'
                required
              />
            </div>

            <div className='sk-auth-field'>
              <label className='sk-auth-label'>Password</label>
              <div className='sk-auth-pw-wrap'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='sk-auth-input'
                  style={{ paddingRight: '44px' }}
                  placeholder='Enter your password'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='sk-auth-eye'
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type='submit'
              className='sk-auth-submit'
              style={{ opacity: loading ? 0.8 : 1 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className='sk-auth-divider'>
            <div className='sk-auth-divider-line' />
            <span className='sk-auth-divider-text'>New to SnapKart?</span>
            <div className='sk-auth-divider-line' />
          </div>

          <Link to='/register' className='sk-auth-switch'>
            Create a free account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
