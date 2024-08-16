const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
  name: { type: String, unique: true, required: true },
  detail: { type: String, required: true },
  speed: { type: String, required: true },
  weight: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// สร้างโมเดลจาก Schema
const Car = mongoose.model('Car', carSchema);

module.exports = Car;
