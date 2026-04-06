import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Product not found');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center' }}>{error}</h2>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={styles.backBtn}>
        ← Back to Products
      </button>

      <div style={styles.layout}>
        {/* Left: Image */}
        <div style={styles.imageBox}>
          <img src={product.image} alt={product.name} style={styles.image} />
        </div>

        {/* Middle: Info */}
        <div style={styles.info}>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.brand}>Brand: {product.brand}</p>
          <p style={styles.rating}>⭐ {product.rating} ({product.numReviews} reviews)</p>
          <p style={styles.category}>Category: {product.category}</p>
          <p style={styles.description}>{product.description}</p>
        </div>

        {/* Right: Buy Box */}
        <div style={styles.buyBox}>
          <p style={styles.price}>₹{product.price.toLocaleString()}</p>

          <p style={styles.stock}>
            Status:{' '}
            <span style={{ color: product.countInStock > 0 ? 'green' : 'red' }}>
              {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </p>

          {product.countInStock > 0 && (
            <>
              <div style={styles.qtyRow}>
                <label style={styles.label}>Qty:</label>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  style={styles.select}
                >
                  {[...Array(Math.min(product.countInStock, 5)).keys()].map(
                    (x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    )
                  )}
                </select>
              </div>

              <button onClick={addToCartHandler} style={styles.cartBtn}>
                Add to Cart
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  backBtn: {
    background: 'none',
    border: '1px solid #ccc',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '14px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 300px',
    gap: '30px',
  },
  imageBox: {
    borderRadius: '8px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  name: {
    fontSize: '22px',
    color: '#131921',
    margin: 0,
  },
  brand: {
    color: '#555',
    margin: 0,
  },
  rating: {
    color: '#f0a500',
    margin: 0,
  },
  category: {
    color: '#555',
    margin: 0,
  },
  description: {
    color: '#333',
    lineHeight: '1.6',
  },
  buyBox: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    height: 'fit-content',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  price: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#B12704',
    margin: 0,
  },
  stock: {
    fontSize: '15px',
    margin: 0,
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  label: {
    fontSize: '15px',
  },
  select: {
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  cartBtn: {
    backgroundColor: '#FFD814',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    color: '#131921',
  },
};

export default ProductDetailPage;