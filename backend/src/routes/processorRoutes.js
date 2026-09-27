const express = require('express');
const router = express.Router();
const processorController = require('../controllers/processorController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(authenticate);
router.use(authorizeRoles('PROCESSOR', 'ADMIN_KVIC'));

router.get('/overview', (req, res, next) => processorController.getOverview(req, res, next));
router.get('/batches', (req, res, next) => processorController.getBatches(req, res, next));
router.post('/batches/:batchNumber/collect', (req, res, next) => processorController.collectBatch(req, res, next));
router.post('/batches/:batchNumber/process', (req, res, next) => processorController.processBatch(req, res, next));
router.post('/batches/:batchNumber/package', (req, res, next) => processorController.packageBatch(req, res, next));

module.exports = router;
