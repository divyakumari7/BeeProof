import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  AdminOverview,
  AdminAnalyticsSummary,
  ClusterDto,
  BeekeeperDto,
  HiveDto,
  BatchResponse,
  HiveAlert,
  BlockchainStatsResponse,
  AuditLogDto
} from '../types';
import {
  ShieldCheck,
  Users,
  Layers,
  Grid,
  FileText,
  Activity,
  AlertTriangle,
  Link2,
  Clock,
  CheckCircle2,
  Download,
  ExternalLink,
  RefreshCw,
  Award,
  MapPin,
  Check
} from 'lucide-react';
import { ClusterDrilldownModal } from '../components/ClusterDrilldownModal';
import { MonthlyHoneyProductionChart } from '../components/MonthlyHoneyProductionChart';
import { DbTamperSimulation } from '../components/DbTamperSimulation';

export const AdminPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'beekeepers' | 'clusters' | 'hives' | 'supply-chain' | 'alerts' | 'blockchain' | 'audit-logs'>('overview');

  const [analytics, setAnalytics] = useState<AdminAnalyticsSummary | null>(null);
  const [clusters, setClusters] = useState<ClusterDto[]>([]);
  const [beekeepers, setBeekeepers] = useState<BeekeeperDto[]>([]);
  const [hives, setHives] = useState<HiveDto[]>([]);
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  const [alerts, setAlerts] = useState<HiveAlert[]>([]);
  const [blockchainStats, setBlockchainStats] = useState<BlockchainStatsResponse | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Drilldown modal state
  const [selectedDrilldownClusterId, setSelectedDrilldownClusterId] = useState<number | string | null>(null);

  // Filter states
  const [supplyChainFilter, setSupplyChainFilter] = useState<string>('ALL');
  const [alertFilter, setAlertFilter] = useState<string>('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [anRes, clRes, bkRes, hvRes, btRes, alRes, bcRes, logRes] = await Promise.all([
        api.getAdminAnalyticsSummary(),
        api.getAdminClusters(),
        api.getAdminBeekeepers(),
        api.getAdminHives(),
        api.getAdminAllBatches(),
        api.getAdminAllAlerts(),
        api.getAdminBlockchainStats(),
        api.getAdminAuditLogs(),
      ]);

      if (anRes.success && anRes.data) setAnalytics(anRes.data);
      if (clRes.success && clRes.data) setClusters(clRes.data);
      if (bkRes.success && bkRes.data) setBeekeepers(bkRes.data);
      if (hvRes.success && hvRes.data) setHives(hvRes.data);
      if (btRes.success && btRes.data) setBatches(btRes.data);
      if (alRes.success && alRes.data) setAlerts(alRes.data);
      if (bcRes.success && bcRes.data) setBlockchainStats(bcRes.data);
      if (logRes.success && logRes.data) setAuditLogs(logRes.data);
    } catch (err) {
      console.error('Failed to load Admin analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolveAlert = async (alertId: number | string) => {
    try {
      const res = await api.resolveAlert(alertId);
      if (res.success) {
        setAlerts(prev => prev.map(a =>
          (String((a as any)._id || a.id) === String(alertId))
            ? { ...a, status: 'RESOLVED' }
            : a
        ));
      }
    } catch (err) {
      console.error('Failed to resolve alert', err);
    }
  };

  const handleDownloadAuditCsv = async () => {
    try {
      const csv = await api.downloadAuditLogsCsv();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `beeproof_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download audit CSV', err);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Executive BI Analytics', icon: Grid },
    { id: 'clusters', label: 'Clusters', icon: Layers, badge: clusters.length },
    { id: 'beekeepers', label: 'Beekeepers', icon: Users, badge: beekeepers.length },
    { id: 'hives', label: 'Colony Hives', icon: Activity, badge: hives.length },
    { id: 'supply-chain', label: 'National Supply Chain', icon: FileText, badge: batches.length },
    { id: 'alerts', label: 'Telemetry Alerts', icon: AlertTriangle, badge: alerts.filter(a => a.status !== 'RESOLVED').length },
    { id: 'blockchain', label: 'Blockchain Ledger', icon: Link2 },
    { id: 'audit-logs', label: 'Audit Trail', icon: Clock, badge: auditLogs.length },
  ];

  const filteredBatches = supplyChainFilter === 'ALL'
    ? batches
    : batches.filter(b => b.status === supplyChainFilter);

  const filteredAlerts = alertFilter === 'ALL'
    ? alerts
    : alerts.filter(a => a.status === alertFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-sand-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-forest-900 text-honey-400 flex items-center justify-center font-bold shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold text-forest-950">
                KVIC National Apiculture Oversight & Governance Portal
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-amber-100 text-amber-900 border border-amber-300">
                ADMIN_KVIC
              </span>
            </div>
            <p className="text-xs text-sand-700 mt-0.5">
              Supervising Officer: <strong className="text-forest-950">{user?.fullName}</strong> ({user?.email}) • Khadi and Village Industries Commission
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-sand-300 bg-white hover:bg-sand-50 text-forest-900 font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live BI</span>
          </button>
          <button
            onClick={handleDownloadAuditCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-sand-200 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-forest-900 text-white font-bold shadow-sm'
                    : 'text-sand-800 hover:text-forest-900 hover:bg-sand-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-honey-400' : 'text-sand-700'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-forest-800 text-honey-300' : 'bg-sand-200 text-sand-800'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {loading && !analytics ? (
        <div className="py-24 text-center text-sand-700 text-xs flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-honey-600 border-t-transparent rounded-full animate-spin" />
          <span>Synchronizing national apiculture data streams...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* TAB: EXECUTIVE BI ANALYTICS OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Primary KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-1">
                  <span className="text-[11px] font-bold text-sand-700 uppercase tracking-wide">Total Honey Output</span>
                  <p className="font-display font-bold text-2xl text-honey-600">
                    {Number(analytics?.totalProductionKg ?? 0).toLocaleString()} <span className="text-xs text-forest-900 font-sans">kg</span>
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium">100% NABL Tested</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-1">
                  <span className="text-[11px] font-bold text-sand-700 uppercase tracking-wide">Authenticity Rate</span>
                  <p className="font-display font-bold text-2xl text-emerald-600">
                    {Number(analytics?.authenticityRatePercentage ?? 100).toFixed(1)}%
                  </p>
                  <p className="text-[11px] text-sand-600">0 Counterfeit Detections</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-1">
                  <span className="text-[11px] font-bold text-sand-700 uppercase tracking-wide">Honey Batches</span>
                  <p className="font-display font-bold text-2xl text-forest-950">
                    {analytics?.totalBatchesCount ?? (analytics as any)?.totalBatches ?? batches.length ?? 0}
                  </p>
                  <p className="text-[11px] text-sand-700">
                    {analytics?.certifiedBatchesCount ?? batches.filter(b => ['CERTIFIED', 'PACKAGED', 'DISPATCHED', 'DELIVERED'].includes(b.status)).length ?? 0} Certified on Chain
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-1">
                  <span className="text-[11px] font-bold text-sand-700 uppercase tracking-wide">Monitored Hives</span>
                  <p className="font-display font-bold text-2xl text-forest-950">
                    {analytics?.totalHivesCount ?? (analytics as any)?.totalHives ?? hives.length ?? 0}
                  </p>
                  <div className="flex gap-2 text-[10px] pt-0.5">
                    <span className="text-emerald-700 font-semibold">
                      {analytics?.activeHivesCount ?? (analytics as any)?.activeHives ?? hives.filter(h => h.status === 'ACTIVE').length ?? 0} Active
                    </span>
                    <span className="text-amber-700 font-semibold">
                      {analytics?.warningHivesCount ?? (analytics as any)?.warningHives ?? hives.filter(h => (h.status as any) === 'WARNING').length ?? 0} Warn
                    </span>
                    <span className="text-red-700 font-semibold">
                      {analytics?.criticalHivesCount ?? (analytics as any)?.criticalHives ?? hives.filter(h => (h.status as any) === 'CRITICAL').length ?? 0} Crit
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-1">
                  <span className="text-[11px] font-bold text-sand-700 uppercase tracking-wide">Blockchain Proofs</span>
                  <p className="font-display font-bold text-2xl text-forest-950 font-mono">
                    {analytics?.blockchainVerificationsCount ?? (analytics as any)?.blockchainTransactionsCount ?? batches.length ?? 0}
                  </p>
                  <p className="text-[11px] text-sand-700">SHA-256 Merkle Roots</p>
                </div>
              </div>

              {/* Cluster Leaderboard */}
              <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-honey-600" />
                    <h3 className="font-display font-bold text-base text-forest-950">Top Producing Honey Clusters</h3>
                  </div>
                  <span className="text-xs text-sand-600 font-medium">Ranked by volume</span>
                </div>

                <div className="divide-y divide-sand-100">
                  {(analytics?.clusterRankings && analytics.clusterRankings.length > 0) ? (
                    analytics.clusterRankings.map((rank, idx) => (
                      <div key={rank.clusterId} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-sand-100 text-forest-900 font-bold flex items-center justify-center font-mono text-[11px]">
                            #{idx + 1}
                          </span>
                          <div>
                            <button
                              onClick={() => setSelectedDrilldownClusterId(rank.clusterId)}
                              className="font-bold text-forest-950 hover:text-honey-700 text-left transition-colors"
                            >
                              {rank.clusterName}
                            </button>
                            <p className="text-[11px] text-sand-600">
                              {rank.state} • {rank.beekeeperCount} Beekeepers • {rank.hiveCount} Hives
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-display font-bold text-sm text-honey-700 font-mono">
                            {rank.productionKg} kg
                          </span>
                          <span className="text-[10px] text-sand-600 block">{rank.batchCount} batches</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-6 text-xs text-sand-600 text-center">No regional cluster volume logged yet.</p>
                  )}
                </div>
              </div>

              {/* NEW: Monthly Honey Production Graph */}
              <MonthlyHoneyProductionChart batches={batches} />

              {/* NEW: Cryptographic Integrity & DB Tamper Simulation */}
              <DbTamperSimulation batches={batches} onDataChanged={fetchData} />
            </div>
          )}

          {/* TAB: CLUSTERS */}
          {activeTab === 'clusters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-forest-950">
                  Registered Regional Honey Clusters ({clusters.length})
                </h3>
                <span className="text-xs text-sand-700">Click any cluster card to inspect administrative hierarchy</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {clusters.map((cl) => {
                  const clId = (cl as any)._id || cl.id;
                  const hiveCount = cl.hiveCount ?? (cl as any).totalHives ?? 0;
                  const beekeeperCount = cl.beekeeperCount ?? 0;
                  return (
                    <div
                      key={clId}
                      onClick={() => setSelectedDrilldownClusterId(clId)}
                      className="p-6 rounded-2xl bg-white border border-sand-200 hover:border-honey-500 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-honey-700 font-bold">
                        <span className="px-2 py-0.5 rounded bg-sand-100 text-forest-900">{cl.clusterCode}</span>
                        <span>{cl.state}</span>
                      </div>
                      <h4 className="font-display font-bold text-base text-forest-950 group-hover:text-honey-700 transition-colors">
                        {cl.name}
                      </h4>
                      <p className="text-xs text-sand-700">{cl.region} • {cl.district}</p>

                      <div className="p-3 rounded-xl bg-sand-50 text-xs space-y-1">
                        <span className="text-sand-700 block text-[11px] font-semibold">Predominant Flora:</span>
                        <p className="font-medium text-sand-900">{cl.predominantFlora}</p>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs border-t border-sand-100 font-semibold text-sand-800">
                        <span>{hiveCount} Hives</span>
                        <span>{beekeeperCount} Beekeepers</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: BEEKEEPERS */}
          {activeTab === 'beekeepers' && (
            <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-forest-950">
                  Registered KVIC Beekeepers ({beekeepers.length})
                </h3>
                <span className="text-xs text-sand-700">National Honey Mission Registry</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-sand-100/80 text-sand-800 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Beekeeper Name</th>
                      <th className="p-3">KVIC Registration</th>
                      <th className="p-3">Cooperative</th>
                      <th className="p-3">Assigned Cluster</th>
                      <th className="p-3">Location</th>
                      <th className="p-3 text-right">Assigned Hives</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {beekeepers.map((bk) => {
                      const bkId = (bk as any)._id || bk.id;
                      const beekeeperName = bk.fullName || (bk as any).user?.fullName || 'Not assigned';
                      const clusterName = bk.clusterName || (bk as any).cluster?.name || 'Not assigned';
                      const locationStr = (bk.district && bk.state)
                        ? `${bk.district}, ${bk.state}`
                        : (bk as any).cluster?.district && (bk as any).cluster?.state
                        ? `${(bk as any).cluster.district}, ${(bk as any).cluster.state}`
                        : bk.district || bk.state || 'Not assigned';
                      const hiveCount = bk.hiveCount ?? (bk as any).assignedHiveCount ?? (Array.isArray((bk as any).hives) ? (bk as any).hives.length : 0);

                      return (
                        <tr key={bkId} className="hover:bg-sand-50/70">
                          <td className="p-3 font-semibold text-sand-900">{beekeeperName}</td>
                          <td className="p-3 font-mono text-forest-700">{bk.kvicRegistrationNumber || '—'}</td>
                          <td className="p-3 text-sand-800">{bk.cooperativeName || '—'}</td>
                          <td className="p-3 text-sand-900 font-medium">{clusterName}</td>
                          <td className="p-3 text-sand-800">{locationStr}</td>
                          <td className="p-3 text-right font-bold font-mono">{hiveCount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: COLONY HIVES */}
          {activeTab === 'hives' && (
            <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-forest-950">
                  Monitored Apiary Hives ({hives.length})
                </h3>
                <span className="text-xs text-sand-700">Connected IoT & Sensor Nodes</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-sand-100/80 text-sand-800 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Hive Code</th>
                      <th className="p-3">Cluster</th>
                      <th className="p-3">Assigned Beekeeper</th>
                      <th className="p-3">Bee Species</th>
                      <th className="p-3">Installation Date</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100 font-mono">
                    {hives.map((h) => {
                      const hiveId = (h as any)._id || h.id;
                      const clusterDisplayName = h.clusterName || (h as any).cluster?.name || (h as any).cluster?.clusterCode || 'Not assigned';
                      const beekeeperDisplayName =
                        h.beekeeperName ||
                        (h as any).beekeeper?.user?.fullName ||
                        (h as any).beekeeper?.fullName ||
                        ((h as any).beekeeper?.kvicRegistrationNumber ? `Beekeeper (${(h as any).beekeeper.kvicRegistrationNumber})` : 'Not assigned');
                      const beeSpecies = h.beeSpecies || 'Apis cerana indica';
                      const installDate = h.installationDate || ((h as any).createdAt ? new Date((h as any).createdAt).toISOString().split('T')[0] : 'Not assigned');
                      const hiveStatus = h.status || 'ACTIVE';

                      return (
                        <tr key={hiveId} className="hover:bg-sand-50/70 font-sans">
                          <td className="p-3 font-mono font-bold text-forest-800">{h.hiveCode}</td>
                          <td className="p-3 text-sand-900">{clusterDisplayName}</td>
                          <td className="p-3 text-sand-800 font-medium">{beekeeperDisplayName}</td>
                          <td className="p-3 italic text-sand-800">{beeSpecies}</td>
                          <td className="p-3 text-sand-800 font-mono">{installDate}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              hiveStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                              hiveStatus === 'QUARANTINED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {hiveStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: NATIONAL SUPPLY CHAIN */}
          {activeTab === 'supply-chain' && (
            <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-lg text-forest-950">
                    National Honey Supply Chain ({filteredBatches.length} Batches)
                  </h3>
                  <p className="text-xs text-sand-700">End-to-end state machine tracking across all production stages</p>
                </div>

                {/* Stage Filter */}
                <select
                  value={supplyChainFilter}
                  onChange={(e) => setSupplyChainFilter(e.target.value)}
                  className="text-xs font-semibold px-3 py-2 rounded-xl border border-sand-300 bg-sand-50 text-forest-950"
                >
                  <option value="ALL">All Stages</option>
                  <option value="HARVESTED">HARVESTED</option>
                  <option value="COLLECTED">COLLECTED</option>
                  <option value="IN_PROCESSING">IN_PROCESSING</option>
                  <option value="CERTIFIED">CERTIFIED</option>
                  <option value="PACKAGED">PACKAGED</option>
                  <option value="DISPATCHED">DISPATCHED</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-sand-100/80 text-sand-800 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Batch Number</th>
                      <th className="p-3">Cluster</th>
                      <th className="p-3">Harvest Date</th>
                      <th className="p-3">Floral Source</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Current Status</th>
                      <th className="p-3">Blockchain Hash</th>
                      <th className="p-3 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100 font-sans">
                    {filteredBatches.length === 0 ? (
                      <tr><td colSpan={8} className="p-6 text-center text-sand-600">No batches found for this stage filter.</td></tr>
                    ) : (
                      filteredBatches.map((b) => (
                        <tr key={b.id} className="hover:bg-sand-50/70">
                          <td className="p-3 font-mono font-bold text-forest-950">{b.batchNumber}</td>
                          <td className="p-3 text-sand-900">{b.clusterName}</td>
                          <td className="p-3 text-sand-700">{b.harvestDate}</td>
                          <td className="p-3 text-sand-800">{b.floralSource}</td>
                          <td className="p-3 font-bold font-mono">{b.totalQuantityKg} kg</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 font-mono">
                              {b.status}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[10px] text-sand-600 truncate max-w-[140px]">
                            {b.blockchainTxHash || 'Recorded on-chain'}
                          </td>
                          <td className="p-3 text-right">
                            <a
                              href={`/verify/${b.batchNumber}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-honey-700 font-semibold hover:underline inline-flex items-center gap-1"
                            >
                              <span>Verify</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: TELEMETRY ALERTS */}
          {activeTab === 'alerts' && (
            <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-lg text-forest-950">
                    National Hive Telemetry Anomaly Alerts ({filteredAlerts.length})
                  </h3>
                  <p className="text-xs text-sand-700">Real-time biological triggers: thermoregulation, moisture saturation, colony swarming</p>
                </div>

                <select
                  value={alertFilter}
                  onChange={(e) => setAlertFilter(e.target.value)}
                  className="text-xs font-semibold px-3 py-2 rounded-xl border border-sand-300 bg-sand-50 text-forest-950"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="UNREAD">UNREAD / Active</option>
                  <option value="READ">READ</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>

              <div className="space-y-3">
                {filteredAlerts.length === 0 ? (
                  <div className="p-8 text-center text-sand-600 bg-sand-50 rounded-xl">
                    No alerts match the selected status filter.
                  </div>
                ) : (
                  filteredAlerts.map((al) => {
                    const alertId = (al as any)._id || al.id;
                    const alertTitle = al.title || (al.alertType ? al.alertType.replace(/_/g, ' ') : 'Colony Telemetry Alert');
                    const hiveCode = al.hiveCode || (al.hive && (al.hive.hiveCode || al.hive)) || 'Not assigned';
                    const metricName = al.metric || 'Sensor Metric';
                    const val = al.valueRecorded !== undefined ? al.valueRecorded : al.observedValue;
                    const expected = (al.expectedRange && al.expectedRange.trim()) ? al.expectedRange : 'Not available';
                    const severity = (al.severity || 'MEDIUM').toUpperCase();
                    const remedy = (al.remedy || al.recommendedAction || '').trim() || 'Not available';
                    const message = al.message || al.reason || '';
                    const timestamp = al.createdAt ? new Date(al.createdAt).toLocaleString() : 'Not available';

                    let displayCurrent = al.currentValue;
                    if (!displayCurrent) {
                      if (val !== undefined && val !== null) {
                        const type = (al.alertType || metricName).toUpperCase();
                        const unit = type.includes('TEMP') ? '°C' : type.includes('HUMID') ? '%' : type.includes('WEIGHT') ? 'kg' : type.includes('ACOUSTIC') || type.includes('SWARM') ? 'Hz' : '';
                        displayCurrent = `${val}${unit}`;
                      } else {
                        displayCurrent = 'Not available';
                      }
                    }

                    const isResolved = al.status === 'RESOLVED';

                    return (
                      <div
                        key={alertId}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                          isResolved
                            ? 'bg-sand-50/70 border-sand-200 text-sand-700'
                            : severity === 'CRITICAL'
                            ? 'bg-red-50/80 border-red-200 text-red-950'
                            : severity === 'HIGH'
                            ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                            : 'bg-sand-50/90 border-sand-300 text-forest-950'
                        }`}
                      >
                        <div className="space-y-2 flex-1">
                          {/* Alert Title, Severity & Status Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-display font-bold text-sm text-forest-950">
                              {alertTitle}
                            </h4>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                                severity === 'CRITICAL'
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : severity === 'HIGH'
                                  ? 'bg-orange-100 text-orange-800 border border-orange-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {severity}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isResolved
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-red-100 text-red-800 border border-red-300'
                              }`}
                            >
                              {isResolved ? 'RESOLVED' : al.status || 'UNREAD'}
                            </span>
                          </div>

                          {/* Hive, Metric, Current & Expected Values */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                            <div className="p-2 rounded-xl bg-white/80 border border-sand-200/80">
                              <span className="text-[10px] uppercase font-bold text-sand-500 block">Affected Hive</span>
                              <span className="font-mono font-bold text-forest-900">{hiveCode}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-white/80 border border-sand-200/80">
                              <span className="text-[10px] uppercase font-bold text-sand-500 block">Affected Metric</span>
                              <span className="font-semibold text-sand-800">{metricName}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-white/80 border border-sand-200/80">
                              <span className="text-[10px] uppercase font-bold text-sand-500 block">Actual / Current</span>
                              <span className="font-mono font-bold text-red-700">{displayCurrent}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-white/80 border border-sand-200/80">
                              <span className="text-[10px] uppercase font-bold text-sand-500 block">Expected / Normal</span>
                              <span className="font-mono font-semibold text-sand-700">{expected}</span>
                            </div>
                          </div>

                          {/* Observed Message */}
                          {message && (
                            <p className="text-xs text-sand-800 leading-snug pt-0.5">
                              {message}
                            </p>
                          )}

                          {/* Remedy / Recommended Action */}
                          <div className="pt-1 text-xs">
                            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-sand-800">
                              <strong className="text-amber-950 font-bold">Remedy: </strong>
                              <span className="text-sand-900">{remedy}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Timestamp & Action */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-1 sm:pt-0">
                          <span className="text-[11px] font-mono text-sand-500">
                            {timestamp}
                          </span>
                          {!isResolved && (
                            <button
                              type="button"
                              onClick={() => handleResolveAlert(alertId)}
                              className="px-4 py-2 bg-forest-900 hover:bg-forest-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                            >
                              Mark Resolved
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB: BLOCKCHAIN LEDGER */}
          {activeTab === 'blockchain' && (
            <div className="space-y-6">
              {/* Technical Blockchain Proof Access Banner for KVIC Admin */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-display font-bold text-sm text-forest-950 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-honey-600" />
                    KVIC Admin Technical Blockchain Proof Inspector
                  </h4>
                  <p className="text-xs text-sand-700">
                    Inspect SHA-256 canonical hashing payloads, Anchor Program ID state (`8eLXGBgg...`), REAL Solana Devnet transaction signatures, and test interactive cryptographic tamper detection.
                  </p>
                </div>
                <Link
                  to="/admin/blockchain-proof"
                  className="px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-sm transition shrink-0 inline-flex items-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-honey-400" />
                  <span>Open Blockchain Proof Page</span>
                </Link>
              </div>

              {/* Blockchain Stats Card */}
              <div className="p-6 rounded-2xl bg-forest-950 text-sand-200 border border-sand-800 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-sand-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-honey-400" />
                    <h3 className="font-display font-bold text-base text-white">
                      Solana Devnet Provenance Ledger
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ● NODE {blockchainStats?.nodeStatus || 'ONLINE'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-forest-900/60 border border-sand-800 space-y-1">
                    <span className="text-sand-400 block text-[11px]">Solana Network</span>
                    <p className="text-white font-bold">{blockchainStats?.networkName || 'Solana Devnet'}</p>
                    <p className="text-sand-400 text-[10px] truncate">RPC: {blockchainStats?.rpcUrl || 'https://api.devnet.solana.com'}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-forest-900/60 border border-sand-800 space-y-1">
                    <span className="text-sand-400 block text-[11px]">Anchor Program ID</span>
                    <p className="text-honey-400 font-bold truncate">{blockchainStats?.programId || blockchainStats?.contractAddress}</p>
                    <p className="text-sand-400 text-[10px]">Anchor Rust Program</p>
                  </div>

                  <div className="p-4 rounded-xl bg-forest-900/60 border border-sand-800 space-y-1">
                    <span className="text-sand-400 block text-[11px]">Block Slot & Records</span>
                    <p className="text-white font-bold">Slot #{blockchainStats?.latestBlockNumber || 1}</p>
                    <p className="text-sand-400 text-[10px]">{blockchainStats?.totalBatchesOnChain || 0} Batches Recorded On-Chain</p>
                  </div>
                </div>
              </div>

              {/* On-Chain Records Table */}
              <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-4">
                <h3 className="font-display font-bold text-lg text-forest-950">Solana On-Chain Batch Provenance Proofs</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-sand-100 text-sand-800 uppercase font-semibold">
                      <tr>
                        <th className="p-3">Batch Number</th>
                        <th className="p-3">Solana Tx Signature</th>
                        <th className="p-3">Canonical SHA-256 Hash</th>
                        <th className="p-3">Block Slot</th>
                        <th className="p-3 text-right">Integrity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-100">
                      {batches.map((b) => (
                        <tr key={b.id} className="hover:bg-sand-50">
                          <td className="p-3 font-bold text-forest-900">{b.batchNumber}</td>
                          <td className="p-3 text-sand-600 truncate max-w-[180px]">{b.blockchainTxHash}</td>
                          <td className="p-3 text-sand-600 truncate max-w-[180px]">{b.stateMerkleRoot}</td>
                          <td className="p-3 text-sand-800">#{b.blockNumber || 1}</td>
                          <td className="p-3 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                              <Check className="w-3 h-3" /> VERIFIED
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AUDIT TRAIL */}
          {activeTab === 'audit-logs' && (
            <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-lg text-forest-950">
                    System Audit Trail ({auditLogs.length} Events)
                  </h3>
                  <p className="text-xs text-sand-700">Immutable operational history recorded for compliance and forensic auditing</p>
                </div>
                <button
                  onClick={handleDownloadAuditCsv}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-sand-50/80 border border-sand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-sand-900 font-semibold font-sans">
                        <span className="text-forest-700 font-bold">{log.action}</span>
                        <span className="text-[11px] text-sand-600">by {log.performedBy}</span>
                      </div>
                      <p className="text-sand-700 text-[11px] font-sans">{log.details}</p>
                    </div>
                    <span className="text-[11px] text-sand-500 shrink-0">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cluster Drilldown Modal */}
      {selectedDrilldownClusterId !== null && (
        <ClusterDrilldownModal
          clusterId={selectedDrilldownClusterId}
          onClose={() => setSelectedDrilldownClusterId(null)}
        />
      )}
    </div>
  );
};
