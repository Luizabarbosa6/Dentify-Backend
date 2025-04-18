const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cpf: { type: String, required: true, unique: true, match: /^\d{11}$/ },
  email: { type: String, required: true, unique: true, lowercase: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'perito', 'assistente'], 
    default: 'assistente' 
  }
});

// Criptografa a senha antes de salvar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

