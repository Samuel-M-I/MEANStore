const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true   // un carrito por usuario
  },
  items: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    },
    qty:       { 
      type: Number, 
      min: 1, 
      default: 1 
    },
    price:     { 
      type: Number, 
      min: 0 
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);