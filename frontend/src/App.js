import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import SearchPage from './pages/SearchPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MyOrdersPage from './pages/MyOrdersPage';

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/product/:id' element={<ProductDetailPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path='/order/:id' element={<OrderConfirmationPage />} />
          <Route path='/myorders' element={<MyOrdersPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;