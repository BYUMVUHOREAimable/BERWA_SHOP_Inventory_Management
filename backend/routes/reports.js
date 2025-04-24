
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const ProductIn = require('../models/ProductIn');
const ProductOut = require('../models/ProductOut');
const authenticateToken = require('../middleware/auth');

// Helper function to get date filter based on report type
const getDateFilter = (reportType) => {
  const now = new Date();
  let dateFilter = {};
  
  switch (reportType) {
    case 'daily':
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      dateFilter = { date: { $gte: startOfDay, $lt: endOfDay } };
      break;
    case 'weekly':
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);
      dateFilter = { date: { $gte: startOfWeek, $lt: endOfWeek } };
      break;
    case 'monthly':
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      dateFilter = { date: { $gte: startOfMonth, $lte: endOfMonth } };
      break;
    default:
      // all time - no date filter
      dateFilter = {};
  }
  
  return dateFilter;
};

// Helper function to add product names to stock items
const addProductNames = async (items) => {
  return Promise.all(items.map(async (item) => {
    const product = await Product.findOne({ productCode: item.productCode });
    return {
      ...item.toObject(),
      productName: product ? product.productName : 'Unknown Product'
    };
  }));
};

// Dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Count products
    const productCount = await Product.countDocuments();
    
    // Get stock in total
    const stockInTotal = await ProductIn.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    
    // Get stock out total
    const stockOutTotal = await ProductOut.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    
    // Calculate current stock value
    const currentStock = (stockInTotal[0]?.total || 0) - (stockOutTotal[0]?.total || 0);
    
    // Get recent stock in
    const recentStockIn = await ProductIn.find()
      .sort({ date: -1 })
      .limit(5);
    
    // Get recent stock out
    const recentStockOut = await ProductOut.find()
      .sort({ date: -1 })
      .limit(5);
    
    // Add product names
    const recentStockInWithNames = await addProductNames(recentStockIn);
    const recentStockOutWithNames = await addProductNames(recentStockOut);
    
    res.json({
      productCount,
      stockInTotal: stockInTotal[0]?.total || 0,
      stockOutTotal: stockOutTotal[0]?.total || 0,
      currentStock,
      recentStockIn: recentStockInWithNames,
      recentStockOut: recentStockOutWithNames
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get report data (daily, weekly, monthly, all)
router.get('/:reportType', authenticateToken, async (req, res) => {
  try {
    const { reportType } = req.params;
    const dateFilter = getDateFilter(reportType);
    
    // Count products
    const productCount = await Product.countDocuments();
    
    // Get stock in data
    const stockInItems = await ProductIn.find(dateFilter)
      .sort({ date: -1 });
    
    // Get stock out data
    const stockOutItems = await ProductOut.find(dateFilter)
      .sort({ date: -1 });
    
    // Calculate totals
    const stockInTotal = stockInItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const stockOutTotal = stockOutItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // Calculate current stock value
    const allStockInTotal = await ProductIn.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const allStockOutTotal = await ProductOut.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const currentStock = (allStockInTotal[0]?.total || 0) - (allStockOutTotal[0]?.total || 0);
    
    // Add product names
    const stockInItemsWithNames = await addProductNames(stockInItems);
    const stockOutItemsWithNames = await addProductNames(stockOutItems);
    
    res.json({
      reportType,
      stockInTotal,
      stockOutTotal,
      currentStock,
      productCount,
      stockInItems: stockInItemsWithNames,
      stockOutItems: stockOutItemsWithNames
    });
  } catch (error) {
    console.error('Report data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
