const HoneyBatch = require('../models/HoneyBatch');
const QualityReport = require('../models/QualityReport');
const stateMachineService = require('../services/stateMachineService');
const blockchainService = require('../services/blockchainService');

class QualityLabController {
  async getOverview(req, res, next) {
    try {
      const reports = await QualityReport.find().sort({ certifiedAt: -1 });
      const pendingBatches = await HoneyBatch.find({ status: 'PROCESSING' }).sort({ updatedAt: -1 });

      const passedReports = reports.filter(r => r.overallVerdict === 'PASS').length;
      const nmrAssaysPassedRate = reports.length > 0
        ? `${Math.round((passedReports / reports.length) * 100)}%`
        : '100%';

      return res.json({
        success: true,
        data: {
          labName: 'National Agro-Food Quality & NMR Research Laboratory',
          accreditationNumber: 'NABL-TC-8891-2026',
          totalTestsConducted: reports.length,
          pendingVerificationCount: pendingBatches.length,
          nmrAssaysPassedRate,
          reports,
          pendingBatches
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async getPendingBatches(req, res, next) {
    try {
      const batches = await HoneyBatch.find({ status: 'PROCESSING' }).sort({ updatedAt: -1 });
      return res.json({ success: true, data: batches });
    } catch (err) {
      next(err);
    }
  }

  async verifyBatch(req, res, next) {
    try {
      const { batchNumber } = req.params;
      const {
        moisturePercentage,
        pollenPurityScore,
        nmrSpectroscopyPassed = true,
        c4SugarAdulterationDetected = false,
        certificateNumber,
        qualityGrade,
        notes
      } = req.body;

      const cleanNumber = batchNumber.trim().toUpperCase();
      const batch = await HoneyBatch.findOne({ batchNumber: cleanNumber });

      if (!batch) {
        return res.status(404).json({ success: false, message: 'Batch not found' });
      }

      if (batch.status !== 'PROCESSING') {
        return res.status(400).json({
          success: false,
          message: `Batch cannot undergo quality testing while in status '${batch.status}'. It must be in 'PROCESSING'.`
        });
      }

      const moisture = Number(moisturePercentage) || 17.8;
      const pollen = Number(pollenPurityScore) || 96.2;
      const nmrPassed = Boolean(nmrSpectroscopyPassed);
      const c4Detected = Boolean(c4SugarAdulterationDetected);

      // Verdict criteria
      const explicitReject = req.body.passTest === false || req.body.action === 'REJECT' || req.body.reject === true;
      const passed = !explicitReject && nmrPassed && !c4Detected && moisture <= 20.0;
      const overallVerdict = passed ? 'PASS' : 'FAIL';
      const nextStatus = passed ? 'QUALITY_VERIFIED' : (explicitReject ? 'REJECTED' : 'ON_HOLD');

      // Validate transition
      stateMachineService.validateTransition(batch.status, nextStatus, req.user.role);

      const certNum = certificateNumber || `BP-NABL-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const report = await QualityReport.create({
        batch: batch._id,
        batchNumber: cleanNumber,
        chemist: req.user._id,
        chemistName: req.user.fullName,
        labName: 'National Agro-Food Quality & NMR Research Laboratory',
        accreditationNumber: 'NABL-TC-8891-2026',
        certificateNumber: certNum,
        moisturePercentage: moisture,
        pollenPurityScore: pollen,
        nmrSpectroscopyPassed: nmrPassed,
        c4SugarAdulterationDetected: c4Detected,
        overallVerdict,
        qualityGrade: qualityGrade || (passed ? 'Quality Verified — Premium Grade' : 'Substandard / Adulteration Suspect'),
        notes: notes || (passed ? 'Spectroscopic botanical fingerprint confirms authentic unadulterated honey' : 'Failed authenticity assay')
      });

      batch.status = nextStatus;
      batch.statusHistory.push({
        status: nextStatus,
        timestamp: new Date(),
        updatedBy: req.user.fullName,
        notes: `Quality testing verdict: ${overallVerdict} (Cert #${certNum})`
      });
      await batch.save();

      // Record on blockchain
      try {
        const bcResult = await blockchainService.recordQualityCertificateOnChain(
          cleanNumber,
          certNum,
          'National Agro-Food Quality & NMR Research Laboratory',
          moisture,
          pollen,
          nmrPassed,
          c4Detected
        );
        if (bcResult) {
          report.blockchainTxHash = bcResult.txHash;
          await report.save();
        }
      } catch (bcErr) {
        console.warn('Blockchain quality test record warning:', bcErr.message);
      }

      return res.json({
        success: true,
        message: passed
          ? `Quality verification PASSED. Certificate #${certNum} issued. Batch status updated to QUALITY_VERIFIED.`
          : `Quality verification FAILED. Batch placed ON_HOLD.`,
        data: report
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new QualityLabController();
