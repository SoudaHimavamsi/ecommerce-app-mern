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
      {/* Hero Banner */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to ShopClone</h1>
        <p style={styles.heroSubtitle}>Discover amazing products at great prices</p>
      </div>

      {/* Category Filter */}
      <div style={styles.categoryBar}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              ...styles.catBtn,
              backgroundColor: selectedCategory === cat ? '#131921' : '#fff',
              color: selectedCategory === cat ? '#FFD814' : '#333',
              borderColor: selectedCategory === cat ? '#131921' : '#ddd',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Section Heading */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.heading}>
          {selectedCategory === 'All' ? 'All Products' : selectedCategory}
        </h2>
        {!loading && (
          <span style={styles.productCount}>
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
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
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #131921 0%, #232f3e 100%)',
    borderRadius: '12px',
    padding: '40px 32px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  heroTitle: {
    color: '#FFD814',
    fontSize: '32px',
    marginBottom: '8px',
  },
  heroSubtitle: {
    color: '#ccc',
    fontSize: '16px',
  },
  categoryBar: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  catBtn: {
    padding: '8px 18px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.15s',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  heading: {
    fontSize: '20px',
    color: '#131921',
  },
  productCount: {
    fontSize: '14px',
    color: '#888',
    backgroundColor: '#f0f2f5',
    padding: '4px 12px',
    borderRadius: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
  errorBox: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #eee',
  },
  errorIcon: { fontSize: '48px', marginBottom: '12px' },
  errorTitle: { fontSize: '20px', marginBottom: '8px', color: '#131921' },
  errorText: { color: '#888', fontSize: '15px' },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #eee',
  },
  emptyIcon: { fontSize: '48px', marginBottom: '12px' },
  emptyTitle: { fontSize: '20px', marginBottom: '8px', color: '#131921' },
  emptyText: { color: '#888', fontSize: '15px', marginBottom: '20px' },
  resetBtn: {
    backgroundColor: '#FFD814',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    color: '#131921',
  },
};

export default HomePage;