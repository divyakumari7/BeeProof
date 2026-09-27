const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(authenticate);
router.use(authorizeRoles('ADMIN_KVIC'));

router.get('/overview', (req, res, next) => adminController.getOverview(req, res, next));
router.get('/analytics/summary', (req, res, next) => adminController.getAnalyticsSummary(req, res, next));
router.get('/beekeepers', (req, res, next) => adminController.getBeekeepers(req, res, next));
router.get('/clusters', (req, res, next) => adminController.getClusters(req, res, next));
router.get('/clusters/:clusterId/drilldown', (req, res, next) => adminController.getClusterDrilldown(req, res, next));
router.get('/hives', (req, res, next) => adminController.getHives(req, res, next));
router.get('/batches', (req, res, next) => adminController.getAllBatches(req, res, next));
router.get('/alerts', (req, res, next) => adminController.getAllAlerts(req, res, next));
router.get('/blockchain/stats', (req, res, next) => adminController.getBlockchainStats(req, res, next));
router.get('/audit-logs', (req, res, next) => adminController.getAuditLogs(req, res, next));
router.get('/export/audit-logs', (req, res, next) => adminController.exportAuditLogsCsv(req, res, next));

// Endpoints for testing cryptographic tamper detection & technical blockchain proof
router.get('/blockchain-proof/:batchNumber', (req, res, next) => adminController.getBlockchainProof(req, res, next));
router.post('/tamper-demo/:batchNumber', (req, res, next) => adminController.simulateTamperDemo(req, res, next));
router.post('/restore-demo/:batchNumber', (req, res, next) => adminController.restoreTamperDemo(req, res, next));
router.post('/batches/:batchNumber/tamper', (req, res, next) => adminController.tamperBatch(req, res, next));
router.post('/batches/:batchNumber/restore', (req, res, next) => adminController.restoreBatch(req, res, next));
router.put('/batches/:batchNumber', (req, res, next) => adminController.updateBatch(req, res, next));

module.exports = router;
