const mongoose = require('mongoose');

const hiveAlertSchema = new mongoose.Schema({
  hive: { type: mongoose.Schema.Types.ObjectId, ref: 'Hive', required: true },
  hiveCode: { type: String, required: true },
  beekeeper: { type: mongoose.Schema.Types.ObjectId, ref: 'Beekeeper' },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  alertType: { type: String, required: true },
  title: { type: String },
  metric: { type: String },
  message: { type: String, required: true },
  valueRecorded: { type: Number },
  expectedRange: { type: String },
  recommendedAction: { type: String },
  remedy: { type: String },
  status: {
    type: String,
    enum: ['UNREAD', 'READ', 'RESOLVED'],
    default: 'UNREAD'
  },
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('HiveAlert', hiveAlertSchema);
