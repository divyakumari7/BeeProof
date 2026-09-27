const mongoose = require('mongoose');

const harvestEventSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'HoneyBatch', required: true },
  batchNumber: { type: String, required: true },
  beekeeper: { type: mongoose.Schema.Types.ObjectId, ref: 'Beekeeper' },
  beekeeperName: { type: String, required: true },
  quantityKg: { type: Number, required: true },
  harvestTimestamp: { type: Date, default: Date.now },
  location: { type: String, required: true },
  floralSource: { type: String, required: true },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HarvestEvent', harvestEventSchema);
