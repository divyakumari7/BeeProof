const express = require('express');
const router = express.Router();
const qualityLabController = require('../controllers/qualityLabController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(authenticate);
router.use(authorizeRoles('QUALITY_LAB', 'ADMIN_KVIC'));

router.get('/overview', (req, res, next) => qualityLabController.getOverview(req, res, next));
router.get('/batches/pending', (req, res, next) => qualityLabController.getPendingBatches(req, res, next));
router.post('/batches/:batchNumber/verify', (req, res, next) => qualityLabController.verifyBatch(req, res, next));

module.exports = router;
