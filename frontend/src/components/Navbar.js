import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth();

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

  return (
    <nav style={styles.nav}>
      <Link to='/' style={styles.brand}>
        🛒 ShopClone
      </Link>

      <form onSubmit={submitHandler} style={styles.form}>
        <input
          type='text'
          placeholder='Search products...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <button type='submit' style={styles.searchBtn}>
          🔍
        </button>
      </form>

      <div style={styles.links}>
        <Link to='/cart' style={styles.link}>
          🛒 Cart
          {totalItems > 0 && (
            <span style={styles.badge}>{totalItems}</span>
          )}
        </Link>

        {userInfo ? (
          <>
            <span style={styles.username}>👤 {userInfo.name}</span>
            <button onClick={logoutHandler} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to='/login' style={styles.link}>Login</Link>
            <Link to='/register' style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#131921',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
  },
  brand: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '22px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  form: {
    display: 'flex',
    flex: 1,
    maxWidth: '500px',
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '4px 0 0 4px',
    outline: 'none',
  },
  searchBtn: {
    padding: '8px 14px',
    backgroundColor: '#febd69',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    fontSize: '16px',
  },
  links: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  link: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '15px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  badge: {
    backgroundColor: '#f08804',
    color: '#fff',
    borderRadius: '50%',
    padding: '1px 6px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  username: {
    color: '#febd69',
    fontSize: '15px',
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Navbar;