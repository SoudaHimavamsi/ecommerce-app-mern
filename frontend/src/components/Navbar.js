import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

// Inject responsive CSS once
const NAVBAR_CSS = `
  .sk-nav { background-color:#0f1923; border-bottom:1px solid rgba(255,255,255,0.07); position:sticky; top:0; z-index:1000; box-shadow:0 2px 20px rgba(0,0,0,0.3); }
  .sk-nav-inner { max-width:1280px; margin:0 auto; padding:0 16px; height:68px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .sk-brand { text-decoration:none; display:flex; align-items:center; gap:8px; flex-shrink:0; }
  .sk-brand-icon { width:32px; height:32px; background-color:#FFD814; color:#0f1923; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:17px; flex-shrink:0; }
  .sk-brand-text { color:#fff; font-size:19px; font-weight:700; letter-spacing:-0.5px; }
  .sk-brand-accent { color:#FFD814; }
  .sk-form { flex:1; min-width:0; }
  .sk-search-wrapper { display:flex; align-items:center; background-color:#fff; border-radius:10px; overflow:hidden; transition:box-shadow 0.2s; }
  .sk-search-icon { padding:0 10px; display:flex; align-items:center; flex-shrink:0; }
  .sk-input { flex:1; padding:10px 4px; font-size:14px; border:none; outline:none; background:transparent; color:#333; min-width:0; }
  .sk-clear-btn { background:none; border:none; color:#bbb; font-size:13px; cursor:pointer; padding:0 8px; flex-shrink:0; }
  .sk-search-btn { padding:10px 14px; background-color:#FFD814; border:none; color:#0f1923; font-weight:700; font-size:13px; cursor:pointer; flex-shrink:0; white-space:nowrap; }
  .sk-links { display:flex; align-items:center; gap:12px; flex-shrink:0; }
  .sk-icon-link { display:flex; flex-direction:column; align-items:center; gap:3px; text-decoration:none; color:#fff; }
  .sk-icon-wrapper { position:relative; display:flex; align-items:center; justify-content:center; }
  .sk-badge { position:absolute; top:-7px; right:-9px; background-color:#FFD814; color:#0f1923; border-radius:50%; width:17px; height:17px; font-size:10px; font-weight:800; display:flex; align-items:center; justify-content:center; }
  .sk-icon-label { font-size:10px; color:#aaa; }
  .sk-divider { width:1px; height:32px; background:rgba(255,255,255,0.1); }
  .sk-user-menu { display:flex; align-items:center; gap:12px; }
  .sk-nav-link { color:#ccc; text-decoration:none; font-size:14px; font-weight:500; padding-bottom:2px; border-bottom:2px solid transparent; }
  .sk-nav-link-active { border-bottom:2px solid #FFD814; }
  .sk-admin-badge { padding:4px 10px; border-radius:6px; font-size:12px; font-weight:700; text-decoration:none; letter-spacing:0.5px; }
  .sk-avatar-group { display:flex; align-items:center; gap:8px; }
  .sk-avatar { width:32px; height:32px; border-radius:50%; background-color:#FFD814; color:#0f1923; font-weight:800; font-size:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .sk-user-info { display:flex; flex-direction:column; }
  .sk-greeting { font-size:10px; color:#aaa; line-height:1; }
  .sk-username { font-size:13px; color:#fff; font-weight:600; line-height:1.3; }
  .sk-logout-btn { background:none; border:none; cursor:pointer; padding:4px; display:flex; align-items:center; border-radius:4px; }
  .sk-auth-links { display:flex; align-items:center; gap:8px; }
  .sk-login-btn { color:#fff; text-decoration:none; font-size:14px; font-weight:500; padding:7px 14px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); white-space:nowrap; }
  .sk-register-btn { color:#0f1923; text-decoration:none; font-size:14px; font-weight:700; padding:7px 14px; border-radius:8px; background-color:#FFD814; white-space:nowrap; }

  /* Tablet */
  @media (max-width: 768px) {
    .sk-nav-inner { gap:8px; padding:0 12px; }
    .sk-brand-text { display:none; }
    .sk-icon-label { display:none; }
    .sk-nav-link-label { display:inline; }
    .sk-user-info { display:none; }
    .sk-divider { display:none; }
    .sk-links { gap:8px; }
    .sk-user-menu { gap:8px; }
  }

  /* Mobile */
  @media (max-width: 480px) {
    .sk-nav-inner { height:60px; padding:0 10px; gap:6px; }
    .sk-brand-icon { width:28px; height:28px; font-size:15px; }
    .sk-search-btn { padding:10px 10px; font-size:12px; }
    .sk-icon-link { min-width:32px; }
    .sk-links { gap:4px; }
    .sk-user-menu { gap:6px; }
    .sk-admin-badge { padding:3px 7px; font-size:11px; }
    .sk-login-btn { padding:6px 10px; font-size:13px; }
    .sk-register-btn { padding:6px 10px; font-size:13px; }
  }
`;

let navbarCssInjected = false;

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth();
  const { wishlistItems } = useWishlist();

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    if (!navbarCssInjected) {
      const style = document.createElement('style');
      style.textContent = NAVBAR_CSS;
      document.head.appendChild(style);
      navbarCssInjected = true;
    }
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm.trim()}`);
      setSearchTerm('');
    }
  };

  const logoutHandler = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className='sk-nav'>
      <div className='sk-nav-inner'>

        {/* Brand */}
        <Link to='/' className='sk-brand'>
          <span className='sk-brand-icon'>S</span>
          <span className='sk-brand-text'>
            Snap<span className='sk-brand-accent'>Kart</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={submitHandler} className='sk-form'>
          <div
            className='sk-search-wrapper'
            style={{ boxShadow: searchFocused ? '0 0 0 3px rgba(255,216,20,0.35)' : 'none' }}
          >
            <span className='sk-search-icon'>
              <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='#999' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                <circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/>
              </svg>
            </span>
            <input
              type='text'
              placeholder='Search products...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className='sk-input'
            />
            {searchTerm && (
              <button type='button' onClick={() => setSearchTerm('')} className='sk-clear-btn'>✕</button>
            )}
            <button type='submit' className='sk-search-btn'>Search</button>
          </div>
        </form>

        {/* Right Links */}
        <div className='sk-links'>

          {/* Wishlist */}
          <Link to='/wishlist' className='sk-icon-link'>
            <div className='sk-icon-wrapper'>
              <svg width='20' height='20' viewBox='0 0 24 24'
                fill={wishlistItems.length > 0 ? '#e53935' : 'none'}
                stroke={wishlistItems.length > 0 ? '#e53935' : '#fff'}
                strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/>
              </svg>
              {wishlistItems.length > 0 && <span className='sk-badge'>{wishlistItems.length}</span>}
            </div>
            <span className='sk-icon-label'>Wishlist</span>
          </Link>

          {/* Cart */}
          <Link to='/cart' className='sk-icon-link'>
            <div className='sk-icon-wrapper'>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#fff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <circle cx='9' cy='21' r='1'/><circle cx='20' cy='21' r='1'/>
                <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'/>
              </svg>
              {totalItems > 0 && <span className='sk-badge'>{totalItems}</span>}
            </div>
            <span className='sk-icon-label'>Cart</span>
          </Link>

          <div className='sk-divider' />

          {/* Auth */}
          {userInfo ? (
            <div className='sk-user-menu'>
              <Link
                to='/myorders'
                className={`sk-nav-link ${isActive('/myorders') ? 'sk-nav-link-active' : ''}`}
              >
                <span className='sk-nav-link-label'>Orders</span>
              </Link>

              {userInfo.isAdmin && (
                <Link
                  to='/admin'
                  className='sk-admin-badge'
                  style={{
                    background: isActive('/admin') ? '#FFD814' : 'rgba(255,216,20,0.15)',
                    color: isActive('/admin') ? '#131921' : '#FFD814',
                  }}
                >
                  Admin
                </Link>
              )}

              <div className='sk-avatar-group'>
                <div className='sk-avatar'>{userInfo.name.charAt(0).toUpperCase()}</div>
                <div className='sk-user-info'>
                  <span className='sk-greeting'>Hello,</span>
                  <span className='sk-username'>{userInfo.name.split(' ')[0]}</span>
                </div>
                <button onClick={logoutHandler} className='sk-logout-btn' title='Logout'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#aaa' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/>
                    <polyline points='16 17 21 12 16 7'/>
                    <line x1='21' y1='12' x2='9' y2='12'/>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className='sk-auth-links'>
              <Link to='/login' className='sk-login-btn'>Login</Link>
              <Link to='/register' className='sk-register-btn'>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
