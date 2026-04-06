import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/register',
        { name, email, password }
      );
      login(data);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed'
      );
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.box}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={submitHandler} style={styles.form}>
          <label style={styles.label}>Name</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            placeholder='Enter your name'
            required
          />

          <label style={styles.label}>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder='Enter email'
            required
          />

          <label style={styles.label}>Password</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder='Min 6 characters'
            required
          />

          <label style={styles.label}>Confirm Password</label>
          <input
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            placeholder='Repeat your password'
            required
          />

          <button type='submit' style={styles.btn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.switch}>
          Already have an account?{' '}
          <Link to='/login' style={styles.switchLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  box: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '32px',
    width: '100%',
    maxWidth: '380px',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#131921',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#131921',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
  },
  btn: {
    backgroundColor: '#FFD814',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    color: '#131921',
    marginTop: '6px',
  },
  error: {
    backgroundColor: '#fff0f0',
    border: '1px solid #f5c6c6',
    color: '#B12704',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '10px',
  },
  switch: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '14px',
  },
  switchLink: {
    color: '#0066c0',
    textDecoration: 'none',
  },
};

export default RegisterPage;