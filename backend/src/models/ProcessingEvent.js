const mongoose = require('mongoose');

const processingEventSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'HoneyBatch', required: true },
  batchNumber: { type: String, required: true },
  processor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  processorName: { type: String, required: true },
  facilityName: { type: String, default: 'Northern Apex Honey Processing Facility' },
  facilityRegistration: { type: String, default: 'FSSAI-PROC-2026-981' },
  filtrationTemperatureCelsius: { type: Number, required: true },
  filtrationMeshSizeMicrons: { type: Number, default: 200 },
  processingDurationMinutes: { type: Number, default: 45 },
  moistureContentAfterProcessing: { type: Number, default: 17.6 },
  notes: { type: String },
  timestamp: { type: Date, default: Date.now },
  blockchainTxHash: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ProcessingEvent', processingEventSchema);
