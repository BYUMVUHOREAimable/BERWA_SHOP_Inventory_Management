const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const productInRoutes = require('./routes/productIn');
const productOutRoutes = require('./routes/productOut');
const reportRoutes = require('./routes/reports');

const app = express();

app.use(cors());
app.use(express.json());

//Connect using environment variable
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/product-in', productInRoutes);
app.use('/api/product-out', productOutRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to BERWA SHOP API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
