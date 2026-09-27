import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { HiveAiInsightsSummary, HiveDto } from '../types';
import { Sparkles, RefreshCw, AlertTriangle, ShieldCheck, Activity, TrendingUp, Bug, Info, HelpCircle } from 'lucide-react';

interface Props {
  hives: HiveDto[];
}

export const HiveAiInsightsPanel: React.FC<Props> = ({ hives }) => {
  const [selectedHiveId, setSelectedHiveId] = useState<number | string>(hives[0]?.id || 1);
  const [insights, setInsights] = useState<HiveAiInsightsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async (hiveId: number | string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getHiveAiInsights(hiveId);
      if (res.success && res.data) {
        setInsights(res.data);
      } else {
        setError(res.message || 'Failed to fetch AI insights');
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching AI insights');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!selectedHiveId) return;
    setRefreshing(true);
    setError(null);
    try {
      const res = await api.refreshHiveAiPredictions(selectedHiveId);
      if (res.success && res.data) {
        setInsights(res.data);
      } else {
        setError(res.message || 'Refresh failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error during inference refresh');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedHiveId) {
      fetchInsights(selectedHiveId);
    }
  }, [selectedHiveId]);

  const health = insights?.health;
  const prod = insights?.productivity;
  const disease = insights?.diseaseRisk;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 stroke-emerald-500';
    if (score >= 55) return 'text-amber-500 stroke-amber-500';
    return 'text-red-500 stroke-red-500';
  };

  return (
    <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-6 space-y-6">
      {/* Header with Prominent Demo Disclaimer Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl border border-purple-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-forest-950 flex items-center gap-2">
                AI Colony Diagnostics & Predictive Yield
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-purple-100 text-purple-800 border border-purple-300">
                  AI DEMO / PREDICTION
                </span>
              </h3>
              <p className="text-xs text-sand-700">
                Continuous machine learning inference on IoT telemetry, brood thermoregulation, and forage yield models
              </p>
            </div>
          </div>
        </div>

        {/* Controls: Hive Selector & Refresh */}
        <div className="flex items-center gap-3">
          <select
            value={selectedHiveId}
            onChange={(e) => setSelectedHiveId(Number(e.target.value))}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-sand-300 bg-sand-50 text-forest-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            {hives.map((h) => (
              <option key={h.id} value={h.id}>
                Hive {h.hiveCode} ({h.clusterName || 'Regional'})
              </option>
            ))}
          </select>

          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-medium transition-colors disabled:opacity-50 shadow-sm"
            title="Trigger real-time re-inference"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Inferring...' : 'Re-run AI'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sand-700 text-xs flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span>Querying neural predictive microservice...</span>
        </div>
      ) : insights ? (
        <div className="space-y-6">
          {/* Top Row: Health Score & Diagnostics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Health Score Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-sand-50 to-purple-50/30 border border-sand-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sand-800 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-600" />
                  Colony Health Score
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  health?.healthStatus === 'HEALTHY' ? 'bg-emerald-100 text-emerald-800' :
                  health?.healthStatus === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                  {health?.healthStatus}
                </span>
              </div>

              <div className="flex items-center gap-5 my-3">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-sand-200 stroke-current"
                      strokeWidth="3.5"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`${getScoreColor(health?.healthScore || 0)} stroke-current transition-all duration-1000 ease-out`}
                      strokeDasharray={`${health?.healthScore || 0}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-bold font-display text-forest-950">
                      {health?.healthScore ?? '--'}
                    </span>
                    <span className="text-[10px] text-sand-600 block -mt-1">/ 100</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs flex-1">
                  <div className="flex justify-between">
                    <span className="text-sand-700">Risk Severity:</span>
                    <span className="font-semibold text-forest-950">{health?.riskLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sand-700">Swarm Likelihood:</span>
                    <span className="font-semibold text-forest-950">
                      {((health?.swarmingRiskProbability || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sand-700">Queen Loss Risk:</span>
                    <span className="font-semibold text-forest-950">
                      {((health?.queenLossProbability || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="pt-1 text-[10px] text-sand-600 font-mono">
                    Model: {health?.modelVersion}
                  </div>
                </div>
              </div>

              {health?.recommendation && (
                <div className="mt-2 p-2.5 rounded-xl bg-white border border-sand-200 text-xs text-forest-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <p><strong className="text-forest-950">Action:</strong> {health.recommendation}</p>
                </div>
              )}
            </div>

            {/* Health Explainability / Contributing Factors */}
            <div className="p-5 rounded-2xl bg-sand-50/60 border border-sand-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sand-800 flex items-center gap-1.5 mb-3">
                  <HelpCircle className="w-4 h-4 text-forest-700" />
                  Key Telemetry Factors (Explainability)
                </span>
                <div className="space-y-2">
                  {health?.contributingFactors && health.contributingFactors.length > 0 ? (
                    health.contributingFactors.map((f, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-white border border-sand-200 text-xs text-sand-800 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-sand-600 italic">No telemetry factors available.</div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-sand-200 text-[11px] text-sand-600 italic">
                {health?.disclaimer}
              </div>
            </div>

            {/* Disease Risk Module (Demo Inference) */}
            <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Bug className="w-4 h-4 text-amber-700" />
                    Disease Risk Module
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                    {disease?.label || 'Disease Risk (Demo Inference)'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-amber-200/60">
                    <span className="text-sand-700">Target Pathogen:</span>
                    <span className="font-bold text-forest-950">{disease?.pathogenOrPestName}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-amber-200/60">
                    <span className="text-sand-700">Risk Severity:</span>
                    <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                      disease?.riskSeverity === 'LOW' ? 'bg-emerald-100 text-emerald-800' :
                      disease?.riskSeverity === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {disease?.riskSeverity} ({((disease?.detectionProbability || 0) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sand-700">Model Confidence:</span>
                    <span className="font-semibold text-forest-950">
                      {((disease?.confidence || 0) * 100).toFixed(0)}%
                    </span>
                  </div>

                  {disease?.recommendedAction && (
                    <div className="mt-2 p-2.5 rounded-xl bg-white border border-amber-200 text-xs text-sand-900">
                      <span className="font-bold text-amber-900 block mb-0.5">Recommended Intervention:</span>
                      {disease.recommendedAction}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200 text-[10px] text-amber-800 italic">
                {disease?.disclaimer}
              </div>
            </div>
          </div>

          {/* Bottom Row: Productivity / Yield Forecast */}
          <div className="p-5 rounded-2xl bg-sand-50/70 border border-sand-200">
            <div className="flex items-center justify-between mb-4 border-b border-sand-200 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-950 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Productivity & Honey Yield Forecast (Next 21 Days)
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                prod?.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-sand-200 text-sand-800'
              }`}>
                {prod?.status === 'SUCCESS' ? `CONFIDENCE: ${prod?.confidenceIndicator}` : 'DATA INSUFFICIENT'}
              </span>
            </div>

            {prod?.status === 'SUCCESS' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-4 rounded-xl bg-white border border-sand-200 flex flex-col justify-center text-center">
                  <span className="text-xs text-sand-700 block mb-1">Forecast Surplus Honey</span>
                  <span className="font-display font-bold text-3xl text-honey-600">
                    {prod.predictedProductionKg} <span className="text-base text-forest-900">kg</span>
                  </span>
                  <span className="text-[11px] text-sand-600 mt-1">
                    Expected Range: {prod.expectedRangeMinKg} - {prod.expectedRangeMaxKg} kg
                  </span>
                </div>

                <div className="md:col-span-2 p-4 rounded-xl bg-white border border-sand-200 space-y-2">
                  <span className="text-xs font-semibold text-sand-800 block">Biological & Climatic Factors Considered:</span>
                  <ul className="space-y-1.5 text-xs text-sand-800">
                    {prod.contributingFactors?.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-honey-500 mt-1.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 text-[11px] text-sand-600 italic">
                    {prod.disclaimer}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-white border border-sand-200 text-center space-y-2">
                <Info className="w-6 h-6 text-sand-500 mx-auto" />
                <p className="font-semibold text-forest-950 text-xs">{prod?.message || 'Insufficient historical data'}</p>
                <p className="text-xs text-sand-600 max-w-md mx-auto">
                  Yield prediction requires at least 2 physical telemetry snapshots and baseline colony mass measurements. Continue operating telemetry sensors to establish baseline.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
