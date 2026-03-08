const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username:     { 
    type: String, 
    minlength: 3,
    maxlength: 20,
    unique: true,
    required: true, 
    trim: true 
},
  email:        { 
    type: String, 
    unique: true, 
    lowercase: true 
},
  password: { 
    type: String, required: true 
},
  role:         { 
    type: String, 
    enum: ['admin', 'worker', 'client'], 
    default: 'client' 
},
  active:       { 
    type: Boolean, 
    default: false 
}
}, { timestamps: true });

// Hash automático antes de guardar
//userSchema.pre('save', async function(next) {
//  if (!this.isModified('passwordHash')) return next();
//  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
//  next();
//});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();//garatiza que solo se encripte si ya hay una encriptación previa
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
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