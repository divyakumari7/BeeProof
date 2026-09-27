const aiServiceClient = require('../services/aiServiceClient');
const iotService = require('../services/iotService');
const HoneyBatch = require('../models/HoneyBatch');
const HiveAlert = require('../models/HiveAlert');

class AiController {
  async getHiveInsights(req, res, next) {
    try {
      const hiveId = req.params.hiveId;
      const telemetry = await iotService.getHiveTelemetry(hiveId);

      // Fetch historical harvest yields for this hive (if available)
      const historicalBatches = await HoneyBatch.find({
        $or: [
          { hive: telemetry.hiveId },
          { hiveCode: telemetry.hiveCode }
        ]
      }).select('totalQuantityKg');
      const historicalYields = historicalBatches.map(b => Number(b.totalQuantityKg)).filter(q => !isNaN(q) && q > 0);

      // Fetch active alerts for this hive
      const activeAlerts = await HiveAlert.find({
        $or: [
          { hive: telemetry.hiveId },
          { hiveCode: telemetry.hiveCode }
        ],
        status: 'UNREAD'
      });

      const health = await aiServiceClient.predictHiveHealth({
        hiveId,
        temperature: telemetry.latestMetrics.temperature,
        humidity: telemetry.latestMetrics.humidity,
        scaleWeight: telemetry.latestMetrics.scaleWeight,
        acousticFrequency: telemetry.latestMetrics.acousticFrequency
      });

      const yieldForecast = await aiServiceClient.forecastHiveYield({
        hiveId,
        hiveCode: telemetry.hiveCode,
        species: telemetry.species || 'Apis cerana indica',
        currentWeight: telemetry.latestMetrics.scaleWeight,
        temperature: telemetry.latestMetrics.temperature,
        humidity: telemetry.latestMetrics.humidity,
        acousticFrequency: telemetry.latestMetrics.acousticFrequency,
        status: telemetry.status,
        healthScore: health.health_score,
        alerts: activeAlerts,
        historicalYields,
        recentReadings: telemetry.readings || []
      });

      return res.json({
        success: true,
        data: {
          hiveId,
          hiveCode: telemetry.hiveCode,
          healthScore: health.health_score,
          colonyStatus: health.status,
          swarmingProbability: health.swarming_probability,
          queenLossRisk: health.queen_loss_risk,
          explainabilityFactors: health.explainability_factors,
          predictedYieldKg: (yieldForecast.estimatedYieldMinKg + yieldForecast.estimatedYieldMaxKg) / 2,
          confidenceIntervalKg: [yieldForecast.estimatedYieldMinKg, yieldForecast.estimatedYieldMaxKg],
          harvestReadiness: yieldForecast.expectedReadyDaysMin <= 7 ? 'HIGH' : (yieldForecast.expectedReadyDaysMin <= 14 ? 'MODERATE' : 'LOW'),
          projectedHarvestDate: yieldForecast.expectedHarvestWindow,
          yieldForecast,
          inferredAt: health.inferred_at
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async refreshPredictions(req, res, next) {
    return this.getHiveInsights(req, res, next);
  }

  // --- Computer Vision Image Diagnosis ---
  async diagnoseCombImage(req, res, next) {
    try {
      const hiveCode = req.params.hiveId || req.body.hiveCode || req.body.hive_code || 'SUN-HIVE-001';
      const uploadedFile = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
      const rawBase64 = req.body?.imageBase64 || req.body?.image_base64 || req.body?.image || req.body?.fileBase64 || req.body?.data;
      const originalFilename = req.body?.filename || req.body?.fileName || req.body?.image_name || (uploadedFile ? uploadedFile.originalname : 'comb_photo.jpg');
      let result;

      if (uploadedFile && uploadedFile.buffer) {
        result = await aiServiceClient.diagnoseCombImage({
          fileBuffer: uploadedFile.buffer,
          originalFilename: uploadedFile.originalname || originalFilename,
          hiveCode
        });
      } else if (rawBase64 && typeof rawBase64 === 'string') {
        result = await aiServiceClient.diagnoseCombImage({
          imageBase64: rawBase64,
          originalFilename,
          hiveCode
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'No image provided. Please upload a file (e.g. "image" or "file") or provide base64 data.'
        });
      }

      return res.json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AiController();
