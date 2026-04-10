import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const CATEGORIES = ['All', 'Electronics', 'Computers', 'Footwear', 'Clothing', 'Books', 'Home', 'Sports'];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
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
      <div style={styles.errorBox}>
        <p style={styles.errorIcon}>⚠️</p>
        <h3 style={styles.errorTitle}>Something went wrong</h3>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* ✅ Hero Section */}
      <div style={styles.hero}>
        {/* Decorative circles */}
        <div style={styles.circle1} />
        <div style={styles.circle2} />
        <div style={styles.circle3} />

        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🛍️ New Arrivals Every Week</div>
          <h1 style={styles.heroTitle}>
            Shop Smarter,<br />
            <span style={styles.heroAccent}>Live Better</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Discover our products across electronics,<br />
            fashion, footwear and more — all in one place.
          </p>
          <div style={styles.heroActions}>
            <button
              onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
              style={styles.heroCTA}
            >
              Shop Now →
            </button>
            <div style={styles.heroStats}>
              <div style={styles.stat}>
                <span style={styles.statNumber}>🚚</span>
                <span style={styles.statLabel}>Free Delivery</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.stat}>
                <span style={styles.statNumber}>🔒</span>
                <span style={styles.statLabel}>Secure Pay</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.stat}>
                <span style={styles.statNumber}>↩️</span>
                <span style={styles.statLabel}>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side decorative card */}
        <div style={styles.heroVisual}>
          <div style={styles.floatingCard}>
            <div style={styles.floatingCardInner}>
              <span style={styles.floatingIcon}>📦</span>
              <div>
                <p style={styles.floatingTitle}>Free Delivery</p>
                <p style={styles.floatingText}>On all orders</p>
              </div>
            </div>
          </div>
          <div style={styles.floatingCard}>
            <div style={styles.floatingCardInner}>
              <span style={styles.floatingIcon}>🔒</span>
              <div>
                <p style={styles.floatingTitle}>Secure Payment</p>
                <p style={styles.floatingText}>100% protected</p>
              </div>
            </div>
          </div>
          <div style={styles.floatingCard}>
            <div style={styles.floatingCardInner}>
              <span style={styles.floatingIcon}>↩️</span>
              <div>
                <p style={styles.floatingTitle}>Easy Returns</p>
                <p style={styles.floatingText}>30 day policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Category Filter */}
      <div style={styles.categorySection}>
        <div style={styles.categoryBar}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                ...styles.catBtn,
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

      {/* ✅ Products Section */}
      <div id='products-section'>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.heading}>
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h2>
            {!loading && (
              <p style={styles.subheading}>
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              style={styles.clearFilterBtn}
            >
              ✕ Clear Filter
            </button>
          )}
        </div>

        {loading ? (
          <div style={styles.grid}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>📦</p>
            <h3 style={styles.emptyTitle}>No products in this category</h3>
            <p style={styles.emptyText}>Try selecting a different category.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              style={styles.resetBtn}
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  // Hero
  hero: {
    background: 'linear-gradient(135deg, #0f1923 0%, #1a2a3a 50%, #0d1f2d 100%)',
    borderRadius: '20px',
    padding: '56px 48px',
    marginBottom: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '32px',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '280px',
  },
  circle1: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'rgba(255,216,20,0.06)',
    top: '-80px',
    right: '200px',
    pointerEvents: 'none',
  },
  circle2: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'rgba(255,216,20,0.04)',
    bottom: '-60px',
    left: '100px',
    pointerEvents: 'none',
  },
  circle3: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.02)',
    top: '20px',
    right: '80px',
    pointerEvents: 'none',
  },
  heroContent: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  heroBadge: {
    display: 'inline-block',
    backgroundColor: 'rgba(255,216,20,0.15)',
    color: '#FFD814',
    fontSize: '12px',
    fontWeight: '600',
    padding: '6px 14px',
    borderRadius: '20px',
    marginBottom: '16px',
    border: '1px solid rgba(255,216,20,0.2)',
    letterSpacing: '0.3px',
  },
  heroTitle: {
    fontSize: '42px',
    fontWeight: '800',
    color: '#fff',
    lineHeight: '1.15',
    marginBottom: '14px',
    letterSpacing: '-1px',
  },
  heroAccent: {
    color: '#FFD814',
  },
  heroSubtitle: {
    fontSize: '14px',
    color: '#8899aa',
    lineHeight: '1.7',
    marginBottom: '28px',
  },
  heroActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    flexWrap: 'wrap',
  },
  heroCTA: {
    backgroundColor: '#FFD814',
    color: '#0f1923',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.3px',
    boxShadow: '0 4px 20px rgba(255,216,20,0.4)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  heroStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '11px',
    color: '#667788',
    marginTop: '2px',
  },
  statDivider: {
    width: '1px',
    height: '28px',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroVisual: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    position: 'relative',
    zIndex: 1,
    flexShrink: 0,
  },
  floatingCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '12px 16px',
    width: '210px',
  },
 
  floatingCardInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  floatingIcon: {
    fontSize: '22px',
  },
  floatingTitle: {
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    margin: 0,
  },
  floatingText: {
    color: '#8899aa',
    fontSize: '11px',
    margin: 0,
  },

  // Categories
  categorySection: {
    marginBottom: '24px',
  },
  categoryBar: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  catBtn: {
    padding: '8px 20px',
    borderRadius: '24px',
    border: '1px solid',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    letterSpacing: '0.2px',
  },

  // Section header
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  subheading: {
    fontSize: '13px',
    color: '#999',
    marginTop: '2px',
  },
  clearFilterBtn: {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    color: '#666',
    padding: '7px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '500',
  },

  // Grid
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },

  // Error
  errorBox: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #eee',
  },
  errorIcon: { fontSize: '48px', marginBottom: '12px' },
  errorTitle: { fontSize: '20px', marginBottom: '8px' },
  errorText: { color: '#888', fontSize: '15px' },

  // Empty
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #eee',
  },
  emptyIcon: { fontSize: '48px', marginBottom: '12px' },
  emptyTitle: { fontSize: '20px', marginBottom: '8px' },
  emptyText: { color: '#888', fontSize: '15px', marginBottom: '20px' },
  resetBtn: {
    backgroundColor: '#FFD814',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#0f1923',
  },
};

export default HomePage;