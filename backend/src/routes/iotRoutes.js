const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/hives/:hiveId/telemetry', (req, res, next) => iotController.getHiveTelemetry(req, res, next));
router.get('/hives/:hiveId/alerts', (req, res, next) => iotController.getHiveAlerts(req, res, next));
router.put('/alerts/:alertId/resolve', authenticate, (req, res, next) => iotController.resolveAlert(req, res, next));
router.post('/hives/:hiveId/simulate', (req, res, next) => iotController.simulateCondition(req, res, next));
router.put('/sensors/:sensorIdentifier/status', (req, res, next) => iotController.setSensorStatus(req, res, next));

module.exports = router;
