const mongoose = require('mongoose');

const hiveSchema = new mongoose.Schema({
  hiveCode: { type: String, required: true, unique: true, uppercase: true },
  cluster: { type: mongoose.Schema.Types.ObjectId, ref: 'Cluster', required: true },
  beekeeper: { type: mongoose.Schema.Types.ObjectId, ref: 'Beekeeper', required: true },
  beeSpecies: { type: String, default: 'Apis cerana indica' },
  installationDate: { type: String, default: '2024-03-15' },
  hiveType: { type: String, default: 'Langstroth 10-Frame Standard' },
  locationName: { type: String },
  sensorId: { type: String },
  hasSensor: { type: Boolean, default: false },
  latitude: { type: Number },
  longitude: { type: Number },
  status: {
    type: String,
    enum: ['ACTIVE', 'WARNING', 'CRITICAL'],
    default: 'ACTIVE'
  },
  notes: { type: String, default: 'Normal colony activity and healthy brood comb' }
}, { timestamps: true });

module.exports = mongoose.model('Hive', hiveSchema);
