import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FileCheck2, CheckCircle2, ShieldAlert, AlertCircle, Check, X, FlaskConical } from 'lucide-react';

export const QualityLabPortal: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [pendingBatches, setPendingBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Test Modal State
  const [testingBatch, setTestingBatch] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [moisture, setMoisture] = useState('17.8');
  const [pollen, setPollen] = useState('96.2');
  const [nmrPassed, setNmrPassed] = useState('true');
  const [c4Detected, setC4Detected] = useState('false');
  const [certNumber, setCertNumber] = useState('');
  const [notes, setNotes] = useState('Botanical nectar NMR spectroscopy profile matches authentic unadulterated honey standard.');

  const fetchData = async () => {
    try {
      const [overviewRes, pendingRes] = await Promise.all([
        api.getQualityLabOverview(),
        api.getQualityLabPendingBatches()
      ]);
      if (overviewRes.success) setData(overviewRes.data);
      if (pendingRes.success) setPendingBatches(pendingRes.data);
    } catch (err: any) {
      console.error('Failed to load quality lab data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openTestModal = (batch: any) => {
    setTestingBatch(batch);
    setCertNumber(`BP-NABL-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleSubmitTest = async (overrideFail = false) => {
    if (!testingBatch) return;
    setSubmitting(true);
    setActionError(null);
    try {
      const isNmrPass = overrideFail ? false : nmrPassed === 'true';
      const isC4Detected = overrideFail ? true : c4Detected === 'true';

      const res = await api.qualityLabVerifyBatch(testingBatch.batchNumber, {
        moisturePercentage: Number(moisture),
        pollenPurityScore: Number(pollen),
        nmrSpectroscopyPassed: isNmrPass,
        c4SugarAdulterationDetected: isC4Detected,
        certificateNumber: certNumber,
        notes: overrideFail ? 'Adulteration detected. Fails NABL purity standards.' : notes
      });

      if (res.success) {
        setActionSuccess(res.message);
        setTestingBatch(null);
        fetchData();
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to submit test results');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-800 text-white flex items-center justify-center font-bold">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold text-forest-950">
                Accredited NABL Quality Testing Laboratory
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-purple-100 text-purple-900 border border-purple-300">
                QUALITY_LAB
              </span>
            </div>
            <p className="text-xs text-sand-800 mt-0.5">
              Chemist: <strong className="text-sand-900">{user?.fullName}</strong> • Lab: {data?.labName || 'National Agro-Food Quality & NMR Lab'} ({data?.accreditationNumber || 'NABL-TC-8891-2026'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 font-medium">
            NMR Pass Rate: {data?.nmrAssaysPassedRate ?? '100%'}
          </span>
        </div>
      </div>

      {/* Notifications */}
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

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-sand-200 space-y-1">
          <span className="text-xs font-semibold text-sand-800 uppercase tracking-wide">Total Tests Conducted</span>
          <p className="font-display font-bold text-3xl text-forest-950">{data?.totalTestsConducted ?? 0}</p>
          <p className="text-xs text-emerald-700 font-medium">Physicochemical & Spectroscopic Assays</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-sand-200 space-y-1">
          <span className="text-xs font-semibold text-sand-800 uppercase tracking-wide">Batches Waiting for Testing</span>
          <p className="font-display font-bold text-3xl text-forest-950">{pendingBatches.length}</p>
          <p className="text-xs text-purple-700 font-medium">Post-filtration batches in test queue</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-sand-200 space-y-1">
          <span className="text-xs font-semibold text-sand-800 uppercase tracking-wide">Certificates Issued</span>
          <p className="font-display font-bold text-3xl text-forest-950">{data?.reports?.length ?? 0}</p>
          <p className="text-xs text-sand-800">Recorded on Solana Devnet</p>
        </div>
      </div>

      {/* Pending Testing Queue */}
      <div className="p-6 rounded-2xl bg-white border border-sand-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-forest-950">Batches to Test</h3>
            <p className="text-xs text-sand-600">Honey batches in PROCESSING awaiting official NABL laboratory purity assays</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900">
            {pendingBatches.length} In Queue
          </span>
        </div>

        {pendingBatches.length === 0 ? (
          <p className="text-xs text-sand-600 py-4 text-center">No batches currently waiting for quality testing.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-100/80 text-sand-800 uppercase font-semibold">
                <tr>
                  <th className="p-3">Batch Number</th>
                  <th className="p-3">Floral Source</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Harvest Cluster</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {pendingBatches.map((b) => (
                  <tr key={b._id || b.id} className="hover:bg-sand-50/70">
                    <td className="p-3 font-mono font-bold text-forest-900">{b.batchNumber}</td>
                    <td className="p-3 text-sand-800">{b.floralSource}</td>
                    <td className="p-3 font-mono font-bold">{b.totalQuantityKg} kg</td>
                    <td className="p-3 text-sand-800">{b.clusterName}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => openTestModal(b)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-medium text-xs rounded-xl shadow-sm transition"
                      >
                        <FlaskConical className="w-3.5 h-3.5" />
                        <span>Run Purity Assay</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Issued Certificates Table */}
      <div className="p-6 rounded-2xl bg-white border border-sand-200 space-y-4">
        <h3 className="font-display font-bold text-base text-forest-950">Issued Quality Testing Certificates</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand-100/80 text-sand-800 uppercase font-semibold">
              <tr>
                <th className="p-3">Certificate Number</th>
                <th className="p-3">Batch Number</th>
                <th className="p-3">Moisture</th>
                <th className="p-3">Pollen Purity</th>
                <th className="p-3">NMR Spectroscopy</th>
                <th className="p-3">C4 Sugar Check</th>
                <th className="p-3">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100 font-mono">
              {(data?.reports || []).map((r: any) => (
                <tr key={r._id || r.id} className="hover:bg-sand-50/70 font-sans">
                  <td className="p-3 font-mono font-bold text-forest-800">{r.certificateNumber}</td>
                  <td className="p-3 font-mono text-sand-900">{r.batchNumber}</td>
                  <td className="p-3 font-mono">{r.moisturePercentage}%</td>
                  <td className="p-3 font-mono">{r.pollenPurityScore}%</td>
                  <td className={`p-3 font-bold ${r.nmrSpectroscopyPassed ? 'text-emerald-700' : 'text-red-700'}`}>
                    {r.nmrSpectroscopyPassed ? 'PASSED' : 'FAILED'}
                  </td>
                  <td className={`p-3 font-bold ${!r.c4SugarAdulterationDetected ? 'text-emerald-700' : 'text-red-700'}`}>
                    {r.c4SugarAdulterationDetected ? 'DETECTED' : 'NEGATIVE'}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        r.overallVerdict === 'PASS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {r.overallVerdict === 'PASS' ? 'Quality Verified' : 'Failed / On Hold'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Quality Testing */}
      {testingBatch && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-md rounded-2xl shadow-2xl border border-sand-300 overflow-hidden">
            <div className="bg-forest-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-honey-400" />
                <h3 className="font-bold text-sm">Conduct Assay — {testingBatch.batchNumber}</h3>
              </div>
              <button onClick={() => setTestingBatch(null)} className="text-sand-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-sand-800 block mb-1">Moisture Percentage (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={moisture}
                  onChange={(e) => setMoisture(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-white font-mono"
                  required
                />
                <span className="text-[11px] text-sand-600 mt-0.5 block">Standard must be ≤ 20.0%</span>
              </div>

              <div>
                <label className="font-semibold text-sand-800 block mb-1">Pollen Purity Score (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={pollen}
                  onChange={(e) => setPollen(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-sand-800 block mb-1">NMR Spectroscopy</label>
                  <select
                    value={nmrPassed}
                    onChange={(e) => setNmrPassed(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-sand-300 bg-white"
                  >
                    <option value="true">PASSED (Pure)</option>
                    <option value="false">FAILED (Adulterant Peak)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-sand-800 block mb-1">C4 Sugars (Corn/Cane)</label>
                  <select
                    value={c4Detected}
                    onChange={(e) => setC4Detected(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-sand-300 bg-white"
                  >
                    <option value="false">NEGATIVE (0% Added)</option>
                    <option value="true">DETECTED (Adulterated)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-sand-800 block mb-1">Certificate Number *</label>
                <input
                  type="text"
                  value={certNumber}
                  onChange={(e) => setCertNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-sand-800 block mb-1">Chemist Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-white"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleSubmitTest(true)}
                  className="px-3 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-xl font-bold"
                >
                  Fail & Place On Hold
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTestingBatch(null)}
                    className="px-3 py-2 border border-sand-300 rounded-xl text-sand-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSubmitTest(false)}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl"
                  >
                    {submitting ? 'Recording on Chain...' : 'Verify & Pass'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
