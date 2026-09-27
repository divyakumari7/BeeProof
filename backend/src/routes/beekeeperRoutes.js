const express = require('express');
const router = express.Router();
const beekeeperController = require('../controllers/beekeeperController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(authenticate);
router.use(authorizeRoles('BEEKEEPER', 'ADMIN_KVIC'));

router.get('/dashboard', (req, res, next) => beekeeperController.getDashboard(req, res, next));
router.get('/hives', (req, res, next) => beekeeperController.getHives(req, res, next));
router.post('/hives', (req, res, next) => beekeeperController.createHive(req, res, next));
router.get('/alerts', (req, res, next) => beekeeperController.getAlerts(req, res, next));
router.get('/batches', (req, res, next) => beekeeperController.getBatches(req, res, next));
router.post('/batches', (req, res, next) => beekeeperController.createBatch(req, res, next));

module.exports = router;
