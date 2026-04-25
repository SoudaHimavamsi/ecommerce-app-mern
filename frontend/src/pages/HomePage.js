import React, { useEffect, useState } from 'react';
import api from '../config/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const CATEGORIES = ['All', 'Electronics', 'Computers', 'Footwear', 'Clothing', 'Books', 'Home', 'Sports'];

const HOME_CSS = `
  .sk-hero {
    background: linear-gradient(135deg, #0f1923 0%, #1a2a3a 50%, #0d1f2d 100%);
    border-radius: 20px;
    padding: 56px 48px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    position: relative;
    overflow: hidden;
    min-height: 280px;
  }
  .sk-hero-circle1 { position:absolute; width:300px; height:300px; border-radius:50%; background:rgba(255,216,20,0.06); top:-80px; right:200px; pointer-events:none; }
  .sk-hero-circle2 { position:absolute; width:200px; height:200px; border-radius:50%; background:rgba(255,216,20,0.04); bottom:-60px; left:100px; pointer-events:none; }
  .sk-hero-circle3 { position:absolute; width:150px; height:150px; border-radius:50%; background:rgba(255,255,255,0.02); top:20px; right:80px; pointer-events:none; }
  .sk-hero-content { flex:1; position:relative; z-index:1; }
  .sk-hero-badge { display:inline-block; background:rgba(255,216,20,0.15); color:#FFD814; font-size:12px; font-weight:600; padding:6px 14px; border-radius:20px; margin-bottom:16px; border:1px solid rgba(255,216,20,0.2); letter-spacing:0.3px; }
  .sk-hero-title { font-size:42px; font-weight:800; color:#fff; line-height:1.15; margin-bottom:14px; letter-spacing:-1px; }
  .sk-hero-accent { color:#FFD814; }
  .sk-hero-subtitle { font-size:14px; color:#8899aa; line-height:1.7; margin-bottom:28px; }
  .sk-hero-actions { display:flex; align-items:center; gap:32px; flex-wrap:wrap; }
  .sk-hero-cta { background-color:#FFD814; color:#0f1923; border:none; padding:14px 32px; border-radius:10px; font-size:15px; font-weight:700; cursor:pointer; letter-spacing:0.3px; box-shadow:0 4px 20px rgba(255,216,20,0.4); }
  .sk-hero-stats { display:flex; align-items:center; gap:16px; }
  .sk-hero-stat { display:flex; flex-direction:column; align-items:center; }
  .sk-hero-stat-num { font-size:18px; font-weight:700; color:#fff; line-height:1; }
  .sk-hero-stat-label { font-size:11px; color:#667788; margin-top:2px; }
  .sk-hero-stat-divider { width:1px; height:28px; background:rgba(255,255,255,0.1); }
  .sk-hero-visual { display:flex; flex-direction:column; gap:12px; position:relative; z-index:1; flex-shrink:0; }
  .sk-floating-card { background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:12px 16px; width:210px; }
  .sk-floating-card-inner { display:flex; align-items:center; gap:12px; }
  .sk-floating-icon { font-size:22px; }
  .sk-floating-title { color:#fff; font-size:13px; font-weight:600; margin:0; }
  .sk-floating-text { color:#8899aa; font-size:11px; margin:0; }

  .sk-cat-section { margin-bottom:24px; }
  .sk-cat-bar { display:flex; gap:10px; flex-wrap:wrap; }
  .sk-cat-btn { padding:8px 20px; border-radius:24px; border:1px solid; font-size:13px; cursor:pointer; transition:all 0.2s; }

  .sk-section-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; }
  .sk-heading { font-size:20px; font-weight:700; color:#1a1a2e; margin:0; }
  .sk-subheading { font-size:13px; color:#999; margin-top:2px; }
  .sk-clear-btn { background:#fff; border:1px solid #e0e0e0; color:#666; padding:7px 14px; border-radius:8px; font-size:13px; cursor:pointer; font-weight:500; }

  .sk-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:20px; }

  .sk-error-box { text-align:center; padding:60px 20px; background:#fff; border-radius:12px; border:1px solid #eee; }
  .sk-empty-state { text-align:center; padding:60px 20px; background:#fff; border-radius:12px; border:1px solid #eee; }
  .sk-reset-btn { background:#FFD814; border:none; padding:10px 24px; border-radius:8px; font-weight:600; font-size:14px; cursor:pointer; color:#0f1923; }

  /* Tablet */
  @media (max-width: 768px) {
    .sk-hero {
      padding: 36px 28px;
      flex-direction: column;
      align-items: flex-start;
      min-height: auto;
    }
    .sk-hero-visual { display: none; }
    .sk-hero-title { font-size: 32px; }
    .sk-hero-actions { gap: 20px; }
    .sk-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:16px; }
  }

  /* Mobile */
  @media (max-width: 480px) {
    .sk-hero {
      padding: 28px 20px;
      border-radius: 16px;
      margin-bottom: 20px;
    }
    .sk-hero-title { font-size: 26px; letter-spacing: -0.5px; }
    .sk-hero-subtitle { font-size: 13px; margin-bottom: 20px; }
    .sk-hero-badge { font-size: 11px; }
    .sk-hero-cta { padding: 12px 24px; font-size: 14px; }
    .sk-hero-stats { gap: 12px; }
    .sk-hero-actions { gap: 16px; }
    .sk-grid { grid-template-columns: repeat(auto-fill, minmax(155px, 1fr)); gap:12px; }
    .sk-cat-btn { padding: 6px 14px; font-size: 12px; }
  }
`;

let homeCssInjected = false;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (!homeCssInjected) {
      const style = document.createElement('style');
      style.textContent = HOME_CSS;
      document.head.appendChild(style);
      homeCssInjected = true;
    }

    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Make sure your backend is running.');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  if (error) {
    return (
      <div className='sk-error-box'>
        <p style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</p>
        <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Something went wrong</h3>
        <p style={{ color: '#888', fontSize: '15px' }}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className='sk-hero'>
        <div className='sk-hero-circle1' />
        <div className='sk-hero-circle2' />
        <div className='sk-hero-circle3' />

        <div className='sk-hero-content'>
          <div className='sk-hero-badge'>🛍️ New Arrivals Every Week</div>
          <h1 className='sk-hero-title'>
            Shop Smarter,<br />
            <span className='sk-hero-accent'>Live Better</span>
          </h1>
          <p className='sk-hero-subtitle'>
            Discover our products across electronics,<br />
            fashion, footwear and more — all in one place.
          </p>
          <div className='sk-hero-actions'>
            <button
              onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
              className='sk-hero-cta'
            >
              Shop Now →
            </button>
            <div className='sk-hero-stats'>
              <div className='sk-hero-stat'>
                <span className='sk-hero-stat-num'>🚚</span>
                <span className='sk-hero-stat-label'>Free Delivery</span>
              </div>
              <div className='sk-hero-stat-divider' />
              <div className='sk-hero-stat'>
                <span className='sk-hero-stat-num'>🔒</span>
                <span className='sk-hero-stat-label'>Secure Pay</span>
              </div>
              <div className='sk-hero-stat-divider' />
              <div className='sk-hero-stat'>
                <span className='sk-hero-stat-num'>↩️</span>
                <span className='sk-hero-stat-label'>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right feature cards — hidden on mobile via CSS */}
        <div className='sk-hero-visual'>
          {[
            { icon: '📦', title: 'Free Delivery', text: 'On all orders' },
            { icon: '🔒', title: 'Secure Payment', text: '100% protected' },
            { icon: '↩️', title: 'Easy Returns', text: '30 day policy' },
          ].map((c) => (
            <div key={c.title} className='sk-floating-card'>
              <div className='sk-floating-card-inner'>
                <span className='sk-floating-icon'>{c.icon}</span>
                <div>
                  <p className='sk-floating-title'>{c.title}</p>
                  <p className='sk-floating-text'>{c.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className='sk-cat-section'>
        <div className='sk-cat-bar'>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className='sk-cat-btn'
              style={{
                backgroundColor: selectedCategory === cat ? '#0f1923' : '#fff',
                color: selectedCategory === cat ? '#FFD814' : '#555',
                borderColor: selectedCategory === cat ? '#0f1923' : '#e0e0e0',
                fontWeight: selectedCategory === cat ? '600' : '400',
                boxShadow: selectedCategory === cat
                  ? '0 4px 12px rgba(15,25,35,0.25)'
                  : '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div id='products-section'>
        <div className='sk-section-header'>
          <div>
            <h2 className='sk-heading'>
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h2>
            {!loading && (
              <p className='sk-subheading'>
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
          {selectedCategory !== 'All' && (
            <button onClick={() => setSelectedCategory('All')} className='sk-clear-btn'>
              ✕ Clear Filter
            </button>
          )}
        </div>

        {loading ? (
          <div className='sk-grid'>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className='sk-empty-state'>
            <p style={{ fontSize: '48px', marginBottom: '12px' }}>📦</p>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No products in this category</h3>
            <p style={{ color: '#888', fontSize: '15px', marginBottom: '20px' }}>Try selecting a different category.</p>
            <button onClick={() => setSelectedCategory('All')} className='sk-reset-btn'>
              Show All Products
            </button>
          </div>
        ) : (
          <div className='sk-grid'>
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
