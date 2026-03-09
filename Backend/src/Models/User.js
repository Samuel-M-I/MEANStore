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
    default: true 
}
}, { timestamps: true });

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    // 'this.password' se refiere a la contraseña encriptada del documento actual
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);