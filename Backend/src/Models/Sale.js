const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
    },
    qty:       { 
        type: Number, 
        min: 1 
    },
    unitPrice: { 
        type: Number, 
        min: 0 
    }
  }],
  total: { 
    type: Number, 
    required: true, 
    min: 0 
},
  date:  { 
    type: Date, 
    default: Date.now 
}
});

module.exports = mongoose.model('Sale', saleSchema);