import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth();
  const { wishlistItems } = useWishlist();

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

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
    <nav style={styles.nav}>
      <div style={styles.inner}>

        {/* Brand */}
        <Link to='/' style={styles.brand}>
          <span style={styles.brandIcon}>S</span>
          <span style={styles.brandText}>
            Shop<span style={styles.brandAccent}>Clone</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={submitHandler} style={styles.form}>
          <div style={{
            ...styles.searchWrapper,
            boxShadow: searchFocused ? '0 0 0 3px rgba(255,216,20,0.35)' : 'none',
          }}>
            <span style={styles.searchIcon}>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#999' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                <circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/>
              </svg>
            </span>
            <input
              type='text'
              placeholder='Search products, brands, categories...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={styles.input}
            />
            {searchTerm && (
              <button
                type='button'
                onClick={() => setSearchTerm('')}
                style={styles.clearBtn}
              >
                ✕
              </button>
            )}
            <button type='submit' style={styles.searchBtn}>
              Search
            </button>
          </div>
        </form>

        {/* Right Links */}
        <div style={styles.links}>

          {/* Wishlist */}
          <Link to='/wishlist' style={styles.iconLink}>
            <div style={styles.iconWrapper}>
              <svg width='20' height='20' viewBox='0 0 24 24' fill={wishlistItems.length > 0 ? '#e53935' : 'none'} stroke={wishlistItems.length > 0 ? '#e53935' : '#fff'} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/>
              </svg>
              {wishlistItems.length > 0 && (
                <span style={styles.badge}>{wishlistItems.length}</span>
              )}
            </div>
            <span style={styles.iconLabel}>Wishlist</span>
          </Link>

          {/* Cart */}
          <Link to='/cart' style={styles.iconLink}>
            <div style={styles.iconWrapper}>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#fff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <circle cx='9' cy='21' r='1'/><circle cx='20' cy='21' r='1'/>
                <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'/>
              </svg>
              {totalItems > 0 && (
                <span style={styles.badge}>{totalItems}</span>
              )}
            </div>
            <span style={styles.iconLabel}>Cart</span>
          </Link>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Auth */}
          {userInfo ? (
            <div style={styles.userMenu}>
              {/* My Orders */}
              <Link
                to='/myorders'
                style={{
                  ...styles.navLink,
                  borderBottom: isActive('/myorders') ? '2px solid #FFD814' : '2px solid transparent',
                }}
              >
                Orders
              </Link>

              {/* Admin */}
              {userInfo.isAdmin && (
                <Link
                  to='/admin'
                  style={{
                    ...styles.adminBadge,
                    background: isActive('/admin') ? '#FFD814' : 'rgba(255,216,20,0.15)',
                    color: isActive('/admin') ? '#131921' : '#FFD814',
                  }}
                >
                  Admin
                </Link>
              )}

              {/* User Avatar + Logout */}
              <div style={styles.avatarGroup}>
                <div style={styles.avatar}>
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <div style={styles.userInfo}>
                  <span style={styles.greeting}>Hello,</span>
                  <span style={styles.userName}>
                    {userInfo.name.split(' ')[0]}
                  </span>
                </div>
                <button onClick={logoutHandler} style={styles.logoutBtn} title='Logout'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#aaa' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/>
                    <polyline points='16 17 21 12 16 7'/>
                    <line x1='21' y1='12' x2='9' y2='12'/>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.authLinks}>
              <Link to='/login' style={styles.loginBtn}>
                Login
              </Link>
              <Link to='/register' style={styles.registerBtn}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#0f1923',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
  },
  inner: {
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '0 24px',
  height: '68px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '20px',
  },
  brand: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
  },
  brandIcon: {
    width: '34px',
    height: '34px',
    backgroundColor: '#FFD814',
    color: '#0f1923',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '18px',
    lineHeight: '34px',
    textAlign: 'center',
  },
  brandText: {
    color: '#fff',
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  brandAccent: {
    color: '#FFD814',
  },
  form: {
    flex: 1,
    maxWidth: '560px',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s',
  },
  searchIcon: {
    padding: '0 12px',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: '10px 4px',
    fontSize: '14px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: '#333',
    minWidth: 0,
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#bbb',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '0 8px',
    flexShrink: 0,
  },
  searchBtn: {
    padding: '10px 18px',
    backgroundColor: '#FFD814',
    border: 'none',
    color: '#0f1923',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    flexShrink: 0,
    letterSpacing: '0.3px',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexShrink: 0,
  },
  iconLink: {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '3px',
  textDecoration: 'none',
  color: '#fff',
  minWidth: '44px',
  },
  iconWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: '-7px',
    right: '-9px',
    backgroundColor: '#FFD814',
    color: '#0f1923',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '11px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    fontSize: '10px',
    color: '#aaa',
    letterSpacing: '0.3px',
  },
  divider: {
    width: '1px',
    height: '32px',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  navLink: {
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    paddingBottom: '2px',
    transition: 'color 0.2s',
  },
  adminBadge: {
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    textDecoration: 'none',
    letterSpacing: '0.5px',
    transition: 'all 0.2s',
  },
  avatarGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: '#FFD814',
    color: '#0f1923',
    fontWeight: '800',
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  greeting: {
    fontSize: '10px',
    color: '#aaa',
    lineHeight: 1,
  },
  userName: {
    fontSize: '13px',
    color: '#fff',
    fontWeight: '600',
    lineHeight: 1.3,
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px',
  },
  links: {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
  },
  loginBtn: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.2s',
  },
  registerBtn: {
    color: '#0f1923',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '700',
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: '#FFD814',
    transition: 'all 0.2s',
  },
};

export default Navbar;