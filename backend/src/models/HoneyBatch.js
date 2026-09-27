const mongoose = require('mongoose');

const honeyBatchSchema = new mongoose.Schema({
  batchNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  cluster: { type: mongoose.Schema.Types.ObjectId, ref: 'Cluster' },
  clusterCode: { type: String, required: true },
  clusterName: { type: String, required: true },
  beekeeper: { type: mongoose.Schema.Types.ObjectId, ref: 'Beekeeper' },
  beekeeperName: { type: String, required: true },
  hive: { type: mongoose.Schema.Types.ObjectId, ref: 'Hive' },
  hiveCode: { type: String },
  floralSource: { type: String, required: true },
  totalQuantityKg: { type: Number, required: true },
  harvestDate: { type: String, required: true },
  moisturePercentage: { type: Number, default: 17.5 },
  status: {
    type: String,
    enum: [
      'HARVESTED',
      'COLLECTED',
      'PROCESSING',
      'QUALITY_VERIFIED',
      'PACKAGED',
      'DISPATCHED',
      'DELIVERED',
      'ON_HOLD',
      'REJECTED'
    ],
    default: 'HARVESTED'
  },
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: String },
    notes: { type: String }
  }],
  onChainHash: { type: String },
  blockchainTxHash: { type: String },
  blockNumber: { type: Number },
  isTampered: { type: Boolean, default: false },
  originalDataBackup: { type: mongoose.Schema.Types.Mixed },
  qrCodeUrl: { type: String },
  notes: { type: String, default: 'Harvested from certified KVIC apiary comb' }
}, { timestamps: true });

module.exports = mongoose.model('HoneyBatch', honeyBatchSchema);
