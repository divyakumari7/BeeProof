const HoneyBatch = require('../models/HoneyBatch');
const DistributionEvent = require('../models/DistributionEvent');
const stateMachineService = require('../services/stateMachineService');
const blockchainService = require('../services/blockchainService');

class DistributorController {
  async getOverview(req, res, next) {
    try {
      const events = await DistributionEvent.find().sort({ createdAt: -1 });
      const batches = await HoneyBatch.find({ status: 'PACKAGED' }).sort({ updatedAt: -1 }).lean();
      const PackageEntity = require('../models/PackageEntity');
      const batchIds = batches.map(b => b._id);
      const packages = await PackageEntity.find({ batch: { $in: batchIds } }).lean();
      const pkgMap = {};
      packages.forEach(p => { pkgMap[p.batchNumber] = p; });
      const enriched = batches.map(b => ({
        ...b,
        packageInfo: pkgMap[b.batchNumber] || null
      }));

      const activeConsignments = events.filter(e => ['DISPATCHED', 'IN_TRANSIT'].includes(e.status)).length;
      const deliveredConsignments = events.filter(e => e.status === 'DELIVERED').length;

      return res.json({
        success: true,
        data: {
          distributorName: 'EcoLogistics Distribution Network Ltd.',
          licenseNumber: 'DIST-KVIC-DL-2026',
          activeConsignments,
          deliveredConsignments,
          packagedBatchesAvailable: enriched.length,
          coldChainCompliantRate: '99.8%',
          events,
          packagedBatches: enriched
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async getPackagedBatches(req, res, next) {
    try {
      const batches = await HoneyBatch.find({ status: 'PACKAGED' }).sort({ updatedAt: -1 }).lean();
      const PackageEntity = require('../models/PackageEntity');
      const batchIds = batches.map(b => b._id);
      const packages = await PackageEntity.find({ batch: { $in: batchIds } }).lean();
      const pkgMap = {};
      packages.forEach(p => { pkgMap[p.batchNumber] = p; });
      const enriched = batches.map(b => ({
        ...b,
        packageInfo: pkgMap[b.batchNumber] || null
      }));
      return res.json({ success: true, data: enriched });
    } catch (err) {
      next(err);
    }
  }

  async dispatchBatch(req, res, next) {
    try {
      const { batchNumber } = req.params;
      const {
        trackingReference,
        originLocation,
        destinationLocation,
        vehicleNumber,
        transitAmbientTempCelsius,
        quantityKg,
        notes
      } = req.body;

      const cleanNumber = batchNumber.trim().toUpperCase();
      const batch = await HoneyBatch.findOne({ batchNumber: cleanNumber });

      if (!batch) {
        return res.status(404).json({ success: false, message: 'Batch not found' });
      }

      // Validate transition: PACKAGED -> DISPATCHED
      stateMachineService.validateTransition(batch.status, 'DISPATCHED', req.user.role);

      const tracking = trackingReference || `TRK-ECO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const consignmentQuantity = (quantityKg !== undefined && quantityKg !== null && quantityKg !== '')
        ? Number(quantityKg)
        : batch.totalQuantityKg;

      const event = await DistributionEvent.create({
        batch: batch._id,
        batchNumber: cleanNumber,
        distributor: req.user._id,
        distributorName: req.user.fullName,
        logisticsPartner: 'EcoLogistics Distribution Network Ltd.',
        licenseNumber: 'DIST-KVIC-DL-2026',
        trackingReference: tracking,
        originLocation: originLocation || 'Northern Apex Processing Hub, Kolkata',
        destinationLocation: destinationLocation || 'National Cold-Chain Depot, Delhi',
        vehicleNumber: vehicleNumber || 'WB-04-TR-9182',
        transitAmbientTempCelsius: Number(transitAmbientTempCelsius) || 21.4,
        quantityKg: consignmentQuantity,
        dispatchDate: new Date(),
        status: 'DISPATCHED',
        notes: notes || 'Dispatched under active temperature logging'
      });

      batch.status = 'DISPATCHED';
      batch.statusHistory.push({
        status: 'DISPATCHED',
        timestamp: new Date(),
        updatedBy: req.user.fullName,
        notes: `Dispatched to ${event.destinationLocation} (Tracking #${tracking})`
      });
      await batch.save();

      // Record on blockchain
      try {
        const bcResult = await blockchainService.recordStageEventOnChain(
          cleanNumber,
          'DISPATCHED',
          req.user.fullName,
          event.originLocation,
          `Consignment #${tracking} dispatched to ${event.destinationLocation}`,
          7
        );
        if (bcResult) {
          event.blockchainTxHash = bcResult.txHash;
          await event.save();
        }
      } catch (bcErr) {
        console.warn('Blockchain dispatch warning:', bcErr.message);
      }

      return res.json({
        success: true,
        message: `Consignment dispatched with tracking reference ${tracking}`,
        data: {
          ...event.toObject(),
          batchStatus: batch.status,
          status: batch.status
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async deliverBatch(req, res, next) {
    try {
      const { batchNumber } = req.params;
      const { deliverySignoff, notes } = req.body;

      const cleanNumber = batchNumber.trim().toUpperCase();
      const batch = await HoneyBatch.findOne({ batchNumber: cleanNumber });

      if (!batch) {
        return res.status(404).json({ success: false, message: 'Batch not found' });
      }

      // Validate transition: DISPATCHED -> DELIVERED
      stateMachineService.validateTransition(batch.status, 'DELIVERED', req.user.role);

      const event = await DistributionEvent.findOne({
        batch: batch._id,
        status: { $in: ['DISPATCHED', 'IN_TRANSIT'] }
      }).sort({ createdAt: -1 });
      if (!event) {
        return res.status(400).json({ success: false, message: 'No active dispatched consignment found for this batch' });
      }

      event.status = 'DELIVERED';
      event.deliveryDate = new Date();
      event.deliverySignoff = deliverySignoff || 'Depot Manager Electronic Handover';
      if (notes) event.notes += ` | Delivery: ${notes}`;
      await event.save();

      batch.status = 'DELIVERED';
      batch.statusHistory.push({
        status: 'DELIVERED',
        timestamp: new Date(),
        updatedBy: req.user.fullName,
        notes: `Confirmed delivered at ${event.destinationLocation}`
      });
      await batch.save();

      // Record on blockchain
      try {
        await blockchainService.recordStageEventOnChain(
          cleanNumber,
          'DELIVERED',
          req.user.fullName,
          event.destinationLocation,
          `Delivery handover confirmed at ${event.destinationLocation}`,
          7
        );
      } catch (bcErr) {
        console.warn('Blockchain delivery warning:', bcErr.message);
      }

      return res.json({
        success: true,
        message: `Consignment delivery confirmed at ${event.destinationLocation}`,
        data: {
          ...event.toObject(),
          batchStatus: batch.status,
          status: batch.status
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DistributorController();
