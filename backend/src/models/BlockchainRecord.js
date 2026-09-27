const mongoose = require('mongoose');

const blockchainRecordSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'HoneyBatch' },
  batchNumber: { type: String, required: true },
  eventType: { type: String, required: true },
  transactionHash: { type: String, required: true },
  blockNumber: { type: Number, required: true },
  stateMerkleRoot: { type: String, required: true },
  network: { type: String, default: 'Hardhat EVM Local (31337)' },
  gasUsed: { type: Number },
  status: { type: String, default: 'CONFIRMED' },
  actor: { type: String },
  details: { type: String },
  confirmedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('BlockchainRecord', blockchainRecordSchema);
