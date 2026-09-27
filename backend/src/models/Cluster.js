const mongoose = require('mongoose');

const clusterSchema = new mongoose.Schema({
  clusterCode: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  region: { type: String, default: 'Eastern' },
  predominantFlora: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  totalHives: { type: Number, default: 5 },
  annualProductionKg: { type: Number, default: 1250 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Cluster', clusterSchema);
