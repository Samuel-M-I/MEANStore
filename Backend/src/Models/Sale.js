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
// ✅ Método para calcular total
saleSchema.methods.calcularTotal = function() {
  return this.items.reduce((total, item) => {
    return total + (item.qty * item.unitPrice);
  }, 0);
};

saleSchema.pre('save', function(next) {
  this.total = this.calcularTotal();
  next();
});
module.exports = mongoose.model('Sale', saleSchema);