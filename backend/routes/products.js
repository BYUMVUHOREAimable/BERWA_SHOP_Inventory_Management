
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authenticateToken = require('../middleware/auth');

// Get all products
router.get('/', authenticateToken, async (req, res) => {
  try {
    const products = await Product.find().sort({ productName: 1 });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific product
router.get('/:productCode', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findOne({ productCode: req.params.productCode });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new product
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productCode, productName } = req.body;
    
    // Check if product exists
    const existingProduct = await Product.findOne({ productCode });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product code already exists' });
    }
    
    // Create new product
    const newProduct = new Product({
      productCode,
      productName
    });
    
    await newProduct.save();
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a product
router.put('/:productCode', authenticateToken, async (req, res) => {
  try {
    const { productName } = req.body;
    
    // Find and update product
    const product = await Product.findOneAndUpdate(
      { productCode: req.params.productCode },
      { productName },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a product
router.delete('/:productCode', authenticateToken, async (req, res) => {
  try {
    // Find and delete product
    const product = await Product.findOneAndDelete({ productCode: req.params.productCode });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
