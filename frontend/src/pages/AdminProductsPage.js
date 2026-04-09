import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminProductsPage = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    fetchProducts();
  }, [userInfo, navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5000/api/admin/products',
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const deleteHandler = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await axios.delete(
          `http://localhost:5000/api/admin/products/${id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        alert('Product deleted successfully!');
        fetchProducts(); // Refresh list
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: 'center', padding: '60px' }}>Loading products...</h2>;
  }

  if (error) {
    return <h2 style={{ color: 'red', textAlign: 'center', padding: '60px' }}>{error}</h2>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Manage Products</h2>
        <button
          onClick={() => navigate('/admin/products/new')}
          style={styles.addBtn}
        >
          ➕ Add New Product
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} style={styles.tableRow}>
                <td style={styles.td}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={styles.productImage}
                  />
                </td>
                <td style={styles.td}>{product.name}</td>
                <td style={styles.td}>₹{product.price.toLocaleString()}</td>
                <td style={styles.td}>{product.category}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.stockBadge,
                      backgroundColor: product.countInStock > 0 ? '#e6f4ea' : '#fff0f0',
                      color: product.countInStock > 0 ? 'green' : '#B12704',
                    }}
                  >
                    {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actionBtns}>
                    <button
                      onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                      style={styles.editBtn}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteHandler(product._id, product.name)}
                      style={styles.deleteBtn}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate('/admin')}
        style={styles.backBtn}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1400px', margin: '0 auto', padding: '20px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  heading: { fontSize: '28px', margin: 0, color: '#131921' },
  addBtn: {
    backgroundColor: '#FFD814',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    color: '#131921',
  },
  tableContainer: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'auto',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f7f8fa',
    borderBottom: '2px solid #ddd',
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#131921',
  },
  tableRow: {
    borderBottom: '1px solid #eee',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#333',
  },
  productImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  stockBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  actionBtns: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    backgroundColor: '#fff',
    border: '1px solid #0066c0',
    color: '#0066c0',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: '#fff',
    border: '1px solid #B12704',
    color: '#B12704',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  backBtn: {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default AdminProductsPage;