const mongoose = require('mongoose');

const packageEntitySchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'HoneyBatch', required: true },
  batchNumber: { type: String, required: true },
  packageCode: { type: String, required: true, unique: true },
  unitSizeGrams: { type: Number, default: 500 },
  packagingDate: { type: Date, default: Date.now },
  lotNumber: { type: String, required: true },
  qrCodeUrl: { type: String },
  packagedBy: { type: String, default: 'Apex Automated Sterile Packaging Line #3' }
}, { timestamps: true });

module.exports = mongoose.model('PackageEntity', packageEntitySchema);
