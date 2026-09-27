const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');

// Public batch verification endpoints: /api/verify/batch/:batchNumber and /api/verify/:batchNumber
router.get('/batch/:batchNumber/qr', (req, res, next) => verificationController.getBatchQr(req, res, next));
router.get('/:batchNumber/qr', (req, res, next) => verificationController.getBatchQr(req, res, next));
router.get('/batch/:batchNumber/pdf', (req, res, next) => verificationController.downloadVerificationPdf(req, res, next));
router.get('/:batchNumber/pdf', (req, res, next) => verificationController.downloadVerificationPdf(req, res, next));
router.get('/blockchain-proof/:batchNumber', (req, res, next) => verificationController.getBlockchainProof(req, res, next));
router.post('/tamper-demo/:batchNumber', (req, res, next) => verificationController.simulateTamperDemo(req, res, next));
router.post('/restore-demo/:batchNumber', (req, res, next) => verificationController.restoreTamperDemo(req, res, next));
router.get('/batch/:batchNumber', (req, res, next) => verificationController.verifyBatch(req, res, next));
router.get('/:batchNumber', (req, res, next) => verificationController.verifyBatch(req, res, next));

module.exports = router;
