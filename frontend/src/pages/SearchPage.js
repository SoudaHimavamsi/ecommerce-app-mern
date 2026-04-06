import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <h2 style={{ textAlign: 'center' }}>Searching...</h2>;

  return (
    <div>
      <h2 style={styles.heading}>
        {products.length > 0
          ? `${products.length} result(s) for "${query}"`
          : `No results found for "${query}"`}
      </h2>

      {products.length === 0 ? (
        <div style={styles.empty}>
          <p>Try searching for a different product, brand or category.</p>
          <Link to='/' style={styles.homeBtn}>Back to Home</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  heading: {
    fontSize: '20px',
    marginBottom: '20px',
    color: '#131921',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
  },
  homeBtn: {
    backgroundColor: '#FFD814',
    padding: '10px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#131921',
    fontWeight: 'bold',
    display: 'inline-block',
    marginTop: '12px',
  },
};

export default SearchPage;