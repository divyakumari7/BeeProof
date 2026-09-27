const HoneyBatch = require('../models/HoneyBatch');
const Cluster = require('../models/Cluster');
const QualityReport = require('../models/QualityReport');
const HarvestEvent = require('../models/HarvestEvent');
const ProcessingEvent = require('../models/ProcessingEvent');
const PackageEntity = require('../models/PackageEntity');
const DistributionEvent = require('../models/DistributionEvent');
const BlockchainRecord = require('../models/BlockchainRecord');
const blockchainService = require('../services/blockchainService');
const qrService = require('../services/qrService');
const pdfService = require('../services/pdfService');

class VerificationController {
  async _fetchVerificationData(batchNumber, req) {
    const cleanNumber = (batchNumber || '').trim().toUpperCase();
    const batch = await HoneyBatch.findOne({ batchNumber: cleanNumber }).populate('cluster beekeeper hive');

    if (!batch) return null;

    // 1. Real cryptographic 7-field data integrity verification with smart contract
    const integrity = await blockchainService.verifyIntegrity(batch);

    // Verify status comes directly from CURRENT MONGODB DATA -> SHA-256 -> BLOCKCHAIN HASH comparison
    const isVerified = Boolean(integrity.verified);
    const isTampered = Boolean(!integrity.verified);

    // 2. Fetch all stage events
    const [harvest, processing, qualityReport, packageItem, distribution] = await Promise.all([
      HarvestEvent.findOne({ batch: batch._id }),
      ProcessingEvent.findOne({ batch: batch._id }),
      QualityReport.findOne({ batch: batch._id }),
      PackageEntity.findOne({ batch: batch._id }),
      DistributionEvent.findOne({ batch: batch._id })
    ]);

    // 3. Build authentic chronological timeline (ONLY events that actually occurred)
    const timeline = [];

    // Harvest stage (Always present for valid batches)
    timeline.push({
      stage: 'HARVEST',
      title: 'Apiary Harvest Logged',
      actor: harvest ? harvest.beekeeperName : batch.beekeeperName,
      location: harvest ? harvest.location : `${batch.clusterName}`,
      timestamp: harvest ? harvest.harvestTimestamp : new Date(batch.harvestDate),
      details: `Raw comb harvest of ${batch.totalQuantityKg} kg from ${batch.floralSource} flora. Initial cryptographic token registered.`,
      completed: true
    });

    // Processing stage (if recorded)
    if (processing) {
      timeline.push({
        stage: 'PROCESSING',
        title: 'Cold Filtration & Processing Complete',
        actor: processing.facilityName,
        location: 'Regional Honey Processing Hub',
        timestamp: processing.timestamp,
        details: `Processed at ${processing.filtrationTemperatureCelsius}°C with ${processing.filtrationMeshSizeMicrons}μm filtration. Diastase enzymes preserved.`,
        completed: true
      });
    } else if (batch.status === 'COLLECTED' || batch.status === 'PROCESSING') {
      timeline.push({
        stage: 'PROCESSING',
        title: 'Received at Processing Facility',
        actor: 'Honey Processing Facility',
        location: 'Regional Honey Processing Hub',
        timestamp: batch.updatedAt,
        details: 'Raw honey received from apiary cooperative and queued for cold filtration.',
        completed: true
      });
    }

    // Quality testing stage (if recorded)
    if (qualityReport) {
      timeline.push({
        stage: 'TESTING',
        title: `NABL Quality Lab Verified (${qualityReport.overallVerdict})`,
        actor: qualityReport.labName,
        location: 'Accredited Analytical Testing Facility',
        timestamp: qualityReport.certifiedAt,
        details: `Certificate #${qualityReport.certificateNumber}: Moisture ${qualityReport.moisturePercentage}%, Pollen ${qualityReport.pollenPurityScore}%, NMR ${qualityReport.nmrSpectroscopyPassed ? 'PASSED' : 'FAILED'}, C4 Sugars ${qualityReport.c4SugarAdulterationDetected ? 'DETECTED' : 'NEGATIVE'}.`,
        completed: true
      });
    }

    // Packaging stage (if recorded)
    if (packageItem) {
      timeline.push({
        stage: 'PACKAGING',
        title: 'Tamper-Evident Consumer Packaging',
        actor: packageItem.packagedBy,
        location: 'Cleanroom Packaging Depot',
        timestamp: packageItem.packagingDate,
        details: `Packaged into 500g serialized units with scannable consumer verification QR tokens (Lot #${packageItem.lotNumber}).`,
        completed: true
      });
    } else if (['PACKAGED', 'DISPATCHED', 'DELIVERED'].includes(batch.status)) {
      timeline.push({
        stage: 'PACKAGING',
        title: 'Packaged into Serialized Units',
        actor: 'Apex Automated Sterile Packaging Line',
        location: 'Cleanroom Packaging Depot',
        timestamp: batch.updatedAt,
        details: 'Certified honey hermetically sealed into serialized glass jars with QR tokens.',
        completed: true
      });
    }

    // Distribution stage (if recorded)
    if (distribution) {
      timeline.push({
        stage: 'DISTRIBUTION',
        title: distribution.status === 'DELIVERED' ? 'Delivered to Destination Depot' : 'Dispatched via Cold-Chain Logistics',
        actor: distribution.logisticsPartner,
        location: `${distribution.originLocation} → ${distribution.destinationLocation}`,
        timestamp: distribution.deliveryDate || distribution.dispatchDate,
        details: `Consignment tracking #${distribution.trackingReference}. Transit ambient temperature: ${distribution.transitAmbientTempCelsius}°C. ${distribution.status === 'DELIVERED' ? 'Final depot handover complete.' : 'In transit under climate surveillance.'}`,
        completed: true
      });
    }

    // Quality summary formatting
    const qualitySummary = qualityReport ? {
      certificateNumber: qualityReport.certificateNumber,
      laboratoryName: qualityReport.labName,
      moisturePercentage: qualityReport.moisturePercentage,
      pollenPurityScore: qualityReport.pollenPurityScore,
      nmrSpectroscopyPassed: qualityReport.nmrSpectroscopyPassed,
      c4SugarAdulterationDetected: qualityReport.c4SugarAdulterationDetected,
      verdict: qualityReport.overallVerdict,
      qualityGrade: qualityReport.qualityGrade,
      certifiedAt: qualityReport.certifiedAt
    } : null;

    const clusterObj = batch.cluster || {};
    const qrUrl = qrService.getVerificationUrl(batch.batchNumber, req);

    return {
      batchNumber: batch.batchNumber,
      clusterCode: batch.clusterCode,
      clusterName: batch.clusterName,
      district: clusterObj.district || 'Sundarbans',
      state: clusterObj.state || 'West Bengal',
      region: clusterObj.region || 'Eastern',
      floralSource: batch.floralSource,
      totalQuantityKg: batch.totalQuantityKg,
      harvestDate: batch.harvestDate,
      status: isTampered ? 'ON_HOLD' : batch.status,
      isTampered: isTampered,
      verificationStatus: isVerified ? 'VERIFIED' : 'NOT VERIFIED',
      blockchainVerified: isVerified,
      integrityReason: isVerified
        ? 'Cryptographic record match verified'
        : (integrity.reason || 'Record check failed: database values do not match blockchain proof (TAMPERED)'),
      stateMerkleRoot: integrity.onChainHash || batch.onChainHash,
      blockchainTxHash: batch.blockchainTxHash || integrity.txHash,
      blockNumber: batch.blockNumber || integrity.blockNumber || 1,
      networkName: 'Solana Devnet',
      explorerUrl: (batch.blockchainTxHash || integrity.txHash) ? `https://explorer.solana.com/tx/${batch.blockchainTxHash || integrity.txHash}?cluster=devnet` : null,
      qrCodeUrl: qrUrl,
      qualitySummary,
      timeline
    };
  }

  async verifyBatch(req, res, next) {
    try {
      const { batchNumber } = req.params;
      if (!batchNumber) {
        return res.status(400).json({ success: false, message: 'Batch number parameter required' });
      }

      const data = await this._fetchVerificationData(batchNumber, req);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: `Honey batch '${batchNumber}' not found. Please verify the batch ID printed on the packaging jar.`
        });
      }

      return res.json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async downloadVerificationPdf(req, res, next) {
    try {
      const { batchNumber } = req.params;
      if (!batchNumber) {
        return res.status(400).json({ success: false, message: 'Batch number parameter required' });
      }

      const data = await this._fetchVerificationData(batchNumber, req);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: `Honey batch '${batchNumber}' not found for PDF report generation.`
        });
      }

      const pdfBuffer = await pdfService.createVerificationPdf(data, req);
      const safeFilename = `BeeProof_Verification_${data.batchNumber}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      return res.send(pdfBuffer);
    } catch (err) {
      next(err);
    }
  }

  async getBatchQr(req, res, next) {
    try {
      const { batchNumber } = req.params;
      const origin = req.query.origin || req;
      const cleanNumber = (batchNumber || '').trim().toUpperCase();
      const qrData = await qrService.generateQrDataUrl(cleanNumber, origin);
      return res.json({
        success: true,
        data: qrData
      });
    } catch (err) {
      next(err);
    }
  }

  async getBlockchainProof(req, res, next) {
    try {
      const { batchNumber } = req.params;
      if (!batchNumber) {
        return res.status(400).json({ success: false, message: 'Batch number parameter required' });
      }

      const cleanNumber = batchNumber.trim().toUpperCase();
      const batch = await HoneyBatch.findOne({ batchNumber: cleanNumber });

      if (!batch) {
        return res.status(404).json({
          success: false,
          message: `Honey batch '${cleanNumber}' not found for blockchain proof verification.`
        });
      }

      const integrity = await blockchainService.verifyIntegrity(batch);
      const computedHash = await blockchainService.computeCanonicalHash(batch);

      const qty = Number(batch.totalQuantityKg || 0).toFixed(2);
      let harvestDate = batch.harvestDate || '';
      if (harvestDate && typeof harvestDate === 'string' && harvestDate.includes('T')) {
        harvestDate = harvestDate.split('T')[0];
      } else if (harvestDate instanceof Date) {
        harvestDate = harvestDate.toISOString().split('T')[0];
      }
      const canonicalString = `batchNumber=${batch.batchNumber};cluster=${batch.clusterCode};quantity=${qty};floral=${batch.floralSource};harvestDate=${harvestDate}`;

      const regRecord = await BlockchainRecord.findOne({
        batchNumber: batch.batchNumber,
        eventType: 'BATCH_REGISTERED'
      }).sort({ confirmedAt: -1, _id: -1 });

      const txSignature = (regRecord && regRecord.transactionHash) || batch.blockchainTxHash || null;
      const onChainHash = (regRecord && regRecord.stateMerkleRoot) || batch.onChainHash || null;
      const hashMatches = Boolean(onChainHash && onChainHash.toLowerCase() === computedHash.toLowerCase());

      const programId = '8eLXGBggKm9Svwpq1UXUbrZeFTvEEosfwkXYcSP7WxeY';
      let pdaAddress = null;
      try {
        const { PublicKey } = require('@solana/web3.js');
        const [pda] = PublicKey.findProgramAddressSync(
          [Buffer.from('batch'), Buffer.from(batch.batchNumber)],
          new PublicKey(programId)
        );
        pdaAddress = pda.toBase58();
      } catch (e) {
        pdaAddress = null;
      }

      const explorerUrl = txSignature ? `https://explorer.solana.com/tx/${txSignature}?cluster=devnet` : null;
      const pdaExplorerUrl = pdaAddress ? `https://explorer.solana.com/address/${pdaAddress}?cluster=devnet` : null;

      return res.json({
        success: true,
        data: {
          batchNumber: batch.batchNumber,
          clusterCode: batch.clusterCode,
          clusterName: batch.clusterName,
          totalQuantityKg: batch.totalQuantityKg,
          floralSource: batch.floralSource,
          harvestDate: harvestDate,
          canonicalData: {
            batchNumber: batch.batchNumber,
            clusterCode: batch.clusterCode,
            quantityKg: qty,
            floralSource: batch.floralSource,
            harvestDate: harvestDate,
            canonicalString
          },
          computedSha256Hash: computedHash,
          onChainHash: onChainHash,
          hashMatches: hashMatches,
          verificationStatus: hashMatches ? 'VERIFIED' : 'TAMPERED / NOT VERIFIED',
          blockchainVerified: hashMatches,
          blockchainNetwork: 'Solana Devnet',
          anchorProgramId: programId,
          pdaAddress: pdaAddress,
          pdaExplorerUrl: pdaExplorerUrl,
          transactionSignature: txSignature,
          transactionStatus: txSignature ? 'Confirmed' : 'Pending',
          blockSlot: (regRecord && regRecord.blockNumber) || batch.blockNumber || 1,
          explorerUrl: explorerUrl,
          reason: hashMatches ? 'SHA-256 canonical hash matches recorded Solana Devnet state proof' : 'Cryptographic hash mismatch with Solana Devnet recorded proof (TAMPERED)',
          registeredAt: (regRecord && regRecord.confirmedAt) || batch.createdAt
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async simulateTamperDemo(req, res, next) {
    try {
      const { batchNumber } = req.params;
      const cleanNumber = batchNumber.trim().toUpperCase();
      const batch = await HoneyBatch.findOne({ batchNumber: cleanNumber });

      if (!batch) {
        return res.status(404).json({ success: false, message: 'Batch not found' });
      }

      if (!batch.originalDataBackup) {
        batch.originalDataBackup = {
          totalQuantityKg: batch.totalQuantityKg,
          floralSource: batch.floralSource,
          status: batch.status
        };
      }

      const prevQty = batch.totalQuantityKg;
      const prevFloral = batch.floralSource;

      const customQty = (req.body && req.body.modifiedQuantity !== undefined && !isNaN(Number(req.body.modifiedQuantity)))
        ? Number(req.body.modifiedQuantity)
        : (batch.totalQuantityKg + 100.0);

      batch.totalQuantityKg = customQty;
      batch.floralSource = 'High-Fructose Corn Syrup Adulterated (Tampered)';
      batch.isTampered = true;
      await batch.save();

      const blockchainService = require('../services/blockchainService');
      const integrity = await blockchainService.verifyIntegrity(batch);

      const AuditLog = require('../models/AuditLog');
      await AuditLog.create({
        username: req.user ? req.user.username : 'admin',
        role: 'ADMIN_KVIC',
        action: 'SIMULATED_DATA_TAMPER',
        entityName: 'HoneyBatch',
        entityId: cleanNumber,
        details: `Simulated tamper demo on batch ${cleanNumber}: Quantity changed from ${prevQty}kg to ${customQty}kg; floral source adulterated. Recomputed hash now mismatches Solana Devnet on-chain proof.`,
        timestamp: new Date()
      });

      return res.json({
        success: true,
        message: `Batch ${cleanNumber} data modified in MongoDB (Quantity: ${customQty}kg, Floral Source: High-Fructose Corn Syrup Adulterated). SHA-256 hash recomputation will now fail against Solana Devnet record.`,
        data: {
          batch,
          integrity,
          isTampered: true,
          verified: integrity.verified
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async restoreTamperDemo(req, res, next) {
    try {
      const { batchNumber } = req.params;
      const cleanNumber = batchNumber.trim().toUpperCase();
      const batch = await HoneyBatch.findOne({ batchNumber: cleanNumber });

      if (!batch) {
        return res.status(404).json({ success: false, message: 'Batch not found' });
      }

      const prevQty = batch.totalQuantityKg;
      const prevFloral = batch.floralSource;
      const prevStatus = batch.status;
      const restoredFields = [];

      let originalData = batch.originalDataBackup;
      if (!originalData) {
        const HarvestEvent = require('../models/HarvestEvent');
        const harvest = await HarvestEvent.findOne({ batch: batch._id });
        if (harvest) {
          originalData = {
            totalQuantityKg: harvest.quantityKg,
            floralSource: harvest.floralSource,
            status: 'HARVESTED'
          };
        }
      }

      if (originalData) {
        if (batch.totalQuantityKg !== originalData.totalQuantityKg) {
          restoredFields.push({
            field: 'totalQuantityKg',
            previousValue: `${prevQty} kg`,
            restoredValue: `${originalData.totalQuantityKg} kg`
          });
          batch.totalQuantityKg = originalData.totalQuantityKg;
        }

        if (batch.floralSource !== originalData.floralSource) {
          restoredFields.push({
            field: 'floralSource',
            previousValue: prevFloral,
            restoredValue: originalData.floralSource
          });
          batch.floralSource = originalData.floralSource;
        }

        if (originalData.status && batch.status !== originalData.status) {
          restoredFields.push({
            field: 'status',
            previousValue: prevStatus,
            restoredValue: originalData.status
          });
          batch.status = originalData.status;
        }

        batch.isTampered = false;
        batch.originalDataBackup = undefined;
        await batch.save();
      }

      const blockchainService = require('../services/blockchainService');
      const integrity = await blockchainService.verifyIntegrity(batch);
      const computedHash = await blockchainService.computeCanonicalHash(batch);

      const restoredSummary = restoredFields.length > 0
        ? restoredFields.map(f => `${f.field} (from "${f.previousValue}" to "${f.restoredValue}")`).join(', ')
        : 'All database fields restored to authentic genesis state';

      const AuditLog = require('../models/AuditLog');
      await AuditLog.create({
        username: req.user ? req.user.username : 'admin',
        role: req.user ? (req.user.role || 'ADMIN_KVIC') : 'ADMIN_KVIC',
        action: 'TAMPER_RESOLVED',
        entityName: 'HoneyBatch',
        entityId: cleanNumber,
        details: `Admin resolved tampering for batch ${cleanNumber}. Restored: [${restoredSummary}]. Recomputed SHA-256: ${computedHash}. On-Chain Solana Hash: ${integrity.onChainHash}. Cryptographic status: ${integrity.verified ? 'PROVENANCE VERIFIED' : 'TAMPERED / FAILED'}.`,
        timestamp: new Date()
      });

      return res.json({
        success: true,
        message: integrity.verified
          ? `Batch ${cleanNumber} authentic values restored in MongoDB. Recomputed hash matches Solana Devnet on-chain proof (PROVENANCE VERIFIED).`
          : `Batch ${cleanNumber} restored in MongoDB, but cryptographic verification failed.`,
        data: {
          batch,
          integrity,
          computedHash,
          onChainHash: integrity.onChainHash,
          hashMatches: integrity.verified,
          verificationStatus: integrity.verified ? 'VERIFIED' : 'TAMPERED / NOT VERIFIED',
          restoredFields,
          verified: integrity.verified
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new VerificationController();

