import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>

        {/* Top Grid */}
        <div style={styles.grid}>

          {/* Brand Column */}
          <div style={styles.brandCol}>
            <Link to='/' style={styles.brand}>
              <div style={styles.brandIcon}>S</div>
              <span style={styles.brandText}>
                Snap<span style={styles.brandAccent}>Kart</span>
              </span>
            </Link>
            <p style={styles.brandTagline}>
              Your one-stop destination for electronics, fashion, footwear and more — delivered fast and securely.
            </p>
            <div style={styles.techStack}>
              {['React', 'Node.js', 'MongoDB', 'Express'].map((tech) => (
                <span key={tech} style={styles.techBadge}>{tech}</span>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div style={styles.linkCol}>
            <h4 style={styles.colTitle}>Shop</h4>
            <div style={styles.links}>
              <Link to='/' style={styles.link}>All Products</Link>
              <Link to='/cart' style={styles.link}>My Cart</Link>
              <Link to='/wishlist' style={styles.link}>Wishlist</Link>
              <Link to='/search?q=electronics' style={styles.link}>Electronics</Link>
              <Link to='/search?q=clothing' style={styles.link}>Clothing</Link>
            </div>
          </div>

          {/* Account Column */}
          <div style={styles.linkCol}>
            <h4 style={styles.colTitle}>Account</h4>
            <div style={styles.links}>
              <Link to='/login' style={styles.link}>Sign In</Link>
              <Link to='/register' style={styles.link}>Create Account</Link>
              <Link to='/myorders' style={styles.link}>My Orders</Link>
              <Link to='/wishlist' style={styles.link}>Saved Items</Link>
            </div>
          </div>

          {/* Features Column */}
          <div style={styles.linkCol}>
            <h4 style={styles.colTitle}>Features</h4>
            <div style={styles.features}>
              {[
                { icon: '🚚', label: 'Free Delivery', sub: 'On all orders' },
                { icon: '🔒', label: 'Secure Pay', sub: '100% protected' },
                { icon: '↩️', label: 'Easy Returns', sub: '30 day policy' },
                { icon: '⭐', label: 'Reviews', sub: 'Verified buyers' },
              ].map((f) => (
                <div key={f.label} style={styles.featureItem}>
                  <span style={styles.featureIcon}>{f.icon}</span>
                  <div>
                    <p style={styles.featureLabel}>{f.label}</p>
                    <p style={styles.featureSub}>{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Bottom Bar */}
        <div style={styles.bottomBar}>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} SnapKart — Built with ❤️ by{' '}
            <span style={styles.authorName}>Himavamsi</span>
          </p>
          <div style={styles.bottomLinks}>
            <span style={styles.bottomLink}>Privacy Policy</span>
            <span style={styles.dot}>·</span>
            <span style={styles.bottomLink}>Terms of Service</span>
            <span style={styles.dot}>·</span>
            <span style={styles.bottomLink}>Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#0f1923',
    marginTop: '80px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 24px 32px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
    gap: '48px',
    marginBottom: '48px',
  },

  // Brand
  brandCol: {},
  brand: {
    display: 'flex', alignItems: 'center',
    gap: '10px', textDecoration: 'none',
    marginBottom: '16px',
  },
  brandIcon: {
    width: '34px', height: '34px',
    backgroundColor: '#FFD814', color: '#0f1923',
    borderRadius: '8px', fontWeight: '800',
    fontSize: '18px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  brandText: {
    color: '#fff', fontSize: '20px', fontWeight: '700',
  },
  brandAccent: { color: '#FFD814' },
  brandTagline: {
    color: '#6b7280', fontSize: '13px',
    lineHeight: '1.7', marginBottom: '20px',
    maxWidth: '280px',
  },
  techStack: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  techBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: '#9ca3af', fontSize: '11px',
    padding: '4px 10px', borderRadius: '6px',
    fontWeight: '500', border: '1px solid rgba(255,255,255,0.08)',
  },

  // Link Columns
  linkCol: {},
  colTitle: {
    color: '#fff', fontSize: '13px',
    fontWeight: '700', marginBottom: '16px',
    letterSpacing: '0.5px', textTransform: 'uppercase',
  },
  links: { display: 'flex', flexDirection: 'column', gap: '10px' },
  link: {
    color: '#6b7280', textDecoration: 'none',
    fontSize: '13px', transition: 'color 0.2s',
  },

  // Features
  features: { display: 'flex', flexDirection: 'column', gap: '14px' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '10px' },
  featureIcon: { fontSize: '18px', flexShrink: 0 },
  featureLabel: {
    color: '#d1d5db', fontSize: '13px',
    fontWeight: '600', margin: 0,
  },
  featureSub: { color: '#6b7280', fontSize: '11px', margin: 0 },

  // Bottom
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: '24px',
  },
  bottomBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  copyright: { color: '#6b7280', fontSize: '13px', margin: 0 },
  authorName: { color: '#FFD814', fontWeight: '600' },
  bottomLinks: {
    display: 'flex', alignItems: 'center',
    gap: '8px',
  },
  bottomLink: { color: '#6b7280', fontSize: '13px', cursor: 'pointer' },
  dot: { color: '#374151', fontSize: '13px' },
};

export default Footer;