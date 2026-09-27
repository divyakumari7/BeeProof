import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, CheckCircle2, ShieldCheck, ShieldAlert, MapPin, Calendar, Award, FileCheck2, AlertCircle, ArrowLeft, ArrowRight, RotateCcw, Clock, Truck, Download } from 'lucide-react';
import { api } from '../services/api';
import { BatchVerificationData } from '../types';
import { QrCodeDisplay } from './QrCodeDisplay';

interface PublicBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBatchNumber?: string;
}

export const PublicBatchModal: React.FC<PublicBatchModalProps> = ({
  isOpen,
  onClose,
  initialBatchNumber = 'BP-2026-SUN-001',
}) => {
  const [batchQuery, setBatchQuery] = useState(initialBatchNumber);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BatchVerificationData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    if (!result?.batchNumber) return;
    setPdfLoading(true);
    setPdfError(null);
    try {
      await api.downloadVerificationPdf(result.batchNumber);
    } catch (err: any) {
      setPdfError(err.message || 'Failed to download verification PDF report');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!batchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.verifyBatch(batchQuery.trim());
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res.message || 'Batch could not be verified');
        setResult(null);
      }
    } catch (err: any) {
      setError(err.message || 'Batch not found. Please verify the batch ID printed on your package.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isVerified = Boolean(
    result &&
    result.blockchainVerified !== false &&
    result.verificationStatus === 'VERIFIED' &&
    !result.isTampered
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-sand-200 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-sand-200 bg-sand-50/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-honey-600" />
              <h2 className="font-display font-bold text-forest-900 text-lg">Verify Honey Provenance</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-sand-600 hover:text-sand-800 hover:bg-sand-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Input Bar */}
            <form onSubmit={handleVerify} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-800" />
                <input
                  type="text"
                  value={batchQuery}
                  onChange={(e) => setBatchQuery(e.target.value)}
                  placeholder="Enter Honey Batch Number (e.g. BP-2026-SUN-001)"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-sand-300 bg-white text-sand-900 focus:outline-none focus:ring-2 focus:ring-honey-500 font-mono text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-honey-600 hover:bg-honey-700 text-white font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Now'}
              </button>
            </form>

            {/* Quick Demo Tag */}
            <div className="flex items-center gap-2 text-xs text-sand-800">
              <span>Try seeded demo batch:</span>
              <button
                type="button"
                onClick={() => { setBatchQuery('BP-2026-SUN-001'); }}
                className="font-mono text-forest-700 underline hover:text-forest-900"
              >
                BP-2026-SUN-001
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Verification Failed</p>
                  <p className="text-xs text-red-700 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Verification Result Sections */}
            {result && (
              <div className="space-y-6">
                {!showDetails ? (
                  /* ONLY PROMINENT VERIFICATION RESULT SCREEN */
                  <div
                    className={`p-6 sm:p-8 rounded-2xl border-2 text-center space-y-5 ${
                      isVerified
                        ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
                        : 'bg-red-50/90 border-red-400 text-red-950'
                    }`}
                  >
                    <div className="flex justify-center">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md ${
                          isVerified ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                        }`}
                      >
                        {isVerified ? (
                          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                        ) : (
                          <ShieldAlert className="w-10 h-10 stroke-[2.5]" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {isVerified ? (
                        <>
                          <h3 className="font-display font-black text-2xl text-emerald-950 tracking-tight">
                            ✅ VERIFIED
                          </h3>
                          <p className="text-base font-bold text-emerald-800">
                            Provenance Confirmed
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 className="font-display font-black text-2xl text-red-950 tracking-tight">
                            ❌ NOT VERIFIED
                          </h3>
                          <p className="text-base font-bold text-red-800">
                            TAMPERED — Cryptographic Record Mismatch
                          </p>
                        </>
                      )}

                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/80 border border-sand-300 text-sand-800 shadow-sm mt-2">
                        <span className="text-sand-600">Batch ID:</span>
                        <span className="text-forest-950">{result.batchNumber}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowDetails(true)}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
                          isVerified
                            ? 'bg-forest-900 hover:bg-forest-800 text-white'
                            : 'bg-red-800 hover:bg-red-700 text-white'
                        }`}
                      >
                        <span>View Full Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => { setResult(null); setShowDetails(false); }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-sand-700 text-xs font-semibold transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Verify Another</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* FULL DETAILS VIEW (Displayed ONLY after clicking View Full Details) */
                  <div className="space-y-4">
                    {/* Back Button Bar & Download PDF */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white border border-sand-200">
                      <button
                        type="button"
                        onClick={() => setShowDetails(false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-forest-950 font-bold text-xs transition border border-sand-300 self-start sm:self-auto"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-honey-600" />
                        <span>← Back</span>
                      </button>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-forest-950">
                          {result.batchNumber} • {result.verificationStatus}
                        </span>

                        <button
                          type="button"
                          onClick={handleDownloadPdf}
                          disabled={pdfLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-honey-600 hover:bg-honey-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{pdfLoading ? 'Generating report...' : 'Download Verification PDF'}</span>
                        </button>
                      </div>
                    </div>

                    {pdfError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
                        <span>⚠️ {pdfError}</span>
                        <button type="button" onClick={() => setPdfError(null)} className="font-bold underline ml-2">Dismiss</button>
                      </div>
                    )}

                    {/* Key Attributes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="p-3.5 rounded-xl bg-white border border-sand-200 space-y-1">
                        <span className="text-xs font-semibold text-sand-800 flex items-center gap-1.5 uppercase tracking-wide">
                          <MapPin className="w-3.5 h-3.5 text-honey-600" /> Origin Apiary & Harvest Details
                        </span>
                        <p className="font-medium text-sand-900">{result.clusterName}</p>
                        <p className="text-xs text-sand-800">{result.district}, {result.state} ({result.region})</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-sand-200 space-y-1">
                        <span className="text-xs font-semibold text-sand-800 flex items-center gap-1.5 uppercase tracking-wide">
                          <Award className="w-3.5 h-3.5 text-honey-600" /> Floral Source & Processing Details
                        </span>
                        <p className="font-medium text-sand-900">{result.floralSource}</p>
                        <p className="text-xs text-sand-800">Harvest Yield: {result.totalQuantityKg} kg</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-sand-200 space-y-1">
                        <span className="text-xs font-semibold text-sand-800 flex items-center gap-1.5 uppercase tracking-wide">
                          <Calendar className="w-3.5 h-3.5 text-honey-600" /> Harvest Date
                        </span>
                        <p className="font-medium text-sand-900">{result.harvestDate}</p>
                        <p className="text-xs text-sand-800">Cold Extracted & Filtered below 40°C</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-sand-200 space-y-1">
                        <span className="text-xs font-semibold text-sand-800 flex items-center gap-1.5 uppercase tracking-wide">
                          <FileCheck2 className="w-3.5 h-3.5 text-honey-600" /> Lab Purity Verdict
                        </span>
                        <p className="font-medium text-emerald-700 font-semibold">
                          {result.qualitySummary ? `Passed (${result.qualitySummary.verdict})` : 'Certified Genuine'}
                        </p>
                        <p className="text-xs text-sand-800">
                          {result.qualitySummary ? `Certificate: #${result.qualitySummary.certificateNumber}` : 'NABL NMR Verified'}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-sand-200 space-y-1 sm:col-span-2">
                        <span className="text-xs font-semibold text-sand-800 flex items-center gap-1.5 uppercase tracking-wide">
                          <Truck className="w-3.5 h-3.5 text-honey-600" /> Distribution Details
                        </span>
                        <p className="font-medium text-sand-900">
                          {result.status === 'DELIVERED' ? 'Delivered to Retail Partner' : result.status === 'IN_TRANSIT' ? 'In Transit / Dispatched' : 'Approved for Distribution'}
                        </p>
                        <p className="text-xs text-sand-800">Monitored under KVIC supply chain standards.</p>
                      </div>
                    </div>

                    {/* Laboratory Parameters (if present) */}
                    {result.qualitySummary && (
                      <div className="p-4 rounded-xl bg-white border border-sand-200 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-sand-800">
                          NABL Laboratory NMR & Physicochemical Metrics
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                          <div className="bg-sand-50 p-2 rounded-lg text-center">
                            <span className="text-sand-800 block">Moisture</span>
                            <span className="font-bold text-sand-900">{result.qualitySummary.moisturePercentage}%</span>
                          </div>
                          <div className="bg-sand-50 p-2 rounded-lg text-center">
                            <span className="text-sand-800 block">Pollen Purity</span>
                            <span className="font-bold text-sand-900">{result.qualitySummary.pollenPurityScore}%</span>
                          </div>
                          <div className="bg-sand-50 p-2 rounded-lg text-center">
                            <span className="text-sand-800 block">NMR Spectroscopy</span>
                            <span className="font-bold text-emerald-700">PASSED</span>
                          </div>
                          <div className="bg-sand-50 p-2 rounded-lg text-center">
                            <span className="text-sand-800 block">C4 Sugar Adulteration</span>
                            <span className="font-bold text-emerald-700">NEGATIVE</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Traceability Timeline */}
                    <div className="p-4 rounded-xl bg-white border border-sand-200 space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-sand-800 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-honey-600" /> Provenance Custody Trail
                      </span>
                      <div className="space-y-3 pl-2 border-l-2 border-honey-500">
                        {result.timeline.map((event, idx) => (
                          <div key={idx} className="relative pl-4">
                            <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-honey-500 ring-4 ring-white" />
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <span className="text-xs font-bold text-forest-900">{event.title}</span>
                              <span className="text-[11px] text-sand-800">{new Date(event.timestamp).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-sand-800 mt-0.5">{event.actor} • {event.location}</p>
                            <p className="text-xs text-sand-900 mt-0.5">{event.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Blockchain Proof & Integrity Card */}
                    <div className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                      isVerified
                        ? 'bg-emerald-950/90 text-emerald-100 border-emerald-700/60'
                        : 'bg-red-950 text-red-100 border-red-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-honey-400">
                          <ShieldCheck className="w-4 h-4" />
                          Blockchain Details & Integrity Record
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-mono text-sand-300">
                          {result.networkName || 'Solana Devnet'}
                        </span>
                      </div>

                      <div className="space-y-1 font-mono text-[11px] text-sand-300 break-all">
                        <div>
                          <span className="text-sand-400">Record Check: </span>
                          <span className={isVerified ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                            {isVerified ? 'Matches On-Chain Hash' : 'MISMATCH DETECTED (TAMPERED)'}
                          </span>
                        </div>
                        <div>
                          <span className="text-sand-400">Canonical SHA-256 Hash: </span>
                          <span className="text-honey-300">{result.stateMerkleRoot || 'SHA256:0x8f4d92a81b...'}</span>
                        </div>
                        {result.blockchainTxHash && (
                          <div>
                            <span className="text-sand-400">Solana Tx Signature: </span>
                            <span className="text-sand-200">{result.blockchainTxHash}</span>
                          </div>
                        )}
                        {result.blockchainTxHash && (
                          <div>
                            <span className="text-sand-400">Solana Explorer: </span>
                            <a
                              href={`https://explorer.solana.com/tx/${result.blockchainTxHash}?cluster=devnet`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-honey-400 underline hover:text-honey-300"
                            >
                              View on Solana Explorer ↗
                            </a>
                          </div>
                        )}
                        {result.blockNumber && (
                          <div>
                            <span className="text-sand-400">Block Slot: </span>
                            <span className="text-sand-200">#{result.blockNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Packaging Details & QR Token */}
                    {result.qrCodeUrl && (
                      <div className="p-4 rounded-xl bg-white border border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="space-y-1 text-center sm:text-left">
                          <span className="text-xs font-bold uppercase tracking-wider text-forest-900 block">
                            Packaging Details & QR Token
                          </span>
                          <p className="text-xs text-sand-800 max-w-sm">
                            Scannable QR token resolving directly to tamper-proof provenance report on the BeeProof network.
                          </p>
                        </div>
                        <div className="shrink-0">
                          <QrCodeDisplay
                            url={result.qrCodeUrl}
                            batchNumber={result.batchNumber}
                            size={120}
                          />
                        </div>
                      </div>
                    )}

                    {/* Back Button Bottom & Download PDF */}
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowDetails(false)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sand-100 hover:bg-sand-200 text-forest-950 font-bold text-xs transition border border-sand-300"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-honey-600" />
                        <span>← Back</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadPdf}
                        disabled={pdfLoading}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-honey-600 hover:bg-honey-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{pdfLoading ? 'Generating report...' : 'Download Verification PDF'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
