
const express = require('express');
const router = express.Router();
const ProductOut = require('../models/ProductOut');
const Product = require('../models/Product');
const authenticateToken = require('../middleware/auth');

// Get all product-out records
router.get('/', authenticateToken, async (req, res) => {
  try {
    const productOutRecords = await ProductOut.find().sort({ date: -1 });
    
    // Fetch product names
    const productsWithNames = await Promise.all(productOutRecords.map(async (record) => {
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
    console.error('Get product-out records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new product-out record
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productCode, date, quantity, uniquePrice, totalPrice } = req.body;
    
    // Validate product exists
    const product = await Product.findOne({ productCode });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Create new product-out record
    const newProductOut = new ProductOut({
      productCode,
      date,
      quantity,
      uniquePrice,
      totalPrice
    });
    
    await newProductOut.save();
    
    res.status(201).json(newProductOut);
  } catch (error) {
    console.error('Create product-out record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
