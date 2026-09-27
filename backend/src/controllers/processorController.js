const HoneyBatch = require('../models/HoneyBatch');
const ProcessingEvent = require('../models/ProcessingEvent');
const PackageEntity = require('../models/PackageEntity');
const stateMachineService = require('../services/stateMachineService');
const blockchainService = require('../services/blockchainService');

class ProcessorController {
  async getOverview(req, res, next) {
    try {
      const batches = await HoneyBatch.find().sort({ createdAt: -1 });

      const inboundBatchesCount = batches.filter(b => b.status === 'HARVESTED').length;
      const batchesInProcessing = batches.filter(b => b.status === 'COLLECTED').length;
      const readyForPackagingCount = batches.filter(b => b.status === 'QUALITY_VERIFIED').length;

      return res.json({
        success: true,
        data: {
          facilityName: 'Northern Apex Honey Processing Facility',
          facilityRegistration: 'FSSAI-PROC-2026-981',
          inboundBatchesCount,
          batchesInProcessing,
          readyForPackagingCount,
          filtrationUnitsActive: 4,
          batches
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async getBatches(req, res, next) {
    try {
      const batches = await HoneyBatch.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: batches });
    } catch (err) {
      next(err);
    }
  }

  async collectBatch(req, res, next) {
    try {
      const { batchNumber } = req.params;
      const cleanNumber = batchNumber.trim().toUpperCase();
      const batch = await HoneyBatch.findOne({ batchNumber: cleanNumber });

      if (!batch) {
        return res.status(404).json({ success: false, message: 'Batch not found' });
      }

      // Validate transition: HARVESTED -> COLLECTED
      stateMachineService.validateTransition(batch.status, 'COLLECTED', req.user.role);

      batch.status = 'COLLECTED';
      batch.statusHistory.push({
        status: 'COLLECTED',
        timestamp: new Date(),
        updatedBy: req.user.fullName,
        notes: req.body.notes || 'Batch physically received from apiary cooperative at processing facility'
      });
      await batch.save();

      // Record on blockchain
      try {
        await blockchainService.recordStageEventOnChain(
          cleanNumber,
          'COLLECTED',
          req.user.fullName,
          'Northern Apex Processing Facility, Kolkata',
          'Intake inspection complete, transferred to holding tank',
          1
        );
      } catch (bcErr) {
        console.warn('Blockchain record stage warning:', bcErr.message);
      }

      return res.json({
        success: true,
        message: `Batch ${cleanNumber} successfully collected and logged in intake queue`,
        data: batch
      });
    } catch (err) {
      next(err);
    }
  }

  async processBatch(req, res, next) {
    try {
      const { batchNumber } = req.params;
      const { filtrationTemperatureCelsius, filtrationMeshSizeMicrons, notes } = req.body;

      const cleanNumber = batchNumber.trim().toUpperCase();
      const batch = await HoneyBatch.findOne({ batchNumber: cleanNumber });

      if (!batch) {
        return res.status(404).json({ success: false, message: 'Batch not found' });
      }

      // Validate transition: COLLECTED -> PROCESSING
      stateMachineService.validateTransition(batch.status, 'PROCESSING', req.user.role);

      const temp = Number(filtrationTemperatureCelsius) || 38.5;
      if (temp > 45.0) {
        return res.status(400).json({
          success: false,
          message: 'Processing temperature exceeds raw cold-filtration ceiling (45°C). Diastase and invertase enzyme vitality would be destroyed.'
        });
      }

      const processingEvent = await ProcessingEvent.create({
        batch: batch._id,
        batchNumber: cleanNumber,
        processor: req.user._id,
        processorName: req.user.fullName,
        facilityName: 'Northern Apex Honey Processing Facility',
        facilityRegistration: 'FSSAI-PROC-2026-981',
        filtrationTemperatureCelsius: temp,
        filtrationMeshSizeMicrons: Number(filtrationMeshSizeMicrons) || 200,
        processingDurationMinutes: 45,
        moistureContentAfterProcessing: 17.6,
        notes: notes || 'Cold micro-filtration executed preserving pollen diversity and invertase activity'
      });

      batch.status = 'PROCESSING';
      batch.statusHistory.push({
        status: 'PROCESSING',
        timestamp: new Date(),
        updatedBy: req.user.fullName,
        notes: `Cold filtered at ${temp}°C. Ready for laboratory quality verification.`
      });
      await batch.save();

      // Record on blockchain
      try {
        const bcResult = await blockchainService.recordStageEventOnChain(
          cleanNumber,
          'PROCESSING',
          req.user.fullName,
          'Northern Apex Processing Hub',
          `Filtered at ${temp}°C preserving native enzymes and pollen spectrum`,
          2
        );
        if (bcResult) {
          processingEvent.blockchainTxHash = bcResult.txHash;
          await processingEvent.save();
        }
      } catch (bcErr) {
        console.warn('Blockchain stage warning:', bcErr.message);
      }

      return res.json({
        success: true,
        message: `Processing completed for batch ${cleanNumber}. Status updated to PROCESSING (Ready for Lab Testing)`,
        data: {
          ...processingEvent.toObject(),
          batchStatus: batch.status,
          status: batch.status
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async packageBatch(req, res, next) {
    try {
      const { batchNumber } = req.params;
      const { unitSizeGrams = 500, lotNumber } = req.body;

      const cleanNumber = batchNumber.trim().toUpperCase();
      const batch = await HoneyBatch.findOne({ batchNumber: cleanNumber });

      if (!batch) {
        return res.status(404).json({ success: false, message: 'Batch not found' });
      }

      // CRITICAL GUARD: Only QUALITY_VERIFIED batches can be packaged!
      stateMachineService.validateTransition(batch.status, 'PACKAGED', req.user.role);

      const generatedLot = lotNumber || `LOT-${cleanNumber.replace(/[^A-Z0-9]/g, '')}`;
      const jarCount = Math.floor((batch.totalQuantityKg * 1000) / unitSizeGrams);

      const qrService = require('../services/qrService');
      const verificationUrl = qrService.getVerificationUrl(cleanNumber, req);

      let packageRecord = await PackageEntity.findOne({ batch: batch._id });
      if (packageRecord) {
        packageRecord.unitSizeGrams = Number(unitSizeGrams);
        packageRecord.lotNumber = generatedLot;
        packageRecord.packagedBy = req.user.fullName;
        packageRecord.qrCodeUrl = verificationUrl;
        await packageRecord.save();
      } else {
        const pkgCount = await PackageEntity.countDocuments({ batchNumber: cleanNumber });
        packageRecord = await PackageEntity.create({
          batch: batch._id,
          batchNumber: cleanNumber,
          packageCode: `PKG-${cleanNumber}-${String(pkgCount + 1).padStart(3, '0')}`,
          unitSizeGrams: Number(unitSizeGrams),
          lotNumber: generatedLot,
          packagedBy: req.user.fullName,
          qrCodeUrl: verificationUrl
        });
      }

      batch.status = 'PACKAGED';
      batch.qrCodeUrl = verificationUrl;
      batch.statusHistory.push({
        status: 'PACKAGED',
        timestamp: new Date(),
        updatedBy: req.user.fullName,
        notes: `Packaged into ${jarCount} serialized ${unitSizeGrams}g units (Lot: ${generatedLot})`
      });
      await batch.save();

      // Record on blockchain
      try {
        await blockchainService.recordStageEventOnChain(
          cleanNumber,
          'PACKAGED',
          req.user.fullName,
          'Northern Apex Packaging Facility',
          `Hermetically packaged into ${jarCount} serialized units (Lot ${generatedLot})`,
          6
        );
      } catch (bcErr) {
        console.warn('Blockchain packaging event warning:', bcErr.message);
      }

      return res.json({
        success: true,
        message: `Batch ${cleanNumber} successfully packaged into ${jarCount} serialized jars`,
        data: {
          ...packageRecord.toObject(),
          batchStatus: batch.status,
          status: batch.status
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProcessorController();
