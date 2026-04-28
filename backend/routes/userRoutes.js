const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ── Auth middleware ───────────────────────────────────────────
const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ════════════════════════════════════════════════════════
// CART
// ════════════════════════════════════════════════════════

// GET /api/users/cart
router.get('/cart', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    const cartItems = user.cart
      .filter((i) => i.product)
      .map((i) => ({
        _id: i.product._id,
        name: i.product.name,
        image: i.product.image,
        price: i.product.price,
        brand: i.product.brand,
        countInStock: i.product.countInStock,
        qty: i.qty,
      }));
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/cart — add or update single item
router.post('/cart', protect, async (req, res) => {
  const { productId, qty = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: 'productId required' });
  try {
    const user = await User.findById(req.user._id);
    const idx = user.cart.findIndex((i) => i.product.toString() === productId);
    if (idx >= 0) {
      user.cart[idx].qty = qty;
    } else {
      user.cart.push({ product: productId, qty });
    }
    await user.save();
    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/cart/batch — merge on login
router.post('/cart/batch', protect, async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ message: 'items array required' });
  try {
    const user = await User.findById(req.user._id);
    for (const { productId, qty } of items) {
      const idx = user.cart.findIndex((i) => i.product.toString() === productId);
      if (idx >= 0) {
        user.cart[idx].qty = Math.max(user.cart[idx].qty, qty);
      } else {
        user.cart.push({ product: productId, qty });
      }
    }
    await user.save();
    res.json({ message: 'Cart merged' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/cart/:productId
router.delete('/cart/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((i) => i.product.toString() !== req.params.productId);
    await user.save();
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/cart — clear entire cart
router.delete('/cart', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ════════════════════════════════════════════════════════
// WISHLIST
// ════════════════════════════════════════════════════════

// GET /api/users/wishlist
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist.product');
    const items = user.wishlist
      .filter((i) => i.product)
      .map((i) => ({
        _id: i.product._id,
        name: i.product.name,
        image: i.product.image,
        price: i.product.price,
        brand: i.product.brand,
        rating: i.product.rating,
        numReviews: i.product.numReviews,
        countInStock: i.product.countInStock,
      }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/wishlist — idempotent add
router.post('/wishlist', protect, async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: 'productId required' });
  try {
    const user = await User.findById(req.user._id);
    const exists = user.wishlist.some((i) => i.product.toString() === productId);
    if (!exists) {
      user.wishlist.push({ product: productId });
      await user.save();
    }
    res.json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/wishlist/:productId
router.delete('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(
      (i) => i.product.toString() !== req.params.productId
    );
    await user.save();
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ════════════════════════════════════════════════════════
// PASSWORD CHANGE
// ════════════════════════════════════════════════════════

// PUT /api/users/changepassword
router.put('/changepassword', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both passwords required' });
  }
  try {
    // Must re-fetch with password field (protect strips it)
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    user.password = newPassword; // pre-save hook hashes it
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
