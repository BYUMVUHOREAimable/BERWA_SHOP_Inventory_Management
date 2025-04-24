
const mongoose = require('mongoose');

const productInSchema = new mongoose.Schema({
  productCode: {
    type: String,
    required: true,
    ref: 'Product'
  },
  date: {
    type: Date,
    default: Date.now
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  uniquePrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('ProductIn', productInSchema);
