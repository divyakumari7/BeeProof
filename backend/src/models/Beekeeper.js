const mongoose = require('mongoose');

const beekeeperSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  cluster: { type: mongoose.Schema.Types.ObjectId, ref: 'Cluster', required: true },
  kvicRegistrationNumber: { type: String, required: true, unique: true },
  cooperativeName: { type: String, required: true },
  experienceYears: { type: Number, default: 8 },
  state: { type: String, required: true },
  district: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Beekeeper', beekeeperSchema);
