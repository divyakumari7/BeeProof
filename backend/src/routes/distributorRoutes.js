const express = require('express');
const router = express.Router();
const distributorController = require('../controllers/distributorController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(authenticate);
router.use(authorizeRoles('DISTRIBUTOR', 'ADMIN_KVIC'));

router.get('/overview', (req, res, next) => distributorController.getOverview(req, res, next));
router.get('/batches/packaged', (req, res, next) => distributorController.getPackagedBatches(req, res, next));
router.post('/batches/:batchNumber/dispatch', (req, res, next) => distributorController.dispatchBatch(req, res, next));
router.post('/batches/:batchNumber/deliver', (req, res, next) => distributorController.deliverBatch(req, res, next));

module.exports = router;
