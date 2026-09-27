const iotService = require('../services/iotService');
const HiveAlert = require('../models/HiveAlert');
const Hive = require('../models/Hive');

class IotController {
  async getHiveTelemetry(req, res, next) {
    try {
      const data = await iotService.getHiveTelemetry(req.params.hiveId);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getHiveAlerts(req, res, next) {
    try {
      const hiveParam = req.params.hiveId;
      const mongoose = require('mongoose');
      const query = mongoose.Types.ObjectId.isValid(hiveParam)
        ? { $or: [{ hive: hiveParam }, { hiveCode: hiveParam }] }
        : { hiveCode: hiveParam };
      const alerts = await HiveAlert.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, data: alerts });
    } catch (err) {
      next(err);
    }
  }

  async resolveAlert(req, res, next) {
    try {
      const alert = await HiveAlert.findByIdAndUpdate(
        req.params.alertId,
        { status: 'RESOLVED', resolvedAt: new Date() },
        { new: true }
      );
      if (!alert) {
        return res.status(404).json({ success: false, message: 'Alert not found' });
      }

      // Check if any unread alerts remain for the hive
      const remainingUnread = await HiveAlert.countDocuments({ hive: alert.hive, status: 'UNREAD' });
      if (remainingUnread === 0) {
        await Hive.findByIdAndUpdate(alert.hive, { status: 'ACTIVE' });
      }

      return res.json({
        success: true,
        message: 'Alert marked as resolved',
        data: alert
      });
    } catch (err) {
      next(err);
    }
  }

  async simulateCondition(req, res, next) {
    try {
      const scenario = req.query.scenario || 'OVERHEAT';
      const data = await iotService.simulateScenario(req.params.hiveId, scenario);
      return res.json({
        success: true,
        message: `Simulated condition '${scenario}' applied to hive telemetry. (DEMO / SIMULATED SENSOR DATA)`,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async setSensorStatus(req, res, next) {
    try {
      const { sensorIdentifier } = req.params;
      const active = req.query.active !== 'false';
      return res.json({
        success: true,
        message: `Sensor ${sensorIdentifier} status set to ${active ? 'ACTIVE' : 'OFFLINE'}`,
        data: { sensorIdentifier, active }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new IotController();
