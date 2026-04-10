import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.grid}>
          <div>
            <h3 style={styles.brand}>🛒 ShopClone</h3>
            <p style={styles.tagline}>Your one-stop shop for everything.</p>
          </div>
          <div>
            <h4 style={styles.colTitle}>Shop</h4>
            <div style={styles.links}>
              <Link to='/' style={styles.link}>All Products</Link>
              <Link to='/cart' style={styles.link}>Cart</Link>
              <Link to='/wishlist' style={styles.link}>Wishlist</Link>
            </div>
          </div>
          <div>
            <h4 style={styles.colTitle}>Account</h4>
            <div style={styles.links}>
              <Link to='/login' style={styles.link}>Login</Link>
              <Link to='/register' style={styles.link}>Register</Link>
              <Link to='/myorders' style={styles.link}>My Orders</Link>
            </div>
          </div>
          <div>
            <h4 style={styles.colTitle}>Built With</h4>
            <div style={styles.links}>
              <span style={styles.tech}>React</span>
              <span style={styles.tech}>Node.js</span>
              <span style={styles.tech}>MongoDB</span>
              <span style={styles.tech}>Express</span>
            </div>
          </div>
        </div>
        <div style={styles.bottom}>
          <p style={styles.bottomText}>
            © {new Date().getFullYear()} ShopClone — Built by Himavamsi 🚀
          </p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#131921',
    marginTop: '60px',
    paddingTop: '40px',
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '32px',
    paddingBottom: '32px',
    borderBottom: '1px solid #232f3e',
  },
  brand: {
    color: '#FFD814',
    fontSize: '20px',
    marginBottom: '8px',
  },
  tagline: {
    color: '#aaa',
    fontSize: '13px',
    lineHeight: '1.6',
  },
  colTitle: {
    color: '#fff',
    fontSize: '14px',
    marginBottom: '12px',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  link: {
    color: '#aaa',
    textDecoration: 'none',
    fontSize: '13px',
  },
  tech: {
    color: '#aaa',
    fontSize: '13px',
  },
  bottom: {
    padding: '20px 0',
    textAlign: 'center',
  },
  bottomText: {
    color: '#666',
    fontSize: '13px',
  },
};

export default Footer;