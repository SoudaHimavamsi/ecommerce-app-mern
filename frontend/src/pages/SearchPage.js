import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        const filtered = data.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filtered);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    if (query) fetchProducts();
  }, [query]);

  const getSortedProducts = () => {
    const sorted = [...products];
    if (sortBy === 'price-asc') return sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return sorted.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') return sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  };

  const sortedProducts = getSortedProducts();

  return (
    <div style={styles.container}>

      {/* Search Header */}
      <div style={styles.searchHeader}>
        <div style={styles.queryInfo}>
          {loading ? (
            <div style={styles.loadingTitle}>
              <div style={styles.loadingLine} />
            </div>
          ) : (
            <>
              <p style={styles.queryLabel}>Search results for</p>
              <h1 style={styles.queryText}>"{query}"</h1>
              <span style={styles.resultCount}>
                {products.length} result{products.length !== 1 ? 's' : ''} found
              </span>
            </>
          )}
        </div>

        {/* Sort Control */}
        {!loading && products.length > 0 && (
          <div style={styles.sortSection}>
            <label style={styles.sortLabel}>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={styles.sortSelect}
            >
              <option value='default'>Relevance</option>
              <option value='price-asc'>Price: Low to High</option>
              <option value='price-desc'>Price: High to Low</option>
              <option value='rating'>Top Rated</option>
            </select>
          </div>
        )}
      </div>

      {/* Search Tags */}
      {!loading && query && (
        <div style={styles.tagRow}>
          <span style={styles.tagLabel}>Searching:</span>
          <span style={styles.searchTag}>
            {query}
            <button
              onClick={() => navigate('/')}
              style={styles.tagClose}
            >✕</button>
          </span>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div style={styles.grid}>
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIconBox}>
            <svg width='56' height='56' viewBox='0 0 24 24' fill='none' stroke='#d1d5db' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
              <circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/>
              <line x1='8' y1='11' x2='14' y2='11'/>
            </svg>
          </div>
          <h2 style={styles.emptyTitle}>No results for "{query}"</h2>
          <p style={styles.emptyText}>
            Try checking your spelling, using fewer keywords,<br />
            or searching by brand or category.
          </p>
          <div style={styles.emptyActions}>
            <button onClick={() => navigate('/')} style={styles.darkBtn}>
              Browse All Products
            </button>
          </div>
          <div style={styles.suggestionsRow}>
            <p style={styles.suggestionsLabel}>Try searching for:</p>
            <div style={styles.suggestions}>
              {['Electronics', 'Apple', 'Nike', 'Sony', 'Clothing'].map((s) => (
                <button
                  key={s}
                  onClick={() => navigate(`/search?q=${s}`)}
                  style={styles.suggestionChip}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.grid}>
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto' },

  // Header
  searchHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-end', marginBottom: '16px',
    flexWrap: 'wrap', gap: '16px',
  },
  queryInfo: {},
  queryLabel: {
    fontSize: '13px', color: '#9ca3af',
    margin: '0 0 4px', fontWeight: '500',
  },
  queryText: {
    fontSize: '24px', fontWeight: '800',
    color: '#1a1a2e', margin: '0 0 6px',
    letterSpacing: '-0.5px',
  },
  resultCount: {
    display: 'inline-block',
    backgroundColor: '#eef2ff', color: '#4f46e5',
    fontSize: '12px', fontWeight: '700',
    padding: '3px 12px', borderRadius: '20px',
  },
  loadingTitle: { marginBottom: '8px' },
  loadingLine: {
    height: '28px', width: '280px',
    backgroundColor: '#e0e0e0', borderRadius: '8px',
    animation: 'pulse 1.5s ease-in-out infinite',
  },

  // Sort
  sortSection: { display: 'flex', alignItems: 'center', gap: '10px' },
  sortLabel: { fontSize: '13px', color: '#6b7280', fontWeight: '500' },
  sortSelect: {
    padding: '9px 14px', borderRadius: '10px',
    border: '1.5px solid #e5e7eb', fontSize: '13px',
    fontFamily: 'Poppins, sans-serif', color: '#374151',
    backgroundColor: '#fff', outline: 'none', cursor: 'pointer',
    fontWeight: '500',
  },

  // Tags
  tagRow: {
    display: 'flex', alignItems: 'center',
    gap: '8px', marginBottom: '20px',
  },
  tagLabel: { fontSize: '13px', color: '#9ca3af' },
  searchTag: {
    display: 'inline-flex', alignItems: 'center',
    gap: '6px', backgroundColor: '#0f1923',
    color: '#FFD814', fontSize: '13px',
    fontWeight: '600', padding: '4px 12px',
    borderRadius: '20px',
  },
  tagClose: {
    background: 'none', border: 'none',
    color: '#FFD814', cursor: 'pointer',
    fontSize: '12px', padding: 0,
    lineHeight: 1,
  },

  // Grid
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },

  // Empty state
  emptyState: {
    textAlign: 'center', padding: '60px 20px',
    backgroundColor: '#fff', borderRadius: '20px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  },
  emptyIconBox: { marginBottom: '20px' },
  emptyTitle: {
    fontSize: '22px', fontWeight: '700',
    color: '#1a1a2e', margin: '0 0 10px',
  },
  emptyText: {
    fontSize: '14px', color: '#9ca3af',
    lineHeight: '1.7', margin: '0 0 24px',
  },
  emptyActions: { marginBottom: '28px' },
  darkBtn: {
    backgroundColor: '#0f1923', color: '#FFD814',
    border: 'none', padding: '13px 28px',
    borderRadius: '10px', fontWeight: '700',
    fontSize: '14px', cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },
  suggestionsRow: {},
  suggestionsLabel: {
    fontSize: '13px', color: '#9ca3af',
    marginBottom: '10px',
  },
  suggestions: {
    display: 'flex', gap: '8px',
    flexWrap: 'wrap', justifyContent: 'center',
  },
  suggestionChip: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e5e7eb',
    color: '#374151', padding: '7px 16px',
    borderRadius: '20px', fontSize: '13px',
    cursor: 'pointer', fontWeight: '500',
    fontFamily: 'Poppins, sans-serif',
  },
};

export default SearchPage;