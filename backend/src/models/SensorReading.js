const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
  hive: { type: mongoose.Schema.Types.ObjectId, ref: 'Hive', required: true },
  hiveCode: { type: String, required: true },
  sensorIdentifier: { type: String, required: true },
  type: {
    type: String,
    enum: ['TEMPERATURE', 'HUMIDITY', 'SCALE_WEIGHT', 'ACOUSTIC'],
    required: true
  },
  value: { type: Number, required: true },
  unit: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
