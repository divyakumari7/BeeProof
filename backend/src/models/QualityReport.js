const mongoose = require('mongoose');

const qualityReportSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'HoneyBatch', required: true },
  batchNumber: { type: String, required: true },
  chemist: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  chemistName: { type: String, required: true },
  labName: { type: String, default: 'National Agro-Food Quality & NMR Research Laboratory' },
  accreditationNumber: { type: String, default: 'NABL-TC-8891-2026' },
  certificateNumber: { type: String, required: true, unique: true },
  moisturePercentage: { type: Number, required: true },
  pollenPurityScore: { type: Number, required: true },
  nmrSpectroscopyPassed: { type: Boolean, required: true },
  c4SugarAdulterationDetected: { type: Boolean, required: true },
  overallVerdict: {
    type: String,
    enum: ['PASS', 'FAIL'],
    required: true
  },
  qualityGrade: { type: String, default: 'A+ Export Grade' },
  notes: { type: String },
  certifiedAt: { type: Date, default: Date.now },
  blockchainTxHash: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('QualityReport', qualityReportSchema);
