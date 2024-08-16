// นำเข้า Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// สร้าง schema ของ Brand
const brandSchema = new Schema({
  name: { type: String, unique: true, required: true },
  image: { type: String, required: true },
  detail: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// ลงทะเบียนโมเดล Brand
const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
