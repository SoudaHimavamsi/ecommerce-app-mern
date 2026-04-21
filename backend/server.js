const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// ── Environment variable validation ─────────────────────────────────────────
const REQUIRED_ENV_VARS = ['MONGO_URI', 'JWT_SECRET'];
const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}
// ────────────────────────────────────────────────────────────────────────────

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.get('/', (req, res) => {
  res.send('Amazon Clone API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// NOTE: /myorders is defined before /:id inside orderRoutes.js — keep it that way
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// ── TEMPORARY ROUTES - REMOVE AFTER USE ─────────────────────────────────────
app.get('/api/setup', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const products = require('./data/products');
    await Product.deleteMany();
    await Product.insertMany(products);
    res.json({ message: '✅ Products seeded!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/makeadmin/:email', async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isAdmin = true;
    await user.save();
    res.json({ message: `✅ ${user.email} is now admin!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ── END TEMPORARY ROUTES ─────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

// Start server immediately so Render detects the open port
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Connect to MongoDB separately (server is already listening so Render won't time out)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });