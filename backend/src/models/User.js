const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true },
  role: {
    type: String,
    enum: ['BEEKEEPER', 'PROCESSOR', 'QUALITY_LAB', 'DISTRIBUTOR', 'ADMIN_KVIC'],
    required: true
  },
  organization: { type: String, default: 'BeeProof National Honey Network' },
  phone: { type: String, default: '+91 98765 43210' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
