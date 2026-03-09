const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { 
    type: String,
    unique: true,
    required: true, 
    trim: true , 
    minlength: 3, 
    maxlength: 100
},
  description: { 
    type: String, 
    default: '' 
},
  price:       { 
    type: Number, 
    required: true, 
    min: 0 
},
  stock:       { 
    type:  mongoose.Schema.Types.Int32, 
    required: true, 
    min: 0, 
    default: 0 
},
  category:    { 
    type: String,
    enum: ["Celulares", "Laptops", "Accesorios", "Audífonos", "Tablets", "Cámaras", "Gaming"],
    default: 'Accesorios' 
},
  imageUrl:    { 
    type: String, 
    default: '' //Imagen pordefecto en a futuro
},
  isActive:    { 
    type: Boolean, 
    default: true 
},
  createdBy:   { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
}
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);