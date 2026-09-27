import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ClusterDrilldownResponse } from '../types';
import { X, Layers, Users, Activity, FileText, AlertTriangle, ShieldCheck, ExternalLink, Link2, MapPin } from 'lucide-react';

interface Props {
  clusterId: number | string;
  onClose: () => void;
}

export const ClusterDrilldownModal: React.FC<Props> = ({ clusterId, onClose }) => {
  const [drilldown, setDrilldown] = useState<ClusterDrilldownResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'beekeepers' | 'hives' | 'batches'>('beekeepers');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrilldown = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getAdminClusterDrilldown(clusterId);
        if (res.success && res.data) {
          setDrilldown(res.data);
        } else {
          setError(res.message || 'Failed to load cluster drilldown');
        }
      } catch (err: any) {
        setError(err.message || 'Error communicating with server');
      } finally {
        setLoading(false);
      }
    };

    fetchDrilldown();
  }, [clusterId]);

  const cluster = drilldown?.cluster;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] w-full max-w-4xl rounded-2xl shadow-2xl border border-sand-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-forest-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-forest-800 text-honey-400 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-white">
                  {cluster ? cluster.name : 'Loading Cluster Drilldown...'}
                </h3>
                {cluster && (
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-forest-800 text-honey-300">
                    {cluster.clusterCode}
                  </span>
                )}
              </div>
              <p className="text-xs text-sand-300">
                Hierarchical administrative oversight: Cluster → Beekeepers → Hives → Honey Batches
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-sand-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="py-20 text-center text-sand-700 text-xs flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-honey-600 border-t-transparent rounded-full animate-spin" />
              <span>Fetching cluster hierarchy...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : drilldown && cluster ? (
            <>
              {/* Cluster Overview Banner */}
              <div className="p-5 rounded-2xl bg-white border border-sand-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-sand-700 block text-[11px] uppercase font-semibold">Location / Biosphere</span>
                  <p className="font-bold text-forest-950 mt-0.5">{cluster.district}, {cluster.state}</p>
                  <p className="text-[11px] text-sand-600">{cluster.region}</p>
                </div>
                <div>
                  <span className="text-sand-700 block text-[11px] uppercase font-semibold">Flora Profile</span>
                  <p className="font-bold text-forest-950 mt-0.5">{cluster.predominantFlora}</p>
                </div>
                <div>
                  <span className="text-sand-700 block text-[11px] uppercase font-semibold">Total Verified Yield</span>
                  <p className="font-display font-bold text-xl text-honey-600 mt-0.5">
                    {drilldown.totalYieldKg} <span className="text-xs text-forest-900 font-sans">kg</span>
                  </p>
                </div>
                <div>
                  <span className="text-sand-700 block text-[11px] uppercase font-semibold">Telemetry Anomaly Alerts</span>
                  <p className={`font-display font-bold text-xl mt-0.5 ${
                    drilldown.activeAlertsCount > 0 ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {drilldown.activeAlertsCount} Active
                  </p>
                </div>
              </div>

              {/* Sub-tabs */}
              <div className="flex border-b border-sand-200 gap-2">
                <button
                  onClick={() => setActiveTab('beekeepers')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors ${
                    activeTab === 'beekeepers'
                      ? 'border-b-2 border-forest-900 text-forest-950 bg-white'
                      : 'text-sand-700 hover:text-forest-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Assigned Beekeepers ({drilldown.beekeepers.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('hives')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors ${
                    activeTab === 'hives'
                      ? 'border-b-2 border-forest-900 text-forest-950 bg-white'
                      : 'text-sand-700 hover:text-forest-900'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Monitored Hives ({drilldown.hives.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('batches')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors ${
                    activeTab === 'batches'
                      ? 'border-b-2 border-forest-900 text-forest-950 bg-white'
                      : 'text-sand-700 hover:text-forest-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Harvest Batches ({drilldown.batches.length})</span>
                </button>
              </div>

              {/* TAB CONTENT: BEEKEEPERS */}
              {activeTab === 'beekeepers' && (
                <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-sand-50 text-sand-800 font-semibold uppercase border-b border-sand-200">
                      <tr>
                        <th className="p-3">Beekeeper Name</th>
                        <th className="p-3">KVIC Reg #</th>
                        <th className="p-3">Cooperative</th>
                        <th className="p-3">Email</th>
                        <th className="p-3 text-right">Assigned Hives</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-100">
                      {drilldown.beekeepers.length === 0 ? (
                        <tr><td colSpan={5} className="p-4 text-center text-sand-600">No beekeepers assigned.</td></tr>
                      ) : (
                        drilldown.beekeepers.map((bk) => (
                          <tr key={(bk as any)._id || bk.id} className="hover:bg-sand-50/60">
                            <td className="p-3 font-semibold text-forest-950">
                              {bk.fullName || (bk as any).user?.fullName || 'Registered Beekeeper'}
                            </td>
                            <td className="p-3 font-mono text-forest-700">{bk.kvicRegistrationNumber || '—'}</td>
                            <td className="p-3 text-sand-800">{bk.cooperativeName || '—'}</td>
                            <td className="p-3 text-sand-600">{bk.email || (bk as any).user?.email || '—'}</td>
                            <td className="p-3 text-right font-mono font-bold">
                              {bk.hiveCount ?? (bk as any).assignedHiveCount ?? 0}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB CONTENT: HIVES */}
              {activeTab === 'hives' && (
                <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-sand-50 text-sand-800 font-semibold uppercase border-b border-sand-200">
                      <tr>
                        <th className="p-3">Hive Code</th>
                        <th className="p-3">Beekeeper</th>
                        <th className="p-3">Bee Species</th>
                        <th className="p-3">Installed</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-100">
                      {drilldown.hives.length === 0 ? (
                        <tr><td colSpan={5} className="p-4 text-center text-sand-600">No hives registered.</td></tr>
                      ) : (
                        drilldown.hives.map((h) => (
                          <tr key={(h as any)._id || h.id} className="hover:bg-sand-50/60">
                            <td className="p-3 font-mono font-bold text-forest-900">{h.hiveCode}</td>
                            <td className="p-3 text-sand-800 font-medium">
                              {h.beekeeperName || (h as any).beekeeper?.user?.fullName || (h as any).beekeeper?.fullName || 'Not assigned'}
                            </td>
                            <td className="p-3 italic text-sand-700">{h.beeSpecies}</td>
                            <td className="p-3 text-sand-600 font-mono">{h.installationDate}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                h.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                                h.status === 'QUARANTINED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {h.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB CONTENT: BATCHES */}
              {activeTab === 'batches' && (
                <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-sand-50 text-sand-800 font-semibold uppercase border-b border-sand-200">
                      <tr>
                        <th className="p-3">Batch Number</th>
                        <th className="p-3">Harvest Date</th>
                        <th className="p-3">Floral Source</th>
                        <th className="p-3">Volume</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Blockchain Hash</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-100 font-sans">
                      {drilldown.batches.length === 0 ? (
                        <tr><td colSpan={6} className="p-4 text-center text-sand-600">No honey batches harvested in this cluster yet.</td></tr>
                      ) : (
                        drilldown.batches.map((b) => (
                          <tr key={b.id} className="hover:bg-sand-50/60">
                            <td className="p-3 font-mono font-bold text-forest-900">{b.batchNumber}</td>
                            <td className="p-3 text-sand-700">{b.harvestDate}</td>
                            <td className="p-3 text-sand-800">{b.floralSource}</td>
                            <td className="p-3 font-bold font-mono">{b.totalQuantityKg} kg</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                {b.status}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-[10px] text-sand-600 truncate max-w-[150px]">
                              {b.blockchainTxHash || 'Pending'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-sand-100/60 border-t border-sand-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-forest-900 text-white rounded-xl text-xs font-semibold"
          >
            Close Drilldown
          </button>
        </div>
      </div>
    </div>
  );
};
