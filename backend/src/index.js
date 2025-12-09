require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dada')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'normal'], required: true },
});

const User = mongoose.model('User', userSchema);

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: 'Access denied' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret')
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' })
  next()
}

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  reviews: [{ user: String, review: String }],
  rating: { type: Number, min: 0, max: 5, default: 0 },
  price: { type: Number, required: true, min: 0 },
});

const Product = mongoose.model('Product', productSchema);

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate input
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['admin', 'normal'].includes(role)) {
      return res.status(400).json({ message: 'Role must be admin or normal' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.json({ accessToken: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Product CRUD endpoints

// Create product
app.post('/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, imageUrl, stock, reviews, price, rating } = req.body;
    const product = new Product({ name, description, imageUrl, stock, reviews: reviews || [], price, rating });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by id
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
app.put('/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, imageUrl, stock, reviews, price, rating } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, imageUrl, stock, reviews, price, rating },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
app.delete('/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review to product
app.post('/products/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const { review } = req.body;
    if (!review) return res.status(400).json({ message: 'Review is required' });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.reviews.push({ user: req.user.username, review });
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
