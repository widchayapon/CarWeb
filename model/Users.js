const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String,  unique: true },
  password: { type: String, required: true },
  email: { type: String },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// สร้างโมเดลจาก Schema
const User = mongoose.model('User', userSchema);

module.exports = User;
