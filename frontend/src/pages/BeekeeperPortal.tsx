import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BeekeeperDashboard, BatchResponse, CreateBatchRequest, HiveDto } from '../types';
import {
  Layers,
  PlusCircle,
  ShieldCheck,
  QrCode,
  Check,
  AlertCircle,
  X,
  Thermometer,
  Droplets,
  Scale,
  Activity,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Radio,
  ExternalLink,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Info,
  Box,
  TrendingUp,
  Heart
} from 'lucide-react';
import { QrCodeDisplay } from '../components/QrCodeDisplay';
import { BEEKEEPER_TRANSLATIONS, BeekeeperLanguage } from '../utils/beekeeperTranslations';
import { ComputerVisionHiveHealth } from '../components/ComputerVisionHiveHealth';
import { IotHardwareInventory } from '../components/IotHardwareInventory';
import { BeeProofActionAdvisor } from '../components/BeeProofActionAdvisor';
import { RegisterHiveModal } from '../components/RegisterHiveModal';

export const BeekeeperPortal: React.FC = () => {
  const { user } = useAuth();

  // Language state (persisted in localStorage)
  const [lang, setLang] = useState<BeekeeperLanguage>(() => {
    const saved = localStorage.getItem('beekeeper_language');
    return saved === 'hi' ? 'hi' : 'en';
  });

  const t = BEEKEEPER_TRANSLATIONS[lang];

  const handleLanguageChange = (newLang: BeekeeperLanguage) => {
    setLang(newLang);
    localStorage.setItem('beekeeper_language', newLang);
  };

  // Main Beekeeper Data State
  const [dashboard, setDashboard] = useState<BeekeeperDashboard | null>(null);
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedHiveId, setSelectedHiveId] = useState<string>('');
  const [selectedHiveCode, setSelectedHiveCode] = useState<string>('SUN-HIVE-001');
  const [telemetry, setTelemetry] = useState<any | null>(null);
  const [aiInsights, setAiInsights] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingTelemetry, setLoadingTelemetry] = useState(false);
  const [alertsFilter, setAlertsFilter] = useState<'ALL' | 'NEW' | 'RESOLVED'>('ALL');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Harvest Creation Modal State
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);
  const [isRegisterHiveModalOpen, setIsRegisterHiveModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdBatch, setCreatedBatch] = useState<BatchResponse | null>(null);

  const [formData, setFormData] = useState<CreateBatchRequest>({
    hiveId: 'SUN-HIVE-001',
    quantityKg: 25.0,
    floralSource: '',
    harvestDate: new Date().toISOString().split('T')[0],
    moistureContentPercentage: 17.5,
    notes: 'Pure raw comb harvest logged by beekeeper'
  });

  const handleHiveCreated = (newHive: any) => {
    setActionMessage(
      lang === 'hi'
        ? `छत्ता ${newHive.hiveCode} सफलतापूर्वक पंजीकृत हुआ!`
        : `Hive ${newHive.hiveCode} registered successfully!`
    );
    setTimeout(() => setActionMessage(null), 4000);

    // Update local dashboard hives state immediately
    setDashboard(prev => {
      if (!prev) return prev;
      const existingHives = prev.hives || [];
      const updatedHives = [...existingHives, newHive];
      return {
        ...prev,
        assignedHiveCount: updatedHives.length,
        hives: updatedHives
      };
    });

    // Immediately select the newly registered hive
    const newHiveId = String(newHive._id || newHive.id || newHive.hiveCode);
    setSelectedHiveId(newHiveId);
    setSelectedHiveCode(newHive.hiveCode);
    setFormData(prev => ({
      ...prev,
      hiveId: newHiveId
    }));

    // Refresh telemetry and batches for new hive
    fetchHiveDetails(newHive.hiveCode || newHiveId);
    fetchData();
  };

  // Fetch initial beekeeper profile, batches, and alerts
  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, batchRes, alertsRes] = await Promise.all([
        api.getBeekeeperDashboard(),
        api.getBeekeeperBatches(),
        api.getBeekeeperAlerts().catch(() => ({ success: false, data: [] }))
      ]);

      if (dashRes.success && dashRes.data) {
        setDashboard(dashRes.data);
        if (dashRes.data.hives && dashRes.data.hives.length > 0) {
          setSelectedHiveCode(prevCode => {
            if (prevCode && dashRes.data.hives.some((h: any) => h.hiveCode === prevCode)) {
              return prevCode;
            }
            return dashRes.data.hives[0].hiveCode || 'SUN-HIVE-001';
          });
          setSelectedHiveId(prevId => {
            if (prevId && dashRes.data.hives.some((h: any) => String(h._id || h.id || h.hiveCode) === prevId || h.hiveCode === prevId)) {
              return prevId;
            }
            const firstHive = dashRes.data.hives[0];
            return String((firstHive as any)._id || firstHive.id || firstHive.hiveCode);
          });
          setFormData(prev => ({
            ...prev,
            floralSource: prev.floralSource || dashRes.data.predominantFlora || 'Wild Mangrove'
          }));
        }
      }

      if (batchRes.success && batchRes.data) {
        setBatches(batchRes.data);
      }

      if (alertsRes.success && alertsRes.data) {
        setAlerts(alertsRes.data);
      }
    } catch (err) {
      console.error('Failed to load beekeeper data', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch live telemetry & health insights whenever selected hive changes
  const fetchHiveDetails = async (targetHive: string | number) => {
    if (!targetHive) return;
    setLoadingTelemetry(true);
    try {
      const [telemetryRes, aiRes, hiveAlertsRes] = await Promise.all([
        api.getHiveTelemetry(targetHive).catch(() => ({ success: false, data: null })),
        api.getHiveAiInsights(targetHive).catch(() => ({ success: false, data: null })),
        api.getHiveAlerts(targetHive).catch(() => ({ success: false, data: [] }))
      ]);

      if (telemetryRes.success && telemetryRes.data) {
        setTelemetry(telemetryRes.data);
      }

      if (aiRes.success && aiRes.data) {
        setAiInsights(aiRes.data);
      }

      // Merge hive-specific alerts if available
      if (hiveAlertsRes.success && Array.isArray(hiveAlertsRes.data) && hiveAlertsRes.data.length > 0) {
        setAlerts(prev => {
          const existingIds = new Set(prev.map(a => a._id || a.id));
          const newOnes = hiveAlertsRes.data.filter((a: any) => !existingIds.has(a._id || a.id));
          return [...newOnes, ...prev];
        });
      }
    } catch (err) {
      console.error('Failed to load hive details', err);
    } finally {
      setLoadingTelemetry(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const target = selectedHiveCode || selectedHiveId;
    if (target) {
      fetchHiveDetails(target);
    }
  }, [selectedHiveId, selectedHiveCode]);

  // Selected Hive object
  const selectedHive: HiveDto | undefined = useMemo(() => {
    if (!dashboard?.hives || dashboard.hives.length === 0) return undefined;
    return (
      dashboard.hives.find(
        h =>
          (h as any)._id === selectedHiveId ||
          String(h.id) === String(selectedHiveId) ||
          h.hiveCode === selectedHiveCode ||
          h.hiveCode === selectedHiveId
      ) || dashboard.hives[0]
    );
  }, [dashboard?.hives, selectedHiveId, selectedHiveCode]);

  const handleSelectHive = (h: HiveDto) => {
    const hId = String((h as any)._id || h.id || h.hiveCode);
    setSelectedHiveId(hId);
    setSelectedHiveCode(h.hiveCode);
    setFormData(prev => ({
      ...prev,
      hiveId: hId
    }));
  };

  // Mark Alert as Resolved
  const handleResolveAlert = async (alertId: string | number) => {
    try {
      await api.resolveAlert(alertId);
      setAlerts(prev =>
        prev.map(a =>
          (a._id === alertId || a.id === alertId)
            ? { ...a, status: 'RESOLVED', resolvedAt: new Date().toISOString() }
            : a
        )
      );
      setActionMessage(t.resolvedSuccessMsg);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      console.error('Failed to resolve alert', err);
    }
  };

  // Trigger Demo Scenario for testing alerts
  const handleTriggerScenario = async (scenario: string) => {
    const target = selectedHive?.hiveCode || selectedHiveId;
    if (!target) return;
    try {
      await api.simulateCondition(target, scenario);
      const code = selectedHive?.hiveCode || target;
      setActionMessage(
        lang === 'hi'
          ? `परीक्षण चेतावनी दर्ज की गई (${code})`
          : `Simulated alert triggered for ${code}`
      );
      setTimeout(() => setActionMessage(null), 3500);

      // Refresh hive telemetry and alerts
      await fetchHiveDetails(target);
      const updatedAlerts = await api.getBeekeeperAlerts().catch(() => null);
      if (updatedAlerts?.success && updatedAlerts.data) {
        setAlerts(updatedAlerts.data);
      }
    } catch (err: any) {
      console.error('Failed to simulate scenario', err);
    }
  };

  // Create Batch Submission
  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hiveId) {
      setFormError(t.selectHiveHint);
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await api.createBatch(formData);
      if (res.success && res.data) {
        setCreatedBatch(res.data);
        setBatches(prev => [res.data, ...prev]);
      } else {
        setFormError(res.message || 'Failed to create batch');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error communicating with server');
    } finally {
      setSubmitting(false);
    }
  };

  // Alerts counts & filtering
  const activeAlertsCount = alerts.filter(a => a.status === 'UNREAD').length;

  const filteredAlerts = useMemo(() => {
    if (alertsFilter === 'NEW') {
      return alerts.filter(a => a.status === 'UNREAD');
    }
    if (alertsFilter === 'RESOLVED') {
      return alerts.filter(a => a.status === 'RESOLVED');
    }
    return alerts;
  }, [alerts, alertsFilter]);

  // Helper to get friendly alert info
  const getAlertFriendlyInfo = (alert: any) => {
    const type = (alert.alertType || alert.metric || '').toUpperCase();
    const msg = alert.message || '';

    if (type.includes('TEMP') || type.includes('HYPERTHERMIA') || msg.toLowerCase().includes('temperature')) {
      return {
        title: msg.toLowerCase().includes('low') ? t.alertLowTempTitle : t.alertHighTempTitle,
        icon: Thermometer,
        iconBg: 'bg-red-100 text-red-700',
        badgeColor: 'bg-red-50 text-red-800 border-red-200'
      };
    }
    if (type.includes('HUMID') || msg.toLowerCase().includes('humidity')) {
      return {
        title: t.alertHumidityTitle,
        icon: Droplets,
        iconBg: 'bg-blue-100 text-blue-700',
        badgeColor: 'bg-blue-50 text-blue-800 border-blue-200'
      };
    }
    if (type.includes('WEIGHT') || msg.toLowerCase().includes('weight')) {
      return {
        title: t.alertWeightDropTitle,
        icon: Scale,
        iconBg: 'bg-amber-100 text-amber-700',
        badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
      };
    }
    if (type.includes('SWARM') || type.includes('DISEASE') || type.includes('PEST') || msg.toLowerCase().includes('swarm')) {
      return {
        title: t.alertDiseaseRiskTitle,
        icon: AlertTriangle,
        iconBg: 'bg-orange-100 text-orange-700',
        badgeColor: 'bg-orange-50 text-orange-800 border-orange-200'
      };
    }
    if (type.includes('OFFLINE') || msg.toLowerCase().includes('offline')) {
      return {
        title: t.alertSensorOfflineTitle,
        icon: Radio,
        iconBg: 'bg-sand-200 text-sand-800',
        badgeColor: 'bg-sand-100 text-sand-800 border-sand-300'
      };
    }
    return {
      title: t.alertUnusualTitle,
      icon: AlertCircle,
      iconBg: 'bg-amber-100 text-amber-700',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
    };
  };

  // Sensor connectivity check
  const hasHiveSensor = useMemo(() => {
    if (!selectedHive) return true;
    if (selectedHive.sensorId && selectedHive.sensorId.trim()) return true;
    if (telemetry?.sensorStatus === 'NO_SENSOR') return false;
    if (telemetry?.hasSensor === true) return true;
    if (selectedHive.hasSensor === true) return true;
    const code = (selectedHive.hiveCode || selectedHiveCode || '').toUpperCase();
    if (code.includes('001') || code.includes('002') || code.includes('003') || code.includes('004') || code.includes('005') || code.includes('006')) {
      return true;
    }
    if (selectedHive.hasSensor === false) return false;
    if (telemetry?.hasSensor === false) return false;
    return false;
  }, [selectedHive, selectedHiveCode, telemetry]);

  const isSensorOnline = hasHiveSensor && telemetry?.sensorStatus !== 'OFFLINE';

  // Helper to derive stable, realistic distinct baselines per hive
  const getHiveBaseline = (hiveCode: string, serverTelemetry?: any) => {
    const code = (hiveCode || '').toUpperCase().trim();
    let seed = 0;
    for (let i = 0; i < code.length; i++) {
      seed = (seed * 31 + code.charCodeAt(i)) % 1000;
    }

    let baseTemp = 34.2;
    let baseHumidity = 62.0;
    let baseWeight = 42.5;
    let baseSound = 185;

    if (code.includes('001')) {
      baseTemp = 34.2;
      baseHumidity = 62.0;
      baseWeight = 42.5;
      baseSound = 185;
    } else if (code.includes('002')) {
      baseTemp = 35.6;
      baseHumidity = 66.0;
      baseWeight = 44.8;
      baseSound = 215;
    } else if (code.includes('003')) {
      baseTemp = 33.6;
      baseHumidity = 58.4;
      baseWeight = 41.2;
      baseSound = 180;
    } else if (code.includes('004')) {
      baseTemp = 34.6;
      baseHumidity = 63.5;
      baseWeight = 43.1;
      baseSound = 192;
    } else if (code.includes('005')) {
      baseTemp = 34.0;
      baseHumidity = 60.5;
      baseWeight = 45.0;
      baseSound = 186;
    } else if (code.includes('006')) {
      baseTemp = 34.4;
      baseHumidity = 64.2;
      baseWeight = 40.8;
      baseSound = 190;
    } else {
      baseTemp = 33.5 + (seed % 18) * 0.1;
      baseHumidity = 58.0 + (seed % 12);
      baseWeight = 39.0 + (seed % 10) * 0.8;
      baseSound = 175 + (seed % 30);
    }

    if (serverTelemetry?.latestMetrics?.temperature !== undefined) {
      baseTemp = Number(serverTelemetry.latestMetrics.temperature);
    } else if (serverTelemetry?.currentTemperature !== undefined) {
      baseTemp = Number(serverTelemetry.currentTemperature);
    }

    if (serverTelemetry?.latestMetrics?.humidity !== undefined) {
      baseHumidity = Number(serverTelemetry.latestMetrics.humidity);
    } else if (serverTelemetry?.currentHumidity !== undefined) {
      baseHumidity = Number(serverTelemetry.currentHumidity);
    }

    if (serverTelemetry?.latestMetrics?.scaleWeight !== undefined) {
      baseWeight = Number(serverTelemetry.latestMetrics.scaleWeight);
    } else if (serverTelemetry?.currentWeight !== undefined) {
      baseWeight = Number(serverTelemetry.currentWeight);
    }

    if (serverTelemetry?.latestMetrics?.acousticFrequency !== undefined) {
      baseSound = Number(serverTelemetry.latestMetrics.acousticFrequency);
    } else if (serverTelemetry?.currentAcousticFreq !== undefined) {
      baseSound = Number(serverTelemetry.currentAcousticFreq);
    }

    return { baseTemp, baseHumidity, baseWeight, baseSound };
  };

  // Simulated Live Telemetry State
  const [simulatedTelemetry, setSimulatedTelemetry] = useState<{
    temperature: number;
    humidity: number;
    scaleWeight: number;
    acousticFrequency: number;
    lastUpdatedSecondsAgo: number;
  } | null>(null);

  // Initialize or switch baseline whenever hive changes
  useEffect(() => {
    if (!hasHiveSensor) {
      setSimulatedTelemetry(null);
      return;
    }
    const currentCode = selectedHive?.hiveCode || selectedHiveCode || 'SUN-HIVE-001';
    const base = getHiveBaseline(currentCode, telemetry);
    setSimulatedTelemetry({
      temperature: Number(base.baseTemp.toFixed(1)),
      humidity: Number(base.baseHumidity.toFixed(1)),
      scaleWeight: Number(base.baseWeight.toFixed(2)),
      acousticFrequency: Math.round(base.baseSound),
      lastUpdatedSecondsAgo: 0
    });
  }, [selectedHive?.hiveCode, selectedHiveCode, hasHiveSensor, telemetry]);

  // Live periodic simulation: small realistic gradual fluctuations every ~3.5 seconds
  useEffect(() => {
    if (!hasHiveSensor) return;

    const currentCode = selectedHive?.hiveCode || selectedHiveCode || 'SUN-HIVE-001';
    const base = getHiveBaseline(currentCode, telemetry);

    const liveInterval = setInterval(() => {
      setSimulatedTelemetry(prev => {
        if (!prev) return prev;

        // Temperature: subtle ±0.1 to ±0.15°C drift within [32.0, 36.5]
        const tempDelta = (Math.random() - 0.48) * 0.16;
        let newTemp = Math.round((prev.temperature + tempDelta) * 10) / 10;
        const minTemp = Math.max(32.0, base.baseTemp - 0.6);
        const maxTemp = Math.min(36.5, base.baseTemp + 0.6);
        if (newTemp < minTemp) newTemp = minTemp;
        if (newTemp > maxTemp) newTemp = maxTemp;

        // Humidity: subtle ±0.2 to ±0.4% drift within [55, 70]
        const humDelta = (Math.random() - 0.49) * 0.5;
        let newHum = Math.round((prev.humidity + humDelta) * 10) / 10;
        const minHum = Math.max(55.0, base.baseHumidity - 2.0);
        const maxHum = Math.min(70.0, base.baseHumidity + 2.0);
        if (newHum < minHum) newHum = minHum;
        if (newHum > maxHum) newHum = maxHum;

        // Hive Weight: small gradual change around hive's weight (±0.03 to ±0.05 kg)
        const weightDelta = (Math.random() - 0.48) * 0.05;
        let newWeight = Math.round((prev.scaleWeight + weightDelta) * 100) / 100;
        const minWeight = base.baseWeight - 0.4;
        const maxWeight = base.baseWeight + 0.5;
        if (newWeight < minWeight) newWeight = minWeight;
        if (newWeight > maxWeight) newWeight = maxWeight;

        // Sound / acoustic frequency: subtle ±2 to ±3 Hz drift around baseline
        const soundDelta = Math.round((Math.random() - 0.5) * 3);
        let newSound = Math.round(prev.acousticFrequency + soundDelta);
        const minSound = base.baseSound - 8;
        const maxSound = base.baseSound + 8;
        if (newSound < minSound) newSound = minSound;
        if (newSound > maxSound) newSound = maxSound;

        return {
          temperature: newTemp,
          humidity: newHum,
          scaleWeight: newWeight,
          acousticFrequency: newSound,
          lastUpdatedSecondsAgo: 0
        };
      });
    }, 3500);

    const timerInterval = setInterval(() => {
      setSimulatedTelemetry(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          lastUpdatedSecondsAgo: prev.lastUpdatedSecondsAgo + 1
        };
      });
    }, 1000);

    return () => {
      clearInterval(liveInterval);
      clearInterval(timerInterval);
    };
  }, [hasHiveSensor, selectedHive?.hiveCode, selectedHiveCode, telemetry]);

  // Safe numerical metrics (dynamically updated in real-time)
  const liveTemp = hasHiveSensor
    ? (simulatedTelemetry?.temperature ?? Number(telemetry?.latestMetrics?.temperature ?? telemetry?.currentTemperature ?? 34.5))
    : null;
  const liveHumidity = hasHiveSensor
    ? (simulatedTelemetry?.humidity ?? Number(telemetry?.latestMetrics?.humidity ?? telemetry?.currentHumidity ?? 58))
    : null;
  const liveWeight = hasHiveSensor
    ? (simulatedTelemetry?.scaleWeight ?? Number(telemetry?.latestMetrics?.scaleWeight ?? telemetry?.currentWeight ?? 42.0))
    : null;
  const liveSound = hasHiveSensor
    ? (simulatedTelemetry?.acousticFrequency ?? Number(telemetry?.latestMetrics?.acousticFrequency ?? telemetry?.currentAcousticFreq ?? 190))
    : null;

  const healthScore = Number(aiInsights?.healthScore ?? aiInsights?.health?.healthScore ?? 85);
  const expectedHoneyKg = Number(
    aiInsights?.yieldForecast?.estimatedYieldMinKg ??
    aiInsights?.productivity?.predictedProductionKg ??
    (dashboard?.assignedHiveCount ? 24.5 : 22.0)
  );

  // Memoized yield forecast data combining multi-input API insights & live telemetry
  const yieldForecastData = useMemo(() => {
    const currentCode = selectedHive?.hiveCode || selectedHiveCode || 'SUN-HIVE-001';
    const serverForecast = aiInsights?.yieldForecast;
    const isMatchingServer = serverForecast && (
      serverForecast.hiveCode === currentCode || 
      String(serverForecast.hiveId) === String((selectedHive as any)?._id || selectedHive?.id || selectedHiveId)
    );

    // Current weight: prefer live weight if sensor connected, else server or baseline
    const currentWeight = liveWeight !== null 
      ? Number(liveWeight.toFixed(1)) 
      : (isMatchingServer && serverForecast ? serverForecast.currentHiveWeightKg : 42.5);

    if (isMatchingServer && serverForecast) {
      return {
        ...serverForecast,
        currentHiveWeightKg: currentWeight
      };
    }

    // Heuristic fallback for immediate UI reactivity when switching hives
    const code = currentCode.toUpperCase();
    const isCerana = (selectedHive?.beeSpecies || '').toLowerCase().includes('cerana');
    const tare = isCerana ? 14 : 18;
    const maxCapacity = isCerana ? 38 : 55;
    const temp = liveTemp ?? (code.includes('002') ? 35.6 : 34.2);
    const hum = liveHumidity ?? (code.includes('002') ? 66.0 : 62.0);
    const sound = liveSound ?? (code.includes('002') ? 215 : 185);

    let dailyGain = 1.3;
    if (code.includes('001')) dailyGain = 1.8;
    else if (code.includes('002')) dailyGain = 0.1;
    else if (code.includes('003')) dailyGain = 1.5;
    else if (code.includes('004')) dailyGain = 1.2;

    const remaining = Math.max(2, maxCapacity - currentWeight);
    let daysToReady = Math.ceil(remaining / Math.max(0.3, dailyGain));
    if (temp > 36.5) daysToReady += 5;
    if (hum > 65) daysToReady += 2;
    daysToReady = Math.max(3, Math.min(28, daysToReady));
    const readyMinDays = Math.max(2, daysToReady - 1);
    const readyMaxDays = daysToReady + 2;

    const surplusKg = Math.max(0, currentWeight - tare);
    const projectedSurplus = surplusKg + (dailyGain * daysToReady * 0.75);
    const minYield = Math.max(8, Math.round(projectedSurplus - 2));
    const maxYield = Math.max(minYield + 3, Math.round(projectedSurplus + 2));

    const now = new Date();
    const startDate = new Date(now.getTime() + readyMinDays * 86400000);
    const endDate = new Date(now.getTime() + readyMaxDays * 86400000);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const harvestWindow = `${startDate.getDate()}–${endDate.getDate()} ${monthNames[endDate.getMonth()]} ${endDate.getFullYear()}`;

    const factors = [];
    if (temp >= 33 && temp <= 35.8) {
      factors.push({ status: 'positive' as const, factor: `Normal brood nest temperature (${temp.toFixed(1)}°C) maintains optimal honey ripening conditions.` });
    } else {
      factors.push({ status: 'warning' as const, factor: `Elevated brood temperature (${temp.toFixed(1)}°C) redirects worker bees from foraging to fan cooling.` });
    }

    if (dailyGain >= 1.0) {
      factors.push({ status: 'positive' as const, factor: `Positive weight accumulation trend (+${dailyGain.toFixed(1)} kg/day) indicates active local nectar foraging.` });
    } else {
      factors.push({ status: 'warning' as const, factor: `Weight gain is slower than usual (+${dailyGain.toFixed(1)} kg/day) due to colony thermal stress or reduced forage.` });
    }

    if (hum <= 65) {
      factors.push({ status: 'positive' as const, factor: `Ideal internal humidity (${hum.toFixed(0)}%) enables rapid natural moisture evaporation below 20%.` });
    } else {
      factors.push({ status: 'warning' as const, factor: `Higher internal humidity (${hum.toFixed(0)}%) may require additional days for bees to dehydrate and cap combs.` });
    }

    if (sound <= 230) {
      factors.push({ status: 'positive' as const, factor: `Stable colony acoustic activity (${Math.round(sound)} Hz) reflects calm comb construction and foraging behavior.` });
    } else {
      factors.push({ status: 'warning' as const, factor: `Elevated acoustic frequency (${Math.round(sound)} Hz) indicates swarming risk which could divide the forager force.` });
    }

    return {
      hiveId: selectedHive?.id || currentCode,
      hiveCode: currentCode,
      estimatedYieldKg: `${minYield}–${maxYield} kg`,
      estimatedYieldMinKg: minYield,
      estimatedYieldMaxKg: maxYield,
      expectedReadyDays: `Approximately ${readyMinDays}–${readyMaxDays} days`,
      expectedReadyDaysMin: readyMinDays,
      expectedReadyDaysMax: readyMaxDays,
      expectedHarvestWindow: harvestWindow,
      forecastConfidence: (dailyGain >= 1.0 && temp <= 35.8) ? 'High' : (dailyGain < 0.5 ? 'Low' : 'Medium'),
      currentHiveWeightKg: currentWeight,
      weightTrendKgPerDay: dailyGain,
      hiveHealthStatus: healthScore >= 80 ? 'Good' : 'Moderate',
      diseaseRiskLevel: (code.includes('002') || temp > 36.5) ? 'Moderate' : 'Low',
      readinessSummary: `Based on recent weight gain (+${dailyGain.toFixed(1)} kg/day) and hive conditions, this hive may be ready for harvest in approximately ${readyMinDays}–${readyMaxDays} days.`,
      whyForecastSummary: 'Forecast is based on recent hive weight increase, bee activity, temperature, humidity and previous production patterns.',
      contributingFactors: factors,
      isDemoSimulation: true
    };
  }, [selectedHive, selectedHiveCode, selectedHiveId, aiInsights, liveWeight, liveTemp, liveHumidity, liveSound, healthScore]);

  // Practical advice selection
  const practicalTip = useMemo(() => {
    if (!hasHiveSensor) {
      return lang === 'hi'
        ? 'छत्ते में कोई सेंसर नहीं जुड़ा है। मैन्युअल निरीक्षण जारी रखें।'
        : 'No sensor connected on this hive. Continue regular manual comb inspections.';
    }
    if (liveTemp !== null && liveTemp > 36.5) return t.tipWarm;
    if (liveWeight !== null && liveWeight < 35.0) return t.tipWeightDrop;
    if (healthScore >= 80) return t.tipHealthy;
    return t.defaultTip;
  }, [hasHiveSensor, liveTemp, liveWeight, healthScore, lang, t]);

  // Hive-specific batch filtering: only show batches for the currently selected hive
  const hiveBatches = useMemo(() => {
    if (!selectedHive) return batches;
    const targetCode = (selectedHive.hiveCode || selectedHiveCode || '').toUpperCase().trim();
    const targetId = String((selectedHive as any)._id || selectedHive.id || '').trim();
    return batches.filter(b => {
      if (b.hiveCode && targetCode && b.hiveCode.toUpperCase().trim() === targetCode) return true;
      const bHiveId = typeof b.hive === 'object' && b.hive !== null ? (b.hive as any)._id || (b.hive as any).id : b.hive;
      if (bHiveId && targetId && String(bHiveId).trim() === targetId) return true;
      return false;
    });
  }, [batches, selectedHive, selectedHiveCode]);

  // Disease Risk severity calculation
  const diseaseRiskSeverity = useMemo(() => {
    if (aiInsights?.diseaseRisk?.riskSeverity) {
      return String(aiInsights.diseaseRisk.riskSeverity).toUpperCase();
    }
    if ((liveTemp !== null && liveTemp > 37.0) || (liveHumidity !== null && liveHumidity > 72) || (liveSound !== null && liveSound > 250)) {
      return 'HIGH';
    }
    if ((liveTemp !== null && liveTemp > 36.2) || (liveHumidity !== null && liveHumidity > 68) || (liveWeight !== null && liveWeight < 35.0)) {
      return 'MEDIUM';
    }
    return 'LOW';
  }, [aiInsights, liveTemp, liveHumidity, liveSound, liveWeight]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#FAF8F5]">
      {/* Toast Notification */}
      {actionMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-forest-900 text-white shadow-xl flex items-center gap-3 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-honey-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* TOP PROFILE & LANGUAGE HEADER */}
      <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex-shrink-0 flex items-center justify-center font-bold shadow-sm">
            <Layers className="w-7 h-7 text-honey-400" />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-forest-950 truncate">
                {dashboard?.fullName || user?.fullName}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex-shrink-0">
                {t.registeredBeekeeper}
              </span>
            </div>
            <p className="text-xs text-sand-700 truncate">
              {t.kvicRegistration}: <strong className="font-mono text-sand-900">{dashboard?.kvicRegistrationNumber || 'KVIC-WB-2026-0891'}</strong> • {t.cooperative}: <span className="font-medium text-forest-900">{dashboard?.cooperativeName || 'Sundarbans Forest Honey Cooperative'}</span>
            </p>
          </div>
        </div>

        {/* Right Actions: Top row (Cluster Badge + Language Selector), Bottom row (Register New Hive + Log Harvest Buttons) */}
        <div className="flex flex-col items-start sm:items-end gap-2.5 flex-shrink-0">
          {/* Row 1: Cluster Badge & Language Selector */}
          <div className="flex items-center gap-2.5 flex-nowrap">
            <div className="px-3 py-1.5 rounded-xl bg-sand-50 border border-sand-200 text-xs text-sand-800 flex items-center gap-1.5 whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 text-honey-600 flex-shrink-0" />
              <span>{t.assignedCluster}:</span>
              <strong className="font-semibold text-forest-950 max-w-[180px] sm:max-w-[240px] truncate" title={dashboard?.clusterName || 'Sundarbans Cluster'}>
                {dashboard?.clusterName || 'Sundarbans Cluster'}
              </strong>
            </div>

            {/* Simple Language Selector: English | हिंदी */}
            <div className="inline-flex items-center p-1 bg-sand-100 rounded-xl border border-sand-300 shadow-inner flex-shrink-0">
              <Globe className="w-3.5 h-3.5 text-sand-600 ml-2 mr-1 flex-shrink-0" />
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  lang === 'en'
                    ? 'bg-forest-900 text-white shadow-sm'
                    : 'text-sand-700 hover:text-forest-950 hover:bg-white/50'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  lang === 'hi'
                    ? 'bg-forest-900 text-white shadow-sm'
                    : 'text-sand-700 hover:text-forest-950 hover:bg-white/50'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Row 2: Action Buttons */}
          <div className="flex items-center gap-2.5 flex-nowrap">
            {/* Register New Hive Button */}
            <button
              type="button"
              onClick={() => setIsRegisterHiveModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-sand-100 hover:bg-sand-200 text-forest-950 font-bold text-xs rounded-xl border border-sand-300 transition shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Box className="w-4 h-4 text-honey-600 flex-shrink-0" />
              <span>{t.registerNewHiveBtn || '+ Register New Hive'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCreatedBatch(null);
                setIsHarvestModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-honey-600 hover:bg-honey-700 text-white font-bold text-xs rounded-xl shadow transition whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 flex-shrink-0" />
              <span>{t.logHarvestBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* HIVE SELECTOR BAR */}
      {dashboard?.hives && dashboard.hives.length > 0 && (
        <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sand-600">
              {t.selectHive}:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {dashboard.hives.map((h) => {
                const isSelected =
                  selectedHive?.hiveCode === h.hiveCode ||
                  selectedHiveCode === h.hiveCode ||
                  selectedHiveId === String((h as any)._id || h.id);
                return (
                  <button
                    key={(h as any)._id || h.id || h.hiveCode}
                    type="button"
                    onClick={() => handleSelectHive(h)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      isSelected
                        ? 'bg-forest-900 text-white shadow-md ring-2 ring-honey-500 scale-[1.03]'
                        : 'bg-sand-50 hover:bg-sand-100 text-sand-800 border border-sand-200'
                    }`}
                  >
                    {h.hiveCode}
                  </button>
                );
              })}

              {/* + Register New Hive button right in Select Hive list */}
              <button
                type="button"
                onClick={() => setIsRegisterHiveModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-honey-50 hover:bg-honey-100 text-honey-900 border border-honey-300 transition shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-honey-600" />
                <span>{t.registerNewHiveBtn || '+ Register New Hive'}</span>
              </button>
            </div>
          </div>

          {selectedHive && (
            <div className="text-xs text-sand-700 flex flex-wrap items-center gap-2">
              <span className="italic">{selectedHive.beeSpecies}</span>
              <span>•</span>
              <span className="font-semibold text-forest-900">{selectedHive.clusterName}</span>
              {(selectedHive as any).locationName && (
                <>
                  <span>•</span>
                  <span className="text-sand-600">{(selectedHive as any).locationName}</span>
                </>
              )}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedHive.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {selectedHive.status}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PRIORITY 1: HIVE HEALTH (छत्ते का स्वास्थ्य) */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-100 pb-4">
          <div>
            <h2 className="font-display text-xl font-bold text-forest-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-honey-600" />
              <span>{t.hiveHealthTitle}</span>
              {selectedHive && (
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-sand-100 text-forest-900">
                  {selectedHive.hiveCode}
                </span>
              )}
            </h2>
            <p className="text-xs text-sand-700 mt-0.5">{t.hiveHealthSubtitle}</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
            {healthScore >= 80 ? t.healthGood : healthScore >= 60 ? t.healthWarning : t.healthCritical}
          </span>
        </div>

        {/* 3 Clear Health Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Overall Health Card */}
          <div className="p-5 rounded-2xl bg-sand-50/70 border border-sand-200/80 space-y-2">
            <span className="text-xs font-semibold text-sand-600 uppercase tracking-wide block">
              {t.overallHealthLabel}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-4xl text-forest-950">
                {healthScore}
              </span>
              <span className="text-xs text-sand-500 font-bold">/ 100</span>
            </div>
            <p className="text-xs font-medium text-emerald-700">
              {healthScore >= 80 ? t.healthGood : healthScore >= 60 ? t.healthWarning : t.healthCritical}
            </p>
          </div>

          {/* Disease Risk Card */}
          <div className="p-5 rounded-2xl bg-sand-50/70 border border-sand-200/80 space-y-2">
            <span className="text-xs font-semibold text-sand-600 uppercase tracking-wide block">
              {t.diseaseRiskLabel}
            </span>
            <div className="flex items-center gap-2 pt-1">
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  aiInsights?.diseaseRisk?.riskSeverity === 'HIGH'
                    ? 'bg-red-500 animate-pulse'
                    : aiInsights?.diseaseRisk?.riskSeverity === 'MEDIUM'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
              <span className="font-display font-bold text-xl text-forest-950">
                {aiInsights?.diseaseRisk?.riskSeverity === 'HIGH'
                  ? t.riskHigh
                  : aiInsights?.diseaseRisk?.riskSeverity === 'MEDIUM'
                  ? t.riskMedium
                  : t.riskLow}
              </span>
            </div>
            <p className="text-xs text-sand-700">
              {aiInsights?.diseaseRisk?.pathogenOrPestName
                ? `${aiInsights.diseaseRisk.pathogenOrPestName} check normal`
                : (lang === 'hi' ? 'कोई बीमारी या कीट का लक्षण नहीं।' : 'No signs of pathogen or mite stress.')}
            </p>
          </div>

          {/* Queen & Colony Mood */}
          <div className="p-5 rounded-2xl bg-sand-50/70 border border-sand-200/80 space-y-2">
            <span className="text-xs font-semibold text-sand-600 uppercase tracking-wide block">
              {t.colonyStatusLabel}
            </span>
            <div className="pt-1">
              <span className="font-display font-bold text-base text-forest-950 block">
                {Number(aiInsights?.swarmingProbability || 0) > 0.35 ? t.colonySwarmWarning : t.colonyNormal}
              </span>
            </div>
            <p className="text-xs text-sand-700">
              {Number(aiInsights?.queenLossRisk || 0) > 0.25
                ? t.colonyQueenLossWarning
                : (lang === 'hi' ? 'ब्रूड पैटर्न स्थिर और सुरक्षित है।' : 'Stable brood nest pattern.')}
            </p>
          </div>
        </div>

        {/* Recommended Action / What to do section (Requirement 4) */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start gap-4 transition-all ${
            diseaseRiskSeverity === 'HIGH'
              ? 'bg-red-50/80 border-red-200 text-red-950'
              : diseaseRiskSeverity === 'MEDIUM'
              ? 'bg-amber-50/80 border-amber-200 text-amber-950'
              : 'bg-sand-50/80 border-sand-200 text-forest-950'
          }`}
        >
          <div className="flex items-center gap-2.5 shrink-0">
            <AlertTriangle
              className={`w-5 h-5 ${
                diseaseRiskSeverity === 'HIGH'
                  ? 'text-red-600 animate-pulse'
                  : diseaseRiskSeverity === 'MEDIUM'
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider block">
                ⚠️ {t.possibleDiseaseRiskTitle}
              </span>
              <span className="text-xs font-semibold">
                {t.diseaseRiskLabel}:{' '}
                <span className="font-bold">
                  {diseaseRiskSeverity === 'HIGH'
                    ? t.riskHigh
                    : diseaseRiskSeverity === 'MEDIUM'
                    ? t.riskMedium
                    : t.riskLow}
                </span>
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-1.5 text-xs">
            <h4 className="font-bold text-sm flex items-center gap-1.5 text-forest-950">
              <span>{t.whatToDoTitle}:</span>
            </h4>
            <ul className="space-y-1 list-disc list-inside font-medium leading-relaxed text-sand-800">
              <li>{t.whatToDoCheckActivity}</li>
              <li>{t.whatToDoCheckSigns}</li>
              <li>{t.whatToDoObserve}</li>
              <li>{t.whatToDoContactExpert}</li>
            </ul>
          </div>
        </div>

        {/* Practical Beekeeper Tip Box */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs text-amber-950 uppercase tracking-wide">
              {t.beekeeperTipTitle}
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              {practicalTip}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRIORITY 2: NOTIFICATIONS & ALERTS (सूचनाएं और चेतावनियाँ) */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold text-forest-950">
                  {t.alertsTitle}
                </h2>
                {activeAlertsCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
                    {activeAlertsCount} {t.statusNew}
                  </span>
                )}
              </div>
              <p className="text-xs text-sand-700 mt-0.5">{t.alertsSubtitle}</p>
            </div>
          </div>

          {/* Alert Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-sand-100 rounded-xl border border-sand-200 self-start sm:self-auto text-xs">
            <button
              type="button"
              onClick={() => setAlertsFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                alertsFilter === 'ALL'
                  ? 'bg-white text-forest-950 shadow-sm'
                  : 'text-sand-700 hover:text-sand-950'
              }`}
            >
              {t.filterAll} ({alerts.length})
            </button>
            <button
              type="button"
              onClick={() => setAlertsFilter('NEW')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                alertsFilter === 'NEW'
                  ? 'bg-white text-forest-950 shadow-sm'
                  : 'text-sand-700 hover:text-sand-950'
              }`}
            >
              {t.filterNew} ({activeAlertsCount})
            </button>
            <button
              type="button"
              onClick={() => setAlertsFilter('RESOLVED')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                alertsFilter === 'RESOLVED'
                  ? 'bg-white text-forest-950 shadow-sm'
                  : 'text-sand-700 hover:text-sand-950'
              }`}
            >
              {t.filterResolved} ({alerts.length - activeAlertsCount})
            </button>
          </div>
        </div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-bold text-emerald-950">{t.noAlertsMessage}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alt) => {
              const alertId = alt._id || alt.id;
              const isNew = alt.status === 'UNREAD';
              const info = getAlertFriendlyInfo(alt);
              const IconComponent = info.icon;

              return (
                <div
                  key={alertId}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isNew
                      ? 'bg-red-50/40 border-red-200 shadow-sm'
                      : 'bg-sand-50/60 border-sand-200 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${info.iconBg}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sm text-forest-950">
                          {info.title}
                        </h4>
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-white border border-sand-300 text-forest-900">
                          {t.hiveLabel}: {alt.hiveCode || selectedHive?.hiveCode || 'HIVE'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isNew
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {isNew ? `● ${t.statusNew}` : `✓ ${t.statusResolved}`}
                        </span>
                      </div>
                      <p className="text-xs text-sand-800 leading-snug font-medium">
                        {alt.message}
                      </p>
                      <div className="pt-0.5">
                        <span className="text-[11px] font-semibold text-amber-900 bg-amber-50/80 border border-amber-200/80 rounded-lg px-2.5 py-1 inline-block">
                          <strong className="text-amber-950">{t.recommendedLabel}:</strong>{' '}
                          {(alt.alertType || '').includes('TEMP') || (alt.message || '').toLowerCase().includes('temperature')
                            ? t.recommendedTempAction
                            : (alt.alertType || '').includes('WEIGHT') || (alt.message || '').toLowerCase().includes('weight')
                            ? t.recommendedWeightAction
                            : (alt.alertType || '').includes('SWARM') || (alt.message || '').toLowerCase().includes('swarm')
                            ? t.recommendedSwarmAction
                            : t.recommendedTempAction}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-sand-500 font-mono pt-0.5">
                        <span>{new Date(alt.createdAt).toLocaleDateString()} {new Date(alt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {alt.valueRecorded && (
                          <span>• Value: {alt.valueRecorded}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mark Resolved Action Button */}
                  {isNew && (
                    <button
                      type="button"
                      onClick={() => handleResolveAlert(alertId)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs transition shrink-0 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.markResolvedBtn}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Optional Demo Trigger bar for testing alerts */}
        <div className="pt-2 border-t border-sand-100 flex flex-wrap items-center justify-between gap-2 text-xs text-sand-600">
          <span className="font-medium">{t.testScenariosLabel}</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleTriggerScenario('HEATWAVE')}
              className="px-2.5 py-1 rounded-lg bg-sand-100 hover:bg-sand-200 text-sand-800 text-[11px] font-semibold transition"
            >
              {t.testHeatwave}
            </button>
            <button
              type="button"
              onClick={() => handleTriggerScenario('WEIGHT_DROP')}
              className="px-2.5 py-1 rounded-lg bg-sand-100 hover:bg-sand-200 text-sand-800 text-[11px] font-semibold transition"
            >
              {t.testWeightDrop}
            </button>
            <button
              type="button"
              onClick={() => handleTriggerScenario('SWARM_ACOUSTIC')}
              className="px-2.5 py-1 rounded-lg bg-sand-100 hover:bg-sand-200 text-sand-800 text-[11px] font-semibold transition"
            >
              {t.testSwarm}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PRIORITY 3: EXPECTED HONEY (अनुमानित शहद - YIELD FORECASTER) */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-sand-200 shadow-sm space-y-6">
        {/* Header with Hive Badge and Demo AI Forecast Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl font-bold text-forest-950 flex items-center gap-2">
                <Scale className="w-5 h-5 text-honey-600" />
                <span>{t.expectedHoneyTitle}</span>
              </h2>
              {selectedHive && (
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-sand-100 text-forest-900 border border-sand-200">
                  {selectedHive.hiveCode}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-sand-600 mt-1">{t.expectedHoneySubtitle}</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300/80 shadow-xs self-start sm:self-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>{t.demoAiForecastBadge}</span>
          </div>
        </div>

        {/* 4 Primary Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Estimated Honey Yield */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-amber-50/40 to-white border border-amber-200/90 shadow-xs space-y-2 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-600" />
                <span>{t.estimatedHarvestLabel}</span>
              </span>
            </div>
            <div className="font-display font-black text-3xl text-forest-950">
              {yieldForecastData.estimatedYieldKg}
            </div>
            <p className="text-xs text-sand-600">
              {lang === 'hi' ? 'कटाई के लिए तैयार अधिशेष शहद' : 'Estimated surplus honey ready for extraction'}
            </p>
          </div>

          {/* 2. Expected Ready */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-emerald-50/40 to-white border border-emerald-200/90 shadow-xs space-y-2 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>{t.expectedReadyLabel}</span>
              </span>
            </div>
            <div className="font-display font-black text-2xl sm:text-3xl text-forest-950">
              {lang === 'hi' 
                ? `लगभग ${yieldForecastData.expectedReadyDaysMin}–${yieldForecastData.expectedReadyDaysMax} दिन` 
                : yieldForecastData.expectedReadyDays}
            </div>
            <p className="text-xs text-sand-600">
              {lang === 'hi' ? 'छत्तों के 80%+ सील होने का समय' : 'Estimated until combs are 80%+ sealed'}
            </p>
          </div>

          {/* 3. Expected Harvest Window */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/90 via-blue-50/40 to-white border border-blue-200/90 shadow-xs space-y-2 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{t.expectedHarvestWindowLabel}</span>
              </span>
            </div>
            <div className="font-display font-bold text-xl sm:text-2xl text-forest-950">
              {yieldForecastData.expectedHarvestWindow}
            </div>
            <p className="text-xs text-sand-600">
              {lang === 'hi' ? 'सर्वोत्तम गुणवत्ता के लिए अनुशंसित अवधि' : 'Optimal window for nectar quality'}
            </p>
          </div>

          {/* 4. Forecast Confidence */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/90 via-purple-50/40 to-white border border-purple-200/90 shadow-xs space-y-2 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>{t.forecastConfidenceLabel}</span>
              </span>
            </div>
            <div className="pt-0.5">
              {yieldForecastData.forecastConfidence === 'High' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'hi' ? 'उच्च (High)' : 'High'}</span>
                </span>
              ) : yieldForecastData.forecastConfidence === 'Medium' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>{lang === 'hi' ? 'मध्यम (Medium)' : 'Medium'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-rose-100 text-rose-900 border border-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-700" />
                  <span>{lang === 'hi' ? 'निम्न (Low)' : 'Low'}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-sand-600">
              {lang === 'hi' ? 'सेंसर व ऐतिहासिक सहसंबंध' : 'Multi-sensor data correlation'}
            </p>
          </div>
        </div>

        {/* 4 Supporting Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-sand-50/70 p-4 rounded-2xl border border-sand-200/70">
          <div className="space-y-1">
            <span className="text-xs font-medium text-sand-600 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-sand-500" />
              <span>{t.currentHiveWeightLabel}</span>
            </span>
            <div className="font-display font-bold text-lg text-forest-950">
              {yieldForecastData.currentHiveWeightKg} kg
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-sand-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.weightTrendLabel}</span>
            </span>
            <div className="font-display font-bold text-lg text-emerald-700">
              +{yieldForecastData.weightTrendKgPerDay.toFixed(1)} kg/{lang === 'hi' ? 'दिन' : 'day'}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-sand-600 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.hiveHealthLabel}</span>
            </span>
            <div className="font-display font-bold text-lg text-emerald-800">
              {yieldForecastData.hiveHealthStatus === 'Optimal' 
                ? (lang === 'hi' ? 'उत्तम (Optimal)' : 'Optimal')
                : (lang === 'hi' ? 'अच्छा (Good)' : 'Good')}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-sand-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
              <span>{t.diseaseRiskLabel}</span>
            </span>
            <div className="font-display font-bold text-lg text-forest-950">
              {yieldForecastData.diseaseRiskLevel === 'Low'
                ? (lang === 'hi' ? 'कम (Low)' : 'Low')
                : yieldForecastData.diseaseRiskLevel === 'Moderate'
                ? (lang === 'hi' ? 'मध्यम (Moderate)' : 'Moderate')
                : (lang === 'hi' ? 'उच्च जोखिम' : 'High')}
            </div>
          </div>
        </div>

        {/* When will it be ready? Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-300/80 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-950">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>{lang === 'hi' ? 'छत्ता कब कटाई के लिए तैयार होगा?' : 'When will it be ready?'}</span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-forest-900 leading-relaxed">
            "{lang === 'hi' 
              ? `हालिया वजन वृद्धि (+${yieldForecastData.weightTrendKgPerDay.toFixed(1)} kg/दिन) और छत्ते की परिस्थितियों के आधार पर, यह छत्ता लगभग ${yieldForecastData.expectedReadyDaysMin}–${yieldForecastData.expectedReadyDaysMax} दिनों में कटाई के लिए तैयार हो सकता है।`
              : yieldForecastData.readinessSummary}"
          </p>
          <p className="text-[11px] text-sand-600 italic">
            * {t.harvestDisclaimer}
          </p>
        </div>

        {/* Why this forecast? Section */}
        <div className="p-5 rounded-2xl bg-sand-50/80 border border-sand-200/80 space-y-3">
          <div>
            <h4 className="text-sm font-bold text-forest-950 flex items-center gap-2">
              <Info className="w-4 h-4 text-honey-700" />
              <span>{t.whyForecastTitle}</span>
            </h4>
            <p className="text-xs text-sand-600 leading-relaxed mt-0.5">
              {t.whyForecastSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
            {yieldForecastData.contributingFactors.map((f: any, idx: number) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border flex items-start gap-2 text-xs font-medium leading-relaxed ${
                  f.status === 'positive'
                    ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-200/80 text-amber-950'
                }`}
              >
                {f.status === 'positive' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <span>
                  {lang === 'hi' ? (
                    f.factor.toLowerCase().includes('temperature') || f.factor.toLowerCase().includes('brood')
                      ? (f.status === 'positive' 
                          ? `सामान्य ब्रूड तापमान (${liveTemp ?? 34.2}°C) शहद पकने के लिए अनुकूल वातावरण बनाए रखता है।`
                          : `अधिक ब्रूड तापमान (${liveTemp ?? 35.6}°C) के कारण मधुमक्खियां ठंडा करने में ऊर्जा लगा रही हैं।`)
                      : f.factor.toLowerCase().includes('weight')
                      ? (f.status === 'positive'
                          ? `सकारात्मक वजन संचय (+${yieldForecastData.weightTrendKgPerDay.toFixed(1)} kg/दिन) सक्रिय मकरंद संचय का संकेत है।`
                          : `वजन संचय की गति सामान्य से धीमी (+${yieldForecastData.weightTrendKgPerDay.toFixed(1)} kg/दिन) है।`)
                      : f.factor.toLowerCase().includes('humidity')
                      ? (f.status === 'positive'
                          ? `अनुकूल आंतरिक नमी (${liveHumidity ?? 62}%) शहद के प्राकृतिक वाष्पीकरण में सहायक है।`
                          : `अधिक आंतरिक नमी (${liveHumidity ?? 66}%) के कारण छत्तों को सील करने में अधिक समय लग सकता है।`)
                      : f.factor.toLowerCase().includes('acoustic') || f.factor.toLowerCase().includes('sound')
                      ? (f.status === 'positive'
                          ? `स्थिर कॉलोनी ध्वनि गतिविधि (${Math.round(liveSound ?? 185)} Hz) शांत और सामान्य कार्यप्रणाली को दर्शाती है।`
                          : `बढ़ी हुई ध्वनि आवृत्ति (${Math.round(liveSound ?? 215)} Hz) कॉलोनी में हलचल या झुंड बनने के जोखिम का संकेत देती है।`)
                      : f.factor
                  ) : f.factor}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. PRIORITY 4: HIVE SENSOR DATA (छत्ते का सेंसर डेटा) */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl font-bold text-forest-950 flex items-center gap-2">
                <Activity className="w-5 h-5 text-honey-600" />
                <span>{t.sensorDataTitle}</span>
              </h2>
              {selectedHive && (
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-forest-900 text-white shadow-xs">
                  {selectedHive.hiveCode}
                </span>
              )}
            </div>
            <p className="text-xs text-sand-700 mt-0.5">{t.sensorDataSubtitle}</p>
          </div>

          {/* Live Sensor Status Badge & Indicators */}
          <div className="flex flex-wrap items-center gap-2">
            {!hasHiveSensor ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sand-100 text-sand-800 border border-sand-300">
                <span className="w-2 h-2 rounded-full bg-sand-400" />
                <span>{t.noSensorConnectedBadge || 'No sensor connected'}</span>
              </span>
            ) : (
              <>
                {/* Live Simulated IoT Data Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  <span>{lang === 'hi' ? 'लाइव • सिम्युलेटेड IoT डेटा' : 'Live • Simulated IoT Data'}</span>
                </span>

                {/* DEMO / SIMULATED SENSOR DATA explicit label */}
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-sand-100 text-sand-700 border border-sand-300">
                  DEMO / SIMULATED SENSOR DATA
                </span>

                {/* Updating indicator */}
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    {simulatedTelemetry?.lastUpdatedSecondsAgo === 0
                      ? (lang === 'hi' ? '● अभी अपडेट हुआ' : '● Just updated')
                      : (lang === 'hi' ? '● लाइव स्ट्रीमिंग' : '● Updating live')}
                  </span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* 4 Easy-To-Read Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Temperature */}
          <div className="p-4 rounded-2xl bg-sand-50/70 border border-sand-200 space-y-1">
            <span className="text-xs font-semibold text-sand-600 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-honey-600" />
              <span>{t.temperatureLabel}</span>
            </span>
            <div className="flex items-baseline gap-1 pt-1">
              <span className={`font-display font-black text-2xl transition-all duration-300 ${hasHiveSensor ? 'text-forest-950' : 'text-sand-400'}`}>
                {hasHiveSensor && liveTemp !== null ? liveTemp.toFixed(1) : '—'}
              </span>
              {hasHiveSensor && <span className="text-xs font-bold text-sand-600">°C</span>}
            </div>
            <p className="text-[11px] font-medium text-sand-600">
              {hasHiveSensor && liveTemp !== null
                ? (liveTemp >= 32 && liveTemp <= 36.5 ? t.statusComfortable : t.statusTooHigh)
                : (lang === 'hi' ? 'कोई सेंसर नहीं' : 'No sensor connected')}
            </p>
            <span className="text-[10px] text-sand-500 block">{t.temperatureNote}</span>
          </div>

          {/* Humidity */}
          <div className="p-4 rounded-2xl bg-sand-50/70 border border-sand-200 space-y-1">
            <span className="text-xs font-semibold text-sand-600 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span>{t.humidityLabel}</span>
            </span>
            <div className="flex items-baseline gap-1 pt-1">
              <span className={`font-display font-black text-2xl transition-all duration-300 ${hasHiveSensor ? 'text-forest-950' : 'text-sand-400'}`}>
                {hasHiveSensor && liveHumidity !== null ? liveHumidity.toFixed(1) : '—'}
              </span>
              {hasHiveSensor && <span className="text-xs font-bold text-sand-600">%</span>}
            </div>
            <p className="text-[11px] font-medium text-sand-600">
              {hasHiveSensor && liveHumidity !== null
                ? (liveHumidity >= 50 && liveHumidity <= 75 ? t.statusComfortable : t.statusTooHigh)
                : (lang === 'hi' ? 'कोई सेंसर नहीं' : 'No sensor connected')}
            </p>
            <span className="text-[10px] text-sand-500 block">{t.humidityNote}</span>
          </div>

          {/* Weight */}
          <div className="p-4 rounded-2xl bg-sand-50/70 border border-sand-200 space-y-1">
            <span className="text-xs font-semibold text-sand-600 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-honey-600" />
              <span>{t.weightLabel}</span>
            </span>
            <div className="flex items-baseline gap-1 pt-1">
              <span className={`font-display font-black text-2xl transition-all duration-300 ${hasHiveSensor ? 'text-forest-950' : 'text-sand-400'}`}>
                {hasHiveSensor && liveWeight !== null ? liveWeight.toFixed(2) : '—'}
              </span>
              {hasHiveSensor && <span className="text-xs font-bold text-sand-600">kg</span>}
            </div>
            <p className="text-[11px] font-medium text-sand-600">
              {hasHiveSensor && liveWeight !== null ? t.statusSteady : (lang === 'hi' ? 'कोई सेंसर नहीं' : 'No sensor connected')}
            </p>
            <span className="text-[10px] text-sand-500 block">{t.weightNote}</span>
          </div>

          {/* Activity / Sound */}
          <div className="p-4 rounded-2xl bg-sand-50/70 border border-sand-200 space-y-1">
            <span className="text-xs font-semibold text-sand-600 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>{t.soundLabel}</span>
            </span>
            <div className="flex items-baseline gap-1 pt-1">
              <span className={`font-display font-black text-2xl transition-all duration-300 ${hasHiveSensor ? 'text-forest-950' : 'text-sand-400'}`}>
                {hasHiveSensor && liveSound !== null ? liveSound.toFixed(0) : '—'}
              </span>
              {hasHiveSensor && <span className="text-xs font-bold text-sand-600">Hz</span>}
            </div>
            <p className="text-[11px] font-medium text-sand-600">
              {hasHiveSensor && liveSound !== null
                ? (liveSound < 220 ? t.statusCalm : t.statusAgitated)
                : (lang === 'hi' ? 'कोई सेंसर नहीं' : 'No sensor connected')}
            </p>
            <span className="text-[10px] text-sand-500 block">{t.soundNote}</span>
          </div>
        </div>

        {!hasHiveSensor && (
          <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200 text-xs text-sand-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-honey-600 shrink-0" />
            <span>
              {lang === 'hi'
                ? 'इस छत्ते पर कोई सेंसर नहीं जुड़ा है। आईओटी नोड स्थापित करने पर आंकड़े लाइव दिखने लगेंगे।'
                : 'No sensor connected on this hive. Live telemetry will stream automatically once an IoT sensor node is installed.'}
            </span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* NEW: COMPUTER VISION & HIVE HEALTH (कंप्यूटर विज़न और छत्ता स्वास्थ्य) */}
      {/* ========================================================================= */}
      <ComputerVisionHiveHealth
        selectedHiveCode={selectedHiveCode || selectedHive?.hiveCode || 'SUN-HIVE-001'}
        lang={lang}
      />

      {/* ========================================================================= */}
      {/* NEW: IoT HARDWARE & DEVICE INVENTORY (आईओटी हार्डवेयर और डिवाइस इन्वेंटरी) */}
      {/* ========================================================================= */}
      <IotHardwareInventory
        hives={dashboard?.hives || []}
        selectedHiveCode={selectedHiveCode || selectedHive?.hiveCode || 'SUN-HIVE-001'}
        onSelectHive={(hCode) => {
          setSelectedHiveCode(hCode);
          const matched = dashboard?.hives?.find(h => h.hiveCode === hCode);
          if (matched) {
            setSelectedHiveId(String((matched as any)._id || matched.id || matched.hiveCode));
          }
        }}
        lang={lang}
      />

      {/* ========================================================================= */}
      {/* NEW: SITUATIONAL & IDLE-TIME RECOMMENDATIONS (बीप्रूफ क्रियात्मक परामर्श) */}
      {/* ========================================================================= */}
      <BeeProofActionAdvisor
        lang={lang}
        selectedHiveCode={selectedHiveCode || selectedHive?.hiveCode || 'SUN-HIVE-001'}
        onTriggerHarvest={() => {
          setCreatedBatch(null);
          setFormData(prev => ({
            ...prev,
            hiveId: String((selectedHive as any)?._id || selectedHive?.id || selectedHive?.hiveCode || prev.hiveId)
          }));
          setIsHarvestModalOpen(true);
        }}
      />

      {/* ========================================================================= */}
      {/* 5. PRIORITY 5: RECENT ACTIVITY & HARVEST BATCHES (हाल की गतिविधियाँ) */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        {/* Batches Table Card */}
        <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-forest-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>{t.recentActivityTitle}</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-sand-100 text-forest-900">
                  {hiveBatches.length}
                </span>
              </h2>
              <p className="text-xs text-sand-700 mt-0.5">
                {t.recentActivitySubtitle} • <strong className="font-mono text-forest-950">{selectedHive?.hiveCode}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setCreatedBatch(null);
                setFormData(prev => ({
                  ...prev,
                  hiveId: String((selectedHive as any)?._id || selectedHive?.id || selectedHive?.hiveCode || prev.hiveId)
                }));
                setIsHarvestModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-honey-600 hover:bg-honey-700 text-white text-xs font-bold rounded-xl transition self-start sm:self-auto shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.logHarvestBtn}</span>
            </button>
          </div>

          {hiveBatches.length === 0 ? (
            <div className="text-center py-10 bg-sand-50/60 rounded-2xl border border-dashed border-sand-300 space-y-2">
              <p className="text-xs text-sand-700 font-medium">{t.noBatchesForHive}</p>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    hiveId: String((selectedHive as any)?._id || selectedHive?.id || selectedHive?.hiveCode || prev.hiveId)
                  }));
                  setIsHarvestModalOpen(true);
                }}
                className="text-xs font-bold text-honey-700 underline hover:text-honey-900"
              >
                {t.logFirstBatchLink}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sand-100/80 text-sand-800 uppercase font-semibold">
                  <tr>
                    <th className="p-3 rounded-l-xl">{t.thBatchId}</th>
                    <th className="p-3">{t.thFlora}</th>
                    <th className="p-3">{t.thHarvestDate}</th>
                    <th className="p-3">{t.thQuantity}</th>
                    <th className="p-3">{t.thStatus}</th>
                    <th className="p-3 text-right rounded-r-xl">{t.thVerificationQr}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100">
                  {hiveBatches.map((b) => (
                    <tr key={b._id || b.id || b.batchNumber} className="hover:bg-sand-50/70 transition">
                      <td className="p-3 font-mono font-bold text-forest-900">{b.batchNumber}</td>
                      <td className="p-3 text-sand-800">{b.floralSource}</td>
                      <td className="p-3 text-sand-800 font-mono">{b.harvestDate}</td>
                      <td className="p-3 font-semibold text-sand-900">{b.totalQuantityKg} kg</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {b.qrCodeUrl && (
                          <a
                            href={b.qrCodeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-honey-700 hover:text-honey-900 underline"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>{t.viewTokenLink}</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Assigned Hives Summary Table */}
        <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-sand-100 pb-3">
            <h3 className="font-display font-bold text-base text-forest-950">
              {t.hivesListTitle} ({dashboard?.hives?.length ?? 0})
            </h3>
            <span className="text-xs font-mono text-sand-600">
              {dashboard?.clusterCode}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-100/80 text-sand-800 uppercase font-semibold">
                <tr>
                  <th className="p-3 rounded-l-xl">{t.thHiveCode}</th>
                  <th className="p-3">{t.thBeeSpecies}</th>
                  <th className="p-3">{t.thInstallDate}</th>
                  <th className="p-3">{t.thLocation}</th>
                  <th className="p-3">{t.thNotes}</th>
                  <th className="p-3 rounded-r-xl">{t.thColonyStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {dashboard?.hives?.map((h) => (
                  <tr key={h.id} className="hover:bg-sand-50/70 transition">
                    <td className="p-3 font-mono font-bold text-forest-900">{h.hiveCode}</td>
                    <td className="p-3 italic text-sand-800">{h.beeSpecies}</td>
                    <td className="p-3 font-mono text-sand-700">{h.installationDate}</td>
                    <td className="p-3 font-mono text-[11px] text-sand-600">
                      {h.latitude ? `${h.latitude.toFixed(4)}, ${h.longitude?.toFixed(4)}` : 'Registered'}
                    </td>
                    <td className="p-3 text-sand-700 max-w-xs truncate">{h.notes || 'Normal condition'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          h.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: LOG HONEY HARVEST BATCH */}
      {/* ========================================================================= */}
      {isHarvestModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-xl rounded-3xl shadow-2xl border border-sand-300 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-forest-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-5 h-5 text-honey-400" />
                <h3 className="font-display font-bold text-base text-white">{t.modalTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHarvestModalOpen(false)}
                className="text-sand-300 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createdBatch ? (
              /* Success Card with Blockchain details & QR Code */
              <div className="p-6 space-y-5">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center gap-3">
                  <Check className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-forest-950 text-sm">{t.modalSuccessTitle}</h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      {t.modalSuccessSubtitle}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-forest-950 text-sand-200 text-xs font-mono space-y-1.5 break-all">
                  <div className="text-honey-400 font-bold uppercase tracking-wider text-[11px]">
                    {t.blockchainProofLabel}
                  </div>
                  <div><span className="text-sand-400">Batch Number: </span><span className="text-white font-bold">{createdBatch.batchNumber}</span></div>
                  <div><span className="text-sand-400">Tx Hash: </span>{createdBatch.blockchainTxHash || 'Recorded'}</div>
                  <div><span className="text-sand-400">State Hash: </span>{createdBatch.stateMerkleRoot || '0x...'}</div>
                  <div><span className="text-sand-400">Block Height: </span>#{createdBatch.blockNumber || 1}</div>
                </div>

                {createdBatch.qrCodeUrl && (
                  <div className="flex justify-center p-2 bg-white rounded-2xl border border-sand-200 max-w-xs mx-auto">
                    <QrCodeDisplay
                      url={createdBatch.qrCodeUrl}
                      batchNumber={createdBatch.batchNumber}
                      size={140}
                    />
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsHarvestModalOpen(false);
                      setCreatedBatch(null);
                      fetchData();
                    }}
                    className="px-6 py-2.5 bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold rounded-xl transition"
                  >
                    {t.btnDone}
                  </button>
                </div>
              </div>
            ) : (
              /* Creation Form */
              <form onSubmit={handleCreateBatch} className="p-6 space-y-4 text-xs">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="font-semibold text-sand-800 block mb-1">
                    {t.labelSelectHive} *
                  </label>
                  <select
                    value={formData.hiveId}
                    onChange={(e) => setFormData({ ...formData, hiveId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-sand-300 bg-white text-sand-900 font-medium focus:ring-2 focus:ring-honey-500 focus:outline-none"
                    required
                  >
                    {dashboard?.hives?.map((h: any) => (
                      <option key={h._id || h.id} value={h._id || h.id}>
                        {h.hiveCode} — {h.beeSpecies} ({h.status})
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-sand-600 mt-0.5 block">
                    {t.selectHiveHint}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-sand-800 block mb-1">
                      {t.labelQuantityKg} *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={formData.quantityKg}
                      onChange={(e) => setFormData({ ...formData, quantityKg: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-sand-300 bg-white text-sand-900 font-mono font-bold focus:ring-2 focus:ring-honey-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-sand-800 block mb-1">
                      {t.labelHarvestDate} *
                    </label>
                    <input
                      type="date"
                      value={formData.harvestDate}
                      onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-sand-300 bg-white text-sand-900 font-medium focus:ring-2 focus:ring-honey-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-sand-800 block mb-1">
                    {t.labelFloralSource} *
                  </label>
                  <input
                    type="text"
                    value={formData.floralSource}
                    onChange={(e) => setFormData({ ...formData, floralSource: e.target.value })}
                    placeholder="e.g. Wild Mangrove Khalisha & Goran"
                    className="w-full p-2.5 rounded-xl border border-sand-300 bg-white text-sand-900 font-medium focus:ring-2 focus:ring-honey-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-sand-800 block mb-1">
                    {t.labelFieldNotes}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    placeholder={t.fieldNotesPlaceholder}
                    className="w-full p-2.5 rounded-xl border border-sand-300 bg-white text-sand-900 font-medium focus:ring-2 focus:ring-honey-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsHarvestModalOpen(false)}
                    className="px-4 py-2 border border-sand-300 rounded-xl text-sand-700 hover:bg-sand-100 font-semibold transition"
                  >
                    {t.btnCancel}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-honey-600 hover:bg-honey-700 text-white font-bold rounded-xl disabled:opacity-50 transition shadow-sm"
                  >
                    {submitting ? t.submittingHarvest : t.btnRecordHarvest}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: REGISTER NEW HIVE */}
      <RegisterHiveModal
        isOpen={isRegisterHiveModalOpen}
        onClose={() => setIsRegisterHiveModalOpen(false)}
        onHiveCreated={handleHiveCreated}
        lang={lang}
        clusterName={dashboard?.clusterName}
        clusterCode={dashboard?.clusterCode}
        suggestedCode={`SUN-HIVE-${String((dashboard?.hives?.length || 0) + 1).padStart(3, '0')}`}
      />
    </div>
  );
};
