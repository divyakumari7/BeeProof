const mongoose = require('mongoose');

const distributionEventSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'HoneyBatch', required: true },
  batchNumber: { type: String, required: true },
  distributor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  distributorName: { type: String, required: true },
  logisticsPartner: { type: String, default: 'EcoLogistics Distribution Network Ltd.' },
  licenseNumber: { type: String, default: 'DIST-KVIC-DL-2026' },
  trackingReference: { type: String, required: true, unique: true },
  originLocation: { type: String, required: true },
  destinationLocation: { type: String, required: true },
  vehicleNumber: { type: String, default: 'WB-04-TR-9182' },
  transitAmbientTempCelsius: { type: Number, default: 21.4 },
  quantityKg: { type: Number },
  dispatchDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date },
  status: {
    type: String,
    enum: ['DISPATCHED', 'IN_TRANSIT', 'DELIVERED'],
    default: 'DISPATCHED'
  },
  deliverySignoff: { type: String },
  notes: { type: String, default: 'Cold-chain telemetry compliant, unpasteurized honey safety guaranteed' },
  blockchainTxHash: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('DistributionEvent', distributionEventSchema);
