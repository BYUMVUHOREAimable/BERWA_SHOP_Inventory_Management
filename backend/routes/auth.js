const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Shopkeeper = require('../models/Shopkeeper');

// Register a new shopkeeper
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if shopkeeper exists
    let shopkeeper = await Shopkeeper.findOne({ username });
    if (shopkeeper) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new shopkeeper
    shopkeeper = new Shopkeeper({
      username,
      password
    });

    await shopkeeper.save();

    res.status(201).json({ message: 'Shopkeeper registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login shopkeeper
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if shopkeeper exists
    const shopkeeper = await Shopkeeper.findOne({ username });
    if (!shopkeeper) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await shopkeeper.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: shopkeeper._id },
      process.env.JWT_SECRET || 'berwa_shop_secret',
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        id: shopkeeper._id,
        username: shopkeeper.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
