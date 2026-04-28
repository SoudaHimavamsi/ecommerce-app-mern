import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const NAV_CSS = `
  .sk-nav { background:#0f1923; border-bottom:1px solid rgba(255,255,255,0.07); position:sticky; top:0; z-index:1000; }
  .sk-nav-inner { max-width:1280px; margin:0 auto; padding:0 16px; height:68px; display:flex; align-items:center; gap:12px; }
  .sk-brand { text-decoration:none; display:flex; align-items:center; gap:8px; flex-shrink:0; }
  .sk-brand-icon { width:32px; height:32px; background:#FFD814; color:#0f1923; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:17px; flex-shrink:0; }
  .sk-brand-text { color:#fff; font-size:19px; font-weight:700; letter-spacing:-0.5px; }
  .sk-brand-accent { color:#FFD814; }
  .sk-form { flex:1; min-width:0; }
  .sk-search-wrapper { display:flex; align-items:center; background:#fff; border-radius:10px; overflow:hidden; width:100%; }
  .sk-search-icon { padding:0 8px; display:flex; align-items:center; flex-shrink:0; }
  .sk-input { flex:1; min-width:0; padding:10px 4px; font-size:14px; border:none; outline:none; background:transparent; color:#333; }
  .sk-clear-btn { background:none; border:none; color:#bbb; cursor:pointer; padding:0 8px; flex-shrink:0; font-size:13px; }
  .sk-links { display:flex; align-items:center; gap:10px; flex-shrink:0; }
  .sk-icon-link { display:flex; flex-direction:column; align-items:center; gap:2px; text-decoration:none; color:#fff; }
  .sk-icon-wrapper { position:relative; display:flex; align-items:center; }
  .sk-badge { position:absolute; top:-7px; right:-9px; background:#FFD814; color:#0f1923; border-radius:50%; width:17px; height:17px; font-size:10px; font-weight:800; display:flex; align-items:center; justify-content:center; }
  .sk-icon-label { font-size:10px; color:#aaa; }
  .sk-nav-link { color:#ccc; text-decoration:none; font-size:14px; font-weight:500; white-space:nowrap; }
  .sk-nav-link-active { color:#FFD814; }
  .sk-admin-badge { padding:4px 10px; border-radius:6px; font-size:12px; font-weight:700; text-decoration:none; letter-spacing:0.5px; white-space:nowrap; }
  .sk-divider { width:1px; height:28px; background:rgba(255,255,255,0.1); flex-shrink:0; }

  /* Profile icon */
  .sk-profile-btn { position:relative; flex-shrink:0; }
  .sk-profile-circle { width:34px; height:34px; border-radius:50%; background:#FFD814; color:#0f1923; font-weight:800; font-size:14px; display:flex; align-items:center; justify-content:center; cursor:pointer; border:none; flex-shrink:0; }
  .sk-profile-circle-guest { background:rgba(255,255,255,0.15); color:#fff; }
  .sk-profile-circle svg { pointer-events:none; }

  /* Dropdown */
  .sk-dropdown { position:absolute; top:calc(100% + 10px); right:0; background:#fff; border-radius:12px; box-shadow:0 8px 32px rgba(0,0,0,0.18); min-width:190px; padding:8px; border:1px solid #f0f0f0; z-index:2000; }
  .sk-dropdown-header { padding:10px 12px 8px; border-bottom:1px solid #f5f5f5; margin-bottom:4px; }
  .sk-dropdown-name { font-size:13px; font-weight:700; color:#1a1a2e; margin:0 0 2px; }
  .sk-dropdown-email { font-size:11px; color:#9ca3af; margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; }
  .sk-dropdown-item { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:8px; text-decoration:none; color:#374151; font-size:13px; font-weight:500; border:none; background:none; cursor:pointer; width:100%; }
  .sk-dropdown-item:hover { background:#f8f9fa; }
  .sk-dropdown-item-icon { font-size:15px; flex-shrink:0; }
  .sk-dropdown-divider { height:1px; background:#f0f0f0; margin:4px 0; }
  .sk-dropdown-logout { color:#ef4444 !important; }

  @media (max-width: 768px) {
    .sk-brand-text { display:none; }
    .sk-icon-label { display:none; }
    .sk-divider { display:none; }
    .sk-links { gap:6px; }
  }

  @media (max-width: 480px) {
    .sk-nav-inner { height:56px; padding:0 10px; gap:8px; }
    .sk-brand-icon { width:28px; height:28px; font-size:13px; }
    .sk-input { padding:8px 4px; font-size:13px; }
    .sk-clear-btn { display:none; }
    .sk-links { gap:4px; }
    .sk-admin-badge { font-size:10px; padding:3px 6px; }
    .sk-profile-circle { width:30px; height:30px; font-size:13px; }
  }
`;

let navCssInjected = false;

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth();
  const { wishlistItems } = useWishlist();
  const dropdownRef = useRef(null);

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    if (!navCssInjected) {
      const style = document.createElement('style');
      style.textContent = NAV_CSS;
      document.head.appendChild(style);
      navCssInjected = true;
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdown on route change
  useEffect(() => { setDropdownOpen(false); }, [location.pathname]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleProfileClick = () => {
    if (userInfo) {
      setDropdownOpen((prev) => !prev);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
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

        {/* Search */}
        <form onSubmit={submitHandler} className='sk-form'>
          <div className='sk-search-wrapper'>
            <span className='sk-search-icon'>
              <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='#999' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                <circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/>
              </svg>
            </span>
            <input
              type='text'
              placeholder='Search products...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='sk-input'
            />
            {searchTerm && (
              <button type='button' onClick={() => setSearchTerm('')} className='sk-clear-btn'>✕</button>
            )}
          </div>
        </form>

        {/* Right icons */}
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

          {/* Admin — only when admin */}
          {userInfo?.isAdmin && (
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

          {/* Profile icon with dropdown */}
          <div className='sk-profile-btn' ref={dropdownRef}>
            <button
              onClick={handleProfileClick}
              className={`sk-profile-circle ${!userInfo ? 'sk-profile-circle-guest' : ''}`}
              title={userInfo ? userInfo.name : 'Sign in'}
              aria-label='Profile'
            >
              {userInfo ? (
                userInfo.name.charAt(0).toUpperCase()
              ) : (
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/>
                  <circle cx='12' cy='7' r='4'/>
                </svg>
              )}
            </button>

            {/* Dropdown — only when logged in and open */}
            {userInfo && dropdownOpen && (
              <div className='sk-dropdown'>
                <div className='sk-dropdown-header'>
                  <p className='sk-dropdown-name'>{userInfo.name}</p>
                  <p className='sk-dropdown-email'>{userInfo.email}</p>
                </div>

                <Link to='/profile' className='sk-dropdown-item'>
                  <span className='sk-dropdown-item-icon'>👤</span>
                  My Profile
                </Link>
                <Link to='/myorders' className='sk-dropdown-item'>
                  <span className='sk-dropdown-item-icon'>📦</span>
                  My Orders
                </Link>
                {userInfo.isAdmin && (
                  <Link to='/admin' className='sk-dropdown-item'>
                    <span className='sk-dropdown-item-icon'>⚙️</span>
                    Admin Panel
                  </Link>
                )}
                <div className='sk-dropdown-divider' />
                <button onClick={handleLogout} className='sk-dropdown-item sk-dropdown-logout'>
                  <span className='sk-dropdown-item-icon'>🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
