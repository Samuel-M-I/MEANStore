const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username:     { 
    type: String, 
    required: true, trim: true 
  },
  email:        { 
    type: String, 
    required: true, unique: true, lowercase: true 
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  role:         { 
    type: String, 
    enum: ['admin', 'worker', 'customer'], 
    default: 'customer' 
  },
  active:       { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

// Hash automático antes de guardar
//userSchema.pre('save', async function(next) {
//  if (!this.isModified('passwordHash')) return next();
//  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
//  next();
//});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;//garatiza que solo se encripte si ya hay una encriptación previa
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseña en login
//userSchema.methods.comparePassword = function(passwordPlana) {
//  return bcrypt.compare(passwordPlana, this.passwordHash);
//};

userSchema.methods.matchPassword = async function(enteredPassword) {
    // 'this.password' se refiere a la contraseña encriptada del documento actual
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);