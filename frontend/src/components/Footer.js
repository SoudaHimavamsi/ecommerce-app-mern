import React from "react";

const Footer = () => {
  return (
    <footer className="sk-footer">
      <div className="sk-footer-container">

        {/* BRAND */}
        <div className="sk-footer-top">

          <div className="sk-footer-brand-row">
            <div className="sk-footer-logo">S</div>
            <h2>SnapKart</h2>
          </div>

          <p className="sk-footer-desc">
            Your one-stop destination for electronics, fashion and more — fast and secure.
          </p>

          <div className="sk-footer-tech">
            <span>React</span>
            <span>Node.js</span>
            <span>MongoDB</span>
            <span>Express</span>
          </div>

        </div>

        {/* LINKS */}
        <div className="sk-footer-links-inline">
          <div>
            <h4>SHOP</h4>
            <div className="sk-footer-inline-list">
              <a href="/">All Products</a>
              <a href="/cart">My Cart</a>
              <a href="/wishlist">Wishlist</a>
              <a href="/category/electronics">Electronics</a>
            </div>
          </div>

          <div>
            <h4>ACCOUNT</h4>
            <div className="sk-footer-inline-list">
              <a href="/login">Sign In</a>
              <a href="/register">Create Account</a>
              <a href="/orders">My Orders</a>
              <a href="/profile">Profile</a>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="sk-footer-features-wrapper">
          <h4>FEATURES</h4>
          <div className="sk-footer-features">
            <div className="sk-footer-feature-item">🚚 Free Delivery</div>
            <div className="sk-footer-feature-item">🔒 Secure Pay</div>
            <div className="sk-footer-feature-item">↩️ Easy Returns</div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="sk-footer-bottom">
          <p>© 2026 SnapKart — Built with ❤️ by Himavamsi</p>
          <div>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>

      </div>

      <style>{`
        .sk-footer {
          background: linear-gradient(145deg,#0f1923,#1a2a3a,#0d1f2d);
          color: #d1d5db;
          padding: 20px 16px;
        }

        .sk-footer-container {
          max-width: 1100px;
          margin: auto;
        }

        /* BRAND ROW */
        .sk-footer-brand-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* ICON = EXACT BLOCK SIZE */
        .sk-footer-logo {
          width: 32px;
          height: 32px;
          background: #ffd700;
          color: black;
          font-weight: bold;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }

        /* TEXT MATCHES VISUAL HEIGHT */
        .sk-footer-brand-row h2 {
          margin: 0;
          font-size: 22px;
          line-height: 32px; /* important */
          color: #ffd700;
        }

        .sk-footer-desc {
          margin: 8px 0;
          font-size: 13px;
          color: #9ca3af;
        }

        .sk-footer-tech span {
          background: #1f2937;
          padding: 3px 8px;
          margin-right: 6px;
          border-radius: 6px;
          font-size: 11px;
        }

        /* LINKS */
        .sk-footer-links-inline {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 12px;
        }

        .sk-footer-links-inline h4 {
          font-size: 13px;
          margin-bottom: 4px;
          color: white;
        }

        .sk-footer-inline-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 12px;
          font-size: 12px;
        }

        .sk-footer-inline-list a {
          color: #9ca3af;
          text-decoration: none;
        }

        .sk-footer-inline-list a:hover {
          color: white;
        }

        /* FEATURES */
        .sk-footer-features-wrapper {
          margin-top: 12px;
        }

        .sk-footer-features-wrapper h4 {
          font-size: 13px;
          margin-bottom: 6px;
          color: white;
        }

        .sk-footer-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          font-size: 12px;
        }

        .sk-footer-feature-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        /* BOTTOM */
        .sk-footer-bottom {
          margin-top: 14px;
          padding-top: 10px;
          border-top: 1px solid #374151;
          font-size: 11px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sk-footer-bottom div a {
          margin-right: 10px;
          color: #9ca3af;
          text-decoration: none;
        }

        /* DESKTOP */
        @media (min-width: 768px) {
          .sk-footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;