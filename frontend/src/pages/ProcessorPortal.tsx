import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Database, CheckCircle2, Thermometer, Filter, Package, AlertCircle, Clock, Check, X, QrCode, Lock, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { ProcessorQrModal } from '../components/ProcessorQrModal';

export const ProcessorPortal: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modal States
  const [processingModalBatch, setProcessingModalBatch] = useState<any | null>(null);
  const [packagingModalBatch, setPackagingModalBatch] = useState<any | null>(null);
  const [qrModalBatch, setQrModalBatch] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [filtrationTemp, setFiltrationTemp] = useState('38.5');
  const [meshSize, setMeshSize] = useState('200');
  const [processNotes, setProcessNotes] = useState('Cold micro-filtration executed preserving natural pollen & diastase enzymes');
  const [unitSize, setUnitSize] = useState('500');

  const fetchOverview = async () => {
    try {
      const [overviewRes, batchesRes] = await Promise.all([
        api.getProcessorOverview(),
        api.getProcessorBatches()
      ]);
      if (overviewRes.success) setData(overviewRes.data);
      if (batchesRes.success) setBatches(batchesRes.data);
    } catch (err: any) {
      console.error('Failed to load processor overview', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleCollectBatch = async (batchNumber: string) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await api.processorCollectBatch(batchNumber);
      if (res.success) {
        setActionSuccess(`Batch ${batchNumber} successfully received and collected into facility intake.`);
        fetchOverview();
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to collect batch');
    }
  };

  const handleProcessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!processingModalBatch) return;
    setSubmitting(true);
    setActionError(null);
    try {
      const res = await api.processorProcessBatch(processingModalBatch.batchNumber, {
        filtrationTemperatureCelsius: Number(filtrationTemp),
        filtrationMeshSizeMicrons: Number(meshSize),
        notes: processNotes
      });
      if (res.success) {
        setActionSuccess(`Batch ${processingModalBatch.batchNumber} processing details recorded on blockchain. Status: Ready for Quality Testing.`);
        setProcessingModalBatch(null);
        fetchOverview();
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to process batch');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packagingModalBatch) return;
    setSubmitting(true);
    setActionError(null);
    try {
      const res = await api.processorPackageBatch(packagingModalBatch.batchNumber, {
        unitSizeGrams: Number(unitSize)
      });
      if (res.success) {
        setActionSuccess(`Batch ${packagingModalBatch.batchNumber} successfully packaged into serialized units with QR tokens.`);
        setPackagingModalBatch(null);
        fetchOverview();
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to package batch');
    } finally {
      setSubmitting(false);
    }
  };

  const harvestedBatches = batches.filter(b => b.status === 'HARVESTED');
  const inProcessingBatches = batches.filter(b => b.status === 'COLLECTED');
  const verifiedBatches = batches.filter(b => b.status === 'QUALITY_VERIFIED');
  const packagedBatches = batches.filter(b => ['PACKAGED', 'DISPATCHED', 'DELIVERED'].includes(b.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-800 text-white flex items-center justify-center font-bold">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold text-forest-950">
                Honey Processing Facility Workspace
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-900 border border-blue-300">
                PROCESSOR
              </span>
            </div>
            <p className="text-xs text-sand-800 mt-0.5">
              Operator: <strong className="text-sand-900">{user?.fullName}</strong> • Facility: {data?.facilityName || 'Northern Apex Processing'} ({data?.facilityRegistration || 'FSSAI-PROC-2026-981'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-medium">
            Cold Filtration Standard: &lt; 40°C
          </span>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-red-700 hover:text-red-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Processing to Verification & Packaging Workflow Progression */}
      <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-sm">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
          <div className="flex items-center gap-2 min-w-max">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center font-mono text-[11px]">1</span>
            <span className="font-semibold text-forest-950">Intake & Micro-Filtration</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-sand-400 shrink-0" />
          <div className="flex items-center gap-2 min-w-max">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center font-mono text-[11px]">2</span>
            <span className="font-semibold text-forest-950">NABL Quality Verification</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-sand-400 shrink-0" />
          <div className="flex items-center gap-2 min-w-max">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center font-mono text-[11px]">3</span>
            <span className="font-semibold text-forest-950">Jar Packaging</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-sand-400 shrink-0" />
          <div className="flex items-center gap-2 min-w-max">
            <span className="w-6 h-6 rounded-full bg-honey-500 text-white font-bold flex items-center justify-center font-mono text-[11px]">4</span>
            <span className="font-bold text-honey-700">QR Generation & On-Chain Proof</span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-sand-200 space-y-1">
          <span className="text-xs font-semibold text-sand-800 uppercase tracking-wide">Incoming Honey</span>
          <p className="font-display font-bold text-3xl text-forest-950">{harvestedBatches.length}</p>
          <p className="text-xs text-sand-800">Ready for facility intake</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-sand-200 space-y-1">
          <span className="text-xs font-semibold text-sand-800 uppercase tracking-wide">Batches to Process</span>
          <p className="font-display font-bold text-3xl text-forest-950">{inProcessingBatches.length}</p>
          <p className="text-xs text-blue-700 font-medium">In cold micro-filtration</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-sand-200 space-y-1">
          <span className="text-xs font-semibold text-sand-800 uppercase tracking-wide">Ready for Packaging</span>
          <p className="font-display font-bold text-3xl text-forest-950">{verifiedBatches.length}</p>
          <p className="text-xs text-emerald-700 font-medium">Quality verified by NABL</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-sand-200 space-y-1">
          <span className="text-xs font-semibold text-sand-800 uppercase tracking-wide">Packaged & QR Ready</span>
          <p className="font-display font-bold text-3xl text-honey-600">{packagedBatches.length}</p>
          <p className="text-xs text-emerald-700 font-medium">Serialized QR tokens active</p>
        </div>
      </div>

      {/* Section 1: Incoming Batches (HARVESTED) */}
      <div className="p-6 rounded-2xl bg-white border border-sand-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-forest-950">Incoming Honey Batches</h3>
            <p className="text-xs text-sand-600">Raw comb harvest batches dispatched from registered apiary cooperatives</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sand-100 text-sand-800">
            {harvestedBatches.length} Pending Intake
          </span>
        </div>

        {harvestedBatches.length === 0 ? (
          <p className="text-xs text-sand-600 py-4 text-center">No incoming raw batches waiting for intake.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-100/80 text-sand-800 uppercase font-semibold">
                <tr>
                  <th className="p-3">Batch Number</th>
                  <th className="p-3">Harvest Cluster</th>
                  <th className="p-3">Floral Source</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Harvest Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {harvestedBatches.map((b) => (
                  <tr key={b._id || b.id} className="hover:bg-sand-50/70">
                    <td className="p-3 font-mono font-bold text-forest-900">{b.batchNumber}</td>
                    <td className="p-3 text-sand-900">{b.clusterName}{b.beekeeperName ? ` • ${b.beekeeperName}` : ''}</td>
                    <td className="p-3 text-sand-800">{b.floralSource}</td>
                    <td className="p-3 font-mono font-bold">{b.totalQuantityKg} kg</td>
                    <td className="p-3 text-sand-800">{b.harvestDate}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleCollectBatch(b.batchNumber)}
                        className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs rounded-xl shadow-sm transition"
                      >
                        Receive Batch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Batches to Process (COLLECTED / PROCESSING) */}
      <div className="p-6 rounded-2xl bg-white border border-sand-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-forest-950">Batches to Process</h3>
            <p className="text-xs text-sand-600">Execute unpasteurized cold filtration below 40°C preserving active enzymes</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
            {inProcessingBatches.length} In Queue
          </span>
        </div>

        {inProcessingBatches.length === 0 ? (
          <p className="text-xs text-sand-600 py-4 text-center">No batches currently waiting for processing.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-100/80 text-sand-800 uppercase font-semibold">
                <tr>
                  <th className="p-3">Batch Number</th>
                  <th className="p-3">Floral Source</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {inProcessingBatches.map((b) => (
                  <tr key={b._id || b.id} className="hover:bg-sand-50/70">
                    <td className="p-3 font-mono font-bold text-forest-900">{b.batchNumber}</td>
                    <td className="p-3 text-sand-800">{b.floralSource}</td>
                    <td className="p-3 font-mono font-bold">{b.totalQuantityKg} kg</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setProcessingModalBatch(b)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-forest-900 hover:bg-forest-800 text-white font-medium text-xs rounded-xl shadow-sm transition"
                      >
                        <Filter className="w-3.5 h-3.5 text-honey-400" />
                        <span>Log Cold Filtration</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 3: Ready for Packaging (QUALITY_VERIFIED) */}
      <div className="p-6 rounded-2xl bg-white border border-sand-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-forest-950">Ready for Packaging</h3>
            <p className="text-xs text-sand-600">Batches verified by accredited NABL testing lab ready for serialized jar packaging</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
            {verifiedBatches.length} Quality Verified
          </span>
        </div>

        {verifiedBatches.length === 0 ? (
          <p className="text-xs text-sand-600 py-4 text-center">No batches currently awaiting packaging. Batches require NABL Quality Lab verification first.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-100/80 text-sand-800 uppercase font-semibold">
                <tr>
                  <th className="p-3">Batch Number</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Quality Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {verifiedBatches.map((b) => (
                  <tr key={b._id || b.id} className="hover:bg-sand-50/70">
                    <td className="p-3 font-mono font-bold text-forest-900">{b.batchNumber}</td>
                    <td className="p-3 font-mono font-bold">{b.totalQuantityKg} kg</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        QUALITY_VERIFIED
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setPackagingModalBatch(b)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-honey-600 hover:bg-honey-700 text-white font-medium text-xs rounded-xl shadow-sm transition"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Package Batch</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 4: Packaged Batches & Verification QR Generation */}
      <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-honey-500/20 text-honey-700 flex items-center justify-center font-bold">
                <QrCode className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-base text-forest-950">
                Packaged Batches & Verification Tokens (QR Generation)
              </h3>
            </div>
            <p className="text-xs text-sand-600 mt-0.5">
              Processing → Quality Verification Passed → Packaging → QR Generation
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-honey-100 text-honey-900 border border-honey-300">
            {packagedBatches.length} Serialized Batches
          </span>
        </div>

        {packagedBatches.length === 0 ? (
          <div className="text-center py-8 bg-sand-50/50 rounded-xl border border-dashed border-sand-300 space-y-1">
            <p className="text-xs text-sand-600 font-medium">No packaged batches yet.</p>
            <p className="text-[11px] text-sand-500">Package a quality-verified batch above to generate its serialized consumer verification QR code.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-100/80 text-sand-800 uppercase font-semibold">
                <tr>
                  <th className="p-3">Batch ID</th>
                  <th className="p-3">Floral Source</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Processing</th>
                  <th className="p-3">Quality Lab</th>
                  <th className="p-3">Packaging</th>
                  <th className="p-3 text-right">QR Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {packagedBatches.map((b) => (
                  <tr key={b._id || b.id} className="hover:bg-sand-50/70">
                    <td className="p-3 font-mono font-bold text-forest-900">{b.batchNumber}</td>
                    <td className="p-3 text-sand-800">{b.floralSource}</td>
                    <td className="p-3 font-mono font-bold">{b.totalQuantityKg} kg</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Filtered</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>NABL Passed</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-honey-800 bg-honey-50 px-2 py-0.5 rounded border border-honey-200">
                        <Package className="w-3 h-3 text-honey-600" />
                        <span>{b.status}</span>
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setQrModalBatch(b)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-honey-600 hover:bg-honey-700 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Generate / View QR</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Cold Filtration Logging */}
      {processingModalBatch && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-md rounded-2xl shadow-2xl border border-sand-300 overflow-hidden">
            <div className="bg-forest-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-honey-400" />
                <h3 className="font-bold text-sm">Log Cold Filtration — {processingModalBatch.batchNumber}</h3>
              </div>
              <button onClick={() => setProcessingModalBatch(null)} className="text-sand-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-sand-800 block mb-1">Filtration Temperature (°C) *</label>
                <input
                  type="number"
                  step="0.1"
                  max="42"
                  min="20"
                  value={filtrationTemp}
                  onChange={(e) => setFiltrationTemp(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-white font-mono"
                  required
                />
                <span className="text-[11px] text-sand-600 mt-0.5 block">
                  Must remain below 40°C to preserve invertase & diastase enzymes.
                </span>
              </div>

              <div>
                <label className="font-semibold text-sand-800 block mb-1">Mesh Pore Size (microns)</label>
                <input
                  type="number"
                  value={meshSize}
                  onChange={(e) => setMeshSize(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-sand-800 block mb-1">Processing Notes</label>
                <textarea
                  value={processNotes}
                  onChange={(e) => setProcessNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProcessingModalBatch(null)}
                  className="px-4 py-2 border border-sand-300 rounded-xl text-sand-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl"
                >
                  {submitting ? 'Recording on Blockchain...' : 'Confirm & Finish Processing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Packaging */}
      {packagingModalBatch && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-md rounded-2xl shadow-2xl border border-sand-300 overflow-hidden">
            <div className="bg-forest-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-honey-400" />
                <h3 className="font-bold text-sm">Package Batch — {packagingModalBatch.batchNumber}</h3>
              </div>
              <button onClick={() => setPackagingModalBatch(null)} className="text-sand-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePackageSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-sand-800 block mb-1">Jar Unit Size (grams) *</label>
                <select
                  value={unitSize}
                  onChange={(e) => setUnitSize(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-white"
                >
                  <option value="250">250g Consumer Glass Jar</option>
                  <option value="500">500g Standard Retail Jar</option>
                  <option value="1000">1000g Family Honey Tub</option>
                </select>
              </div>

              <div className="p-3 bg-sand-100 rounded-xl space-y-1">
                <span className="text-sand-600 block">Total Quantity: {packagingModalBatch.totalQuantityKg} kg</span>
                <span className="font-bold text-forest-950 block">
                  Calculated Output: ~{Math.floor((packagingModalBatch.totalQuantityKg * 1000) / Number(unitSize))} Serialized Jars
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPackagingModalBatch(null)}
                  className="px-4 py-2 border border-sand-300 rounded-xl text-sand-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-honey-600 hover:bg-honey-700 text-white font-bold rounded-xl"
                >
                  {submitting ? 'Packaging...' : 'Complete Packaging'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: QR Verification & Token Inspection */}
      <ProcessorQrModal
        batch={qrModalBatch}
        isOpen={Boolean(qrModalBatch)}
        onClose={() => setQrModalBatch(null)}
      />
    </div>
  );
};
