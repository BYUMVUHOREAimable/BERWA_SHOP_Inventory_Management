
const express = require('express');
const router = express.Router();
const ProductIn = require('../models/ProductIn');
const Product = require('../models/Product');
const authenticateToken = require('../middleware/auth');

// Get all product-in records
router.get('/', authenticateToken, async (req, res) => {
  try {
    const productInRecords = await ProductIn.find().sort({ date: -1 });
    
    // Fetch product names
    const productsWithNames = await Promise.all(productInRecords.map(async (record) => {
      const product = await Product.findOne({ productCode: record.productCode });
      return {
        _id: record._id,
        productCode: record.productCode,
        productName: product ? product.productName : 'Unknown Product',
        date: record.date,
        quantity: record.quantity,
        uniquePrice: record.uniquePrice,
        totalPrice: record.totalPrice
      };
    }));
    
    res.json(productsWithNames);
  } catch (error) {
    console.error('Get product-in records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new product-in record
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productCode, date, quantity, uniquePrice, totalPrice } = req.body;
    
    // Validate product exists
    const product = await Product.findOne({ productCode });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Create new product-in record
    const newProductIn = new ProductIn({
      productCode,
      date,
      quantity,
      uniquePrice,
      totalPrice
    });
    
    await newProductIn.save();
    
    res.status(201).json(newProductIn);
  } catch (error) {
    console.error('Create product-in record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
