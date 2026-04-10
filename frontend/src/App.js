import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import SearchPage from './pages/SearchPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminProductFormPage from './pages/AdminProductFormPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminUsersPage from './pages/AdminUsersPage';
import WishlistPage from './pages/WishlistPage';

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
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
          <Route path='/admin' element={<AdminDashboardPage />} />
          <Route path='/admin/products' element={<AdminProductsPage />} />
          <Route path='/admin/products/new' element={<AdminProductFormPage />} />
          <Route path='/admin/products/edit/:id' element={<AdminProductFormPage />} />
          <Route path='/admin/orders' element={<AdminOrdersPage />} />
          <Route path='/admin/users' element={<AdminUsersPage />} />
          <Route path='/wishlist' element={<WishlistPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;