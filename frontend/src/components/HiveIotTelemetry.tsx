import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { HiveDto, HiveTelemetryResponse, HiveAlert } from '../types';
import { Activity, AlertTriangle, CheckCircle, RefreshCw, Radio, Thermometer, Droplets, Scale, Volume2, ShieldAlert } from 'lucide-react';

interface Props {
  hives: HiveDto[];
}

export const HiveIotTelemetry: React.FC<Props> = ({ hives }) => {
  const [selectedHiveId, setSelectedHiveId] = useState<number | string>(hives.length > 0 ? hives[0].id : 0);
  const [telemetry, setTelemetry] = useState<HiveTelemetryResponse | null>(null);
  const [alerts, setAlerts] = useState<HiveAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectedHive = hives.find(h => h.id === selectedHiveId) || hives[0];

  const fetchTelemetry = async (hiveId: number | string) => {
    if (!hiveId) return;
    setLoading(true);
    setMessage(null);
    try {
      const [tRes, aRes] = await Promise.all([
        api.getHiveTelemetry(hiveId),
        api.getHiveAlerts(hiveId)
      ]);
      if (tRes.success && tRes.data) {
        setTelemetry(tRes.data);
      }
      if (aRes.success && aRes.data) {
        setAlerts(aRes.data);
      }
    } catch (err: any) {
      console.error('Failed to load telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedHiveId) {
      fetchTelemetry(selectedHiveId);
    }
  }, [selectedHiveId]);

  const handleSimulate = async (scenario: string) => {
    if (!selectedHiveId) return;
    setSimulating(true);
    try {
      const res = await api.simulateCondition(selectedHiveId, scenario);
      setMessage(`Simulated condition '${scenario}' triggered successfully`);
      await fetchTelemetry(selectedHiveId);
    } catch (err: any) {
      setMessage(`Error simulating scenario: ${err.message || 'Server error'}`);
    } finally {
      setSimulating(false);
    }
  };

  const handleResolveAlert = async (alertId: number | string) => {
    try {
      const res = await api.resolveAlert(alertId);
      if (res.success) {
        setMessage('Alert marked as resolved');
        await fetchTelemetry(selectedHiveId);
      }
    } catch (err: any) {
      setMessage(`Failed to resolve alert: ${err.message}`);
    }
  };

  const handleToggleSensorStatus = async () => {
    if (!telemetry?.sensorIdentifier) return;
    const newStatus = telemetry.sensorStatus !== 'ONLINE';
    try {
      await api.setSensorStatus(telemetry.sensorIdentifier, newStatus);
      setMessage(`Sensor set to ${newStatus ? 'ONLINE' : 'OFFLINE'}`);
      await fetchTelemetry(selectedHiveId);
    } catch (err: any) {
      setMessage(`Failed to toggle sensor: ${err.message}`);
    }
  };

  if (!hives || hives.length === 0) {
    return (
      <div className="p-6 bg-sand-50 rounded-2xl border border-sand-200 text-center text-sm text-sand-600">
        No hives registered to monitor telemetry.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-6 space-y-6">
      {/* Header & Hive Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-600 animate-pulse" />
            <h2 className="font-display text-lg font-bold text-forest-950">
              Live IoT Hive Telemetry
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300">
              {telemetry?.dataSourceLabel || 'DEMO / SIMULATED SENSOR DATA'}
            </span>
          </div>
          <p className="text-xs text-sand-800 mt-1">
            Real-time biometric monitoring: Brood thermogenesis, chamber humidity & hive weight scale.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-sand-800 whitespace-nowrap">Select Hive:</label>
          <select
            value={selectedHiveId}
            onChange={(e) => setSelectedHiveId(Number(e.target.value))}
            className="px-3 py-1.5 text-xs font-medium bg-sand-50 border border-sand-300 rounded-lg text-forest-950 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          >
            {hives.map(h => (
              <option key={h.id} value={h.id}>
                {h.hiveCode} — {h.beeSpecies}
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchTelemetry(selectedHiveId)}
            disabled={loading}
            className="p-1.5 rounded-lg border border-sand-300 hover:bg-sand-50 text-sand-600 hover:text-forest-900 transition-colors"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3 text-xs rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-emerald-800 font-bold ml-2">×</button>
        </div>
      )}

      {/* Sensor Core Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-sand-50 border border-sand-200">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[11px] text-sand-500 uppercase tracking-wider block">Sensor Core</span>
            <span className="font-mono text-xs font-bold text-forest-900">{telemetry?.sensorIdentifier || 'SEN-AUTO'}</span>
          </div>
          <div className="h-6 w-px bg-sand-300" />
          <div>
            <span className="text-[11px] text-sand-500 uppercase tracking-wider block">Network State</span>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${telemetry?.sensorStatus === 'ONLINE' ? 'text-emerald-800' : 'text-rose-700'}`}>
              <span className={`w-2 h-2 rounded-full ${telemetry?.sensorStatus === 'ONLINE' ? 'bg-emerald-700 animate-ping' : 'bg-rose-600'}`} />
              {telemetry?.sensorStatus || 'ONLINE'}
            </span>
          </div>
          <div className="h-6 w-px bg-sand-300" />
          <div>
            <span className="text-[11px] text-sand-500 uppercase tracking-wider block">Last Telemetry Packet</span>
            <span className="text-xs text-sand-700">
              {telemetry?.lastSeen ? new Date(telemetry.lastSeen).toLocaleTimeString() : 'Just now'}
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleSensorStatus}
          className="text-xs px-3 py-1.5 rounded-lg border border-sand-300 bg-white hover:bg-sand-100 font-medium text-sand-700 transition-colors"
        >
          Toggle Sensor {telemetry?.sensorStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE'}
        </button>
      </div>

      {/* Live Metric Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature */}
        <div className="p-4 rounded-xl border border-sand-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-sand-600">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-700" /> Internal Temp
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sand-100 text-sand-800">
              Normal: 32 - 36.5°C
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-forest-950">
              {telemetry?.currentTemperature ?? 34.5}°C
            </span>
            {telemetry && (telemetry.currentTemperature > 36.5 || telemetry.currentTemperature < 32.0) && (
              <span className="text-[11px] text-rose-800 font-semibold flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3" /> Anomaly
              </span>
            )}
          </div>
          <div className="w-full bg-sand-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                telemetry && (telemetry.currentTemperature > 36.5 || telemetry.currentTemperature < 32.0)
                  ? 'bg-rose-500'
                  : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, Math.max(10, ((telemetry?.currentTemperature || 34.5) / 45) * 100))}%` }}
            />
          </div>
        </div>

        {/* Humidity */}
        <div className="p-4 rounded-xl border border-sand-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-sand-600">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-700" /> Relative Humidity
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sand-100 text-sand-800">
              Normal: 45 - 70%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-forest-950">
              {telemetry?.currentHumidity ?? 58.0}%
            </span>
            {telemetry && (telemetry.currentHumidity > 70 || telemetry.currentHumidity < 45) && (
              <span className="text-[11px] text-rose-800 font-semibold flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3" /> Anomaly
              </span>
            )}
          </div>
          <div className="w-full bg-sand-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                telemetry && (telemetry.currentHumidity > 70 || telemetry.currentHumidity < 45)
                  ? 'bg-amber-600'
                  : 'bg-sky-600'
              }`}
              style={{ width: `${telemetry?.currentHumidity || 58}%` }}
            />
          </div>
        </div>

        {/* Weight */}
        <div className="p-4 rounded-xl border border-sand-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-sand-600">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-800" /> Hive Weight Scale
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sand-100 text-sand-800">
              Tare: ~12kg
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-forest-950">
              {telemetry?.currentWeight ?? 34.0} kg
            </span>
            <span className="text-[11px] text-emerald-800 font-medium">Accumulating</span>
          </div>
          <div className="w-full bg-sand-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${Math.min(100, ((telemetry?.currentWeight || 34.0) / 60) * 100)}%` }}
            />
          </div>
        </div>

        {/* Acoustic Frequency */}
        <div className="p-4 rounded-xl border border-sand-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-sand-600">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-purple-700" /> Acoustic Dominant
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sand-100 text-sand-800">
              Normal: 200-260 Hz
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-forest-950">
              {telemetry?.currentAcousticFreq ?? 225} Hz
            </span>
            <span className="text-[11px] text-purple-800 font-medium">Stable Colony</span>
          </div>
          <div className="w-full bg-sand-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full"
              style={{ width: `${Math.min(100, ((telemetry?.currentAcousticFreq || 225) / 350) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Historical Trend SVG Chart */}
      {telemetry?.history && telemetry.history.length > 0 && (
        <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-forest-900">Historical Telemetry Timeline (Last {telemetry.history.length} Packets)</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-amber-800"><span className="w-2 h-2 rounded-full bg-amber-600" /> Temp (°C)</span>
              <span className="flex items-center gap-1 text-sky-800"><span className="w-2 h-2 rounded-full bg-sky-600" /> Humidity (%)</span>
              <span className="flex items-center gap-1 text-emerald-900"><span className="w-2 h-2 rounded-full bg-emerald-700" /> Weight (kg)</span>
            </div>
          </div>

          <div className="h-28 w-full bg-white rounded-lg border border-sand-200 p-2 flex items-end gap-1.5 overflow-x-auto">
            {telemetry.history.map((pt, idx) => {
              const tempHeight = Math.max(10, Math.min(100, ((pt.temperature - 25) / 20) * 100));
              const humHeight = Math.max(10, Math.min(100, (pt.humidity / 100) * 100));
              const weightHeight = Math.max(10, Math.min(100, (pt.weight / 60) * 100));
              return (
                <div key={idx} className="flex-1 min-w-[20px] h-full flex items-end justify-center gap-0.5 group relative" title={`Time: ${new Date(pt.timestamp).toLocaleTimeString()} | Temp: ${pt.temperature}°C | Hum: ${pt.humidity}% | Weight: ${pt.weight}kg`}>
                  <div style={{ height: `${tempHeight}%` }} className="w-1.5 bg-amber-500 rounded-t-sm" />
                  <div style={{ height: `${humHeight}%` }} className="w-1.5 bg-sky-500 rounded-t-sm" />
                  <div style={{ height: `${weightHeight}%` }} className="w-1.5 bg-emerald-600 rounded-t-sm" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Abnormal Condition Simulator Controls */}
      <div className="p-4 rounded-xl border border-sand-200 bg-sand-50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-forest-950 uppercase tracking-wider">
            IoT Field Condition Simulator (Testing & Demonstrations)
          </span>
          {simulating && <span className="text-xs text-amber-700 animate-pulse font-medium">Injecting reading...</span>}
        </div>
        <p className="text-[11px] text-sand-800">
          Inject synthetic telemetry conditions to test biological thresholds, alert generation, and resolution workflows.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => handleSimulate('NORMAL')}
            disabled={simulating}
            className="px-2.5 py-1 text-xs rounded-lg bg-white border border-sand-300 hover:bg-sand-100 font-medium text-sand-800 transition-colors"
          >
            Normal (34.5°C, 58%)
          </button>
          <button
            onClick={() => handleSimulate('HIGH_TEMP')}
            disabled={simulating}
            className="px-2.5 py-1 text-xs rounded-lg bg-rose-50 border border-rose-300 hover:bg-rose-100 font-semibold text-rose-800 transition-colors"
          >
            🔥 High Temp (38.8°C)
          </button>
          <button
            onClick={() => handleSimulate('LOW_TEMP')}
            disabled={simulating}
            className="px-2.5 py-1 text-xs rounded-lg bg-blue-50 border border-blue-300 hover:bg-blue-100 font-semibold text-blue-800 transition-colors"
          >
            ❄️ Low Temp (28.2°C)
          </button>
          <button
            onClick={() => handleSimulate('HIGH_HUMIDITY')}
            disabled={simulating}
            className="px-2.5 py-1 text-xs rounded-lg bg-sky-50 border border-sky-300 hover:bg-sky-100 font-semibold text-sky-800 transition-colors"
          >
            💧 High Humidity (82%)
          </button>
          <button
            onClick={() => handleSimulate('SUDDEN_WEIGHT_LOSS')}
            disabled={simulating}
            className="px-2.5 py-1 text-xs rounded-lg bg-amber-50 border border-amber-300 hover:bg-amber-100 font-semibold text-amber-900 transition-colors"
          >
            ⚖️ Sudden Weight Drop (-4.5kg)
          </button>
          <button
            onClick={() => handleSimulate('SENSOR_OFFLINE')}
            disabled={simulating}
            className="px-2.5 py-1 text-xs rounded-lg bg-zinc-100 border border-zinc-300 hover:bg-zinc-200 font-semibold text-zinc-800 transition-colors"
          >
            📡 Sensor Offline
          </button>
        </div>
      </div>

      {/* Active Hive Alerts Panel */}
      {alerts.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-forest-950 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-rose-700" />
            <span>Active & Historical Alerts for {selectedHive?.hiveCode} ({alerts.length})</span>
          </div>

          <div className="space-y-2">
            {alerts.map((al) => (
              <div
                key={al.id}
                className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-colors ${
                  al.status === 'UNREAD'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                    : 'bg-sand-50 border-sand-200 text-sand-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      al.status === 'UNREAD' ? 'bg-rose-200 text-rose-900' : 'bg-sand-200 text-sand-800'
                    }`}>
                      {al.metric} — {al.status}
                    </span>
                    <span className="font-semibold">{al.reason}</span>
                  </div>

                  {al.status !== 'RESOLVED' ? (
                    <button
                      onClick={() => handleResolveAlert(al.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white border border-sand-300 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 transition-colors"
                    >
                      Resolve Alert
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" /> Resolved
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-sand-700 flex flex-wrap gap-x-4">
                  <span><strong>Observed:</strong> {al.observedValue}</span>
                  <span><strong>Expected Range:</strong> {al.expectedRange}</span>
                  <span><strong>Recommendation:</strong> {al.recommendedAction}</span>
                  <span><strong>Reported:</strong> {new Date(al.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
