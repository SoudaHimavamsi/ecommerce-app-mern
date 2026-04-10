import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminProductFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    brand: '',
    countInStock: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:5000/api/admin/products`,
            { headers: { Authorization: `Bearer ${userInfo.token}` } }
          );
          const product = data.find((p) => p._id === id);
          if (product) {
            setFormData({
              name: product.name,
              price: product.price,
              description: product.description,
              image: product.image,
              category: product.category,
              brand: product.brand || '',
              countInStock: product.countInStock,
            });
          }
          setFetching(false);
        } catch (err) {
          setError('Failed to load product');
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing, userInfo, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/admin/products/${id}`,
          formData,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
      } else {
        await axios.post(
          `http://localhost:5000/api/admin/products`,
          formData,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
      }
      setSuccess(true);
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  if (fetching) return <h2 style={{ textAlign: 'center', padding: '60px' }}>Loading product...</h2>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/admin/products')} style={styles.backBtn}>
          ← Back to Products
        </button>
        <h2 style={styles.heading}>
          {isEditing ? '✏️ Edit Product' : '➕ Add New Product'}
        </h2>
      </div>

      {/* Success Message */}
      {success && (
        <div style={styles.successMsg}>
          ✅ Product {isEditing ? 'updated' : 'created'} successfully! Redirecting...
        </div>
      )}

      {/* Error Message */}
      {error && <div style={styles.errorMsg}>{error}</div>}

      {/* Form */}
      <div style={styles.formCard}>
        <form onSubmit={submitHandler}>
          <div style={styles.formGrid}>

            {/* Name */}
            <div style={styles.fieldFull}>
              <label style={styles.label}>Product Name *</label>
              <input
                name='name'
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                placeholder='e.g. Apple iPhone 15'
                required
              />
            </div>

            {/* Price */}
            <div style={styles.field}>
              <label style={styles.label}>Price (₹) *</label>
              <input
                name='price'
                type='number'
                value={formData.price}
                onChange={handleChange}
                style={styles.input}
                placeholder='e.g. 79999'
                required
              />
            </div>

            {/* Stock */}
            <div style={styles.field}>
              <label style={styles.label}>Count In Stock *</label>
              <input
                name='countInStock'
                type='number'
                value={formData.countInStock}
                onChange={handleChange}
                style={styles.input}
                placeholder='e.g. 10'
                required
              />
            </div>

            {/* Category */}
            <div style={styles.field}>
              <label style={styles.label}>Category *</label>
              <select
                name='category'
                value={formData.category}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value=''>Select category</option>
                <option value='Electronics'>Electronics</option>
                <option value='Computers'>Computers</option>
                <option value='Footwear'>Footwear</option>
                <option value='Clothing'>Clothing</option>
                <option value='Books'>Books</option>
                <option value='Home'>Home</option>
                <option value='Sports'>Sports</option>
                <option value='Other'>Other</option>
              </select>
            </div>

            {/* Brand */}
            <div style={styles.field}>
              <label style={styles.label}>Brand *</label>
              <input
                name='brand'
                value={formData.brand}
                onChange={handleChange}
                style={styles.input}
                placeholder='e.g. Apple'
                required
              />
            </div>

            {/* Image URL */}
            <div style={styles.fieldFull}>
              <label style={styles.label}>Image URL *</label>
              <input
                name='image'
                value={formData.image}
                onChange={handleChange}
                style={styles.input}
                placeholder='https://images.unsplash.com/...'
                required
              />
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div style={styles.fieldFull}>
                <label style={styles.label}>Image Preview</label>
                <img
                  src={formData.image}
                  alt='Preview'
                  style={styles.imagePreview}
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            )}

            {/* Description */}
            <div style={styles.fieldFull}>
              <label style={styles.label}>Description *</label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleChange}
                style={styles.textarea}
                placeholder='Describe the product...'
                required
                rows={4}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button
              type='button'
              onClick={() => navigate('/admin/products')}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type='submit'
              style={styles.submitBtn}
              disabled={loading || success}
            >
              {loading
                ? 'Saving...'
                : isEditing
                ? '💾 Update Product'
                : '➕ Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '20px' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' },
  heading: { fontSize: '24px', margin: 0, color: '#131921' },
  backBtn: {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  successMsg: {
    backgroundColor: '#e6f4ea',
    border: '1px solid #a8d5b5',
    color: '#1a5c2a',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '15px',
  },
  errorMsg: {
    backgroundColor: '#fff0f0',
    border: '1px solid #f5c6c6',
    color: '#B12704',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '15px',
  },
  formCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '32px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '24px',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  fieldFull: { display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' },
  label: { fontSize: '13px', fontWeight: 'bold', color: '#131921' },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
  },
  textarea: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  imagePreview: {
    width: '160px',
    height: '160px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  btnRow: { display: 'flex', justifyContent: 'flex-end', gap: '12px' },
  cancelBtn: {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'pointer',
  },
  submitBtn: {
    backgroundColor: '#FFD814',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    color: '#131921',
  },
};

export default AdminProductFormPage;