import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading products...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center' }}>{error}</h2>;

  return (
    <div>
      <h2 style={styles.heading}>Featured Products</h2>
      <div style={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  heading: {
    fontSize: '22px',
    marginBottom: '20px',
    color: '#131921',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
};

export default HomePage;