import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const FOOTER_CSS = `
  .sk-footer { background-color:#0f1923; margin-top:80px; border-top:1px solid rgba(255,255,255,0.06); }
  .sk-footer-inner { max-width:1200px; margin:0 auto; padding:60px 24px 32px; }
  .sk-footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1.5fr; gap:48px; margin-bottom:48px; }
  .sk-footer-brand-link { display:flex; align-items:center; gap:10px; text-decoration:none; margin-bottom:16px; }
  .sk-footer-brand-icon { width:34px; height:34px; background-color:#FFD814; color:#0f1923; border-radius:8px; font-weight:800; font-size:18px; display:flex; align-items:center; justify-content:center; }
  .sk-footer-brand-text { color:#fff; font-size:20px; font-weight:700; }
  .sk-footer-brand-accent { color:#FFD814; }
  .sk-footer-tagline { color:#6b7280; font-size:13px; line-height:1.7; margin-bottom:20px; max-width:280px; }
  .sk-footer-tech { display:flex; gap:8px; flex-wrap:wrap; }
  .sk-footer-tech-badge { background:rgba(255,255,255,0.06); color:#9ca3af; font-size:11px; padding:4px 10px; border-radius:6px; font-weight:500; border:1px solid rgba(255,255,255,0.08); }
  .sk-footer-col-title { color:#fff; font-size:13px; font-weight:700; margin-bottom:16px; letter-spacing:0.5px; text-transform:uppercase; }
  .sk-footer-links { display:flex; flex-direction:column; gap:10px; }
  .sk-footer-link { color:#6b7280; text-decoration:none; font-size:13px; }
  .sk-footer-features { display:flex; flex-direction:column; gap:14px; }
  .sk-footer-feature-item { display:flex; align-items:center; gap:10px; }
  .sk-footer-feature-icon { font-size:18px; flex-shrink:0; }
  .sk-footer-feature-label { color:#d1d5db; font-size:13px; font-weight:600; margin:0; }
  .sk-footer-feature-sub { color:#6b7280; font-size:11px; margin:0; }
  .sk-footer-divider { height:1px; background:rgba(255,255,255,0.06); margin-bottom:24px; }
  .sk-footer-bottom { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
  .sk-footer-copyright { color:#6b7280; font-size:13px; margin:0; }
  .sk-footer-author { color:#FFD814; font-weight:600; }
  .sk-footer-bottom-links { display:flex; align-items:center; gap:8px; }
  .sk-footer-bottom-link { color:#6b7280; font-size:13px; cursor:pointer; }
  .sk-footer-dot { color:#374151; font-size:13px; }

  /* Tablet — 2 columns */
  @media (max-width: 768px) {
    .sk-footer-grid {
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }
    .sk-footer-inner { padding: 40px 20px 28px; }
  }

  /* Mobile — 1 column */
  @media (max-width: 480px) {
    .sk-footer-grid {
      grid-template-columns: 1fr;
      gap: 28px;
    }
    .sk-footer-tagline { max-width: 100%; }
    .sk-footer-bottom { flex-direction: column; align-items: flex-start; gap:8px; }
    .sk-footer-inner { padding: 32px 16px 24px; }
    .sk-footer { margin-top: 48px; }
  }
`;

let footerCssInjected = false;

const Footer = () => {
  useEffect(() => {
    if (!footerCssInjected) {
      const style = document.createElement('style');
      style.textContent = FOOTER_CSS;
      document.head.appendChild(style);
      footerCssInjected = true;
    }
  }, []);

  return (
    <footer className='sk-footer'>
      <div className='sk-footer-inner'>

        {/* Top Grid */}
        <div className='sk-footer-grid'>

          {/* Brand Column */}
          <div>
            <Link to='/' className='sk-footer-brand-link'>
              <div className='sk-footer-brand-icon'>S</div>
              <span className='sk-footer-brand-text'>
                Snap<span className='sk-footer-brand-accent'>Kart</span>
              </span>
            </Link>
            <p className='sk-footer-tagline'>
              Your one-stop destination for electronics, fashion, footwear and more — delivered fast and securely.
            </p>
            <div className='sk-footer-tech'>
              {['React', 'Node.js', 'MongoDB', 'Express'].map((tech) => (
                <span key={tech} className='sk-footer-tech-badge'>{tech}</span>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className='sk-footer-col-title'>Shop</h4>
            <div className='sk-footer-links'>
              <Link to='/' className='sk-footer-link'>All Products</Link>
              <Link to='/cart' className='sk-footer-link'>My Cart</Link>
              <Link to='/wishlist' className='sk-footer-link'>Wishlist</Link>
              <Link to='/search?q=electronics' className='sk-footer-link'>Electronics</Link>
              <Link to='/search?q=clothing' className='sk-footer-link'>Clothing</Link>
            </div>
          </div>

          {/* Account Column */}
          <div>
            <h4 className='sk-footer-col-title'>Account</h4>
            <div className='sk-footer-links'>
              <Link to='/login' className='sk-footer-link'>Sign In</Link>
              <Link to='/register' className='sk-footer-link'>Create Account</Link>
              <Link to='/myorders' className='sk-footer-link'>My Orders</Link>
              <Link to='/wishlist' className='sk-footer-link'>Saved Items</Link>
            </div>
          </div>

          {/* Features Column */}
          <div>
            <h4 className='sk-footer-col-title'>Features</h4>
            <div className='sk-footer-features'>
              {[
                { icon: '🚚', label: 'Free Delivery', sub: 'On all orders' },
                { icon: '🔒', label: 'Secure Pay', sub: '100% protected' },
                { icon: '↩️', label: 'Easy Returns', sub: '30 day policy' },
                { icon: '⭐', label: 'Reviews', sub: 'Verified buyers' },
              ].map((f) => (
                <div key={f.label} className='sk-footer-feature-item'>
                  <span className='sk-footer-feature-icon'>{f.icon}</span>
                  <div>
                    <p className='sk-footer-feature-label'>{f.label}</p>
                    <p className='sk-footer-feature-sub'>{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='sk-footer-divider' />

        {/* Bottom Bar */}
        <div className='sk-footer-bottom'>
          <p className='sk-footer-copyright'>
            © {new Date().getFullYear()} SnapKart — Built with ❤️ by{' '}
            <span className='sk-footer-author'>Himavamsi</span>
          </p>
          <div className='sk-footer-bottom-links'>
            <span className='sk-footer-bottom-link'>Privacy Policy</span>
            <span className='sk-footer-dot'>·</span>
            <span className='sk-footer-bottom-link'>Terms of Service</span>
            <span className='sk-footer-dot'>·</span>
            <span className='sk-footer-bottom-link'>Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
