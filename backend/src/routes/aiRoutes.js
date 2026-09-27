const express = require('express');
const router = express.Router();
const multer = require('multer');
const aiController = require('../controllers/aiController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB limit
});

router.get('/hives/:hiveId/insights', (req, res, next) => aiController.getHiveInsights(req, res, next));
router.post('/hives/:hiveId/refresh-predictions', (req, res, next) => aiController.refreshPredictions(req, res, next));

// Computer Vision Diagnosis Endpoints & Aliases
router.post('/cv/predict', upload.any(), (req, res, next) => aiController.diagnoseCombImage(req, res, next));
router.post('/cv/diagnose', upload.any(), (req, res, next) => aiController.diagnoseCombImage(req, res, next));
router.post('/vision/diagnose', upload.any(), (req, res, next) => aiController.diagnoseCombImage(req, res, next));
router.post('/predict/vision-health', upload.any(), (req, res, next) => aiController.diagnoseCombImage(req, res, next));
router.post('/hives/:hiveId/vision-diagnose', upload.any(), (req, res, next) => aiController.diagnoseCombImage(req, res, next));
router.post('/hives/:hiveId/cv/predict', upload.any(), (req, res, next) => aiController.diagnoseCombImage(req, res, next));

module.exports = router;


