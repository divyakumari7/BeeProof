import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { BatchVerificationData } from '../types';
import { QrCodeDisplay } from '../components/QrCodeDisplay';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Award,
  FileCheck2,
  Search,
  ArrowLeft,
  ArrowRight,
  Clock,
  RotateCcw,
  Truck,
  Download
} from 'lucide-react';

export const ConsumerVerificationPage: React.FC = () => {
  const { batchNumber } = useParams<{ batchNumber: string }>();
  const [query, setQuery] = useState(batchNumber || 'BP-2026-SUN-001');
  const [data, setData] = useState<BatchVerificationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasVerified, setHasVerified] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    if (!data?.batchNumber) return;
    setPdfLoading(true);
    setPdfError(null);
    try {
      await api.downloadVerificationPdf(data.batchNumber);
    } catch (err: any) {
      setPdfError(err.message || 'Failed to download verification PDF report');
    } finally {
      setPdfLoading(false);
    }
  };

  const executeVerification = async (batchId: string) => {
    const cleanId = batchId.trim();
    if (!cleanId) return;

    setLoading(true);
    setError(null);
    setShowDetails(false);

    try {
      const res = await api.verifyBatch(cleanId);
      if (res.success && res.data) {
        setData(res.data);
        setHasVerified(true);
      } else {
        setError(res.message || 'Batch could not be verified.');
        setData(null);
        setHasVerified(false);
      }
    } catch (err: any) {
      setError(err.message || 'Batch not found. Please verify the batch ID.');
      setData(null);
      setHasVerified(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (batchNumber) {
      const clean = batchNumber.trim();
      setQuery(clean);
      // Consumer scanned physical QR code or navigated to /verify/{batchId}:
      // Run the existing backend verification automatically!
      executeVerification(clean);
    } else {
      setHasVerified(false);
      setShowDetails(false);
      setData(null);
      setError(null);
    }
  }, [batchNumber]);

  const handleVerify = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await executeVerification(query);
  };

  const handleReset = () => {
    setHasVerified(false);
    setShowDetails(false);
    setData(null);
    setError(null);
  };

  const isVerified = Boolean(
    data?.blockchainVerified === true &&
    data?.verificationStatus === 'VERIFIED' &&
    !data?.isTampered
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest-900 hover:text-honey-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to BeeProof</span>
          </Link>
          <span className="text-xs font-mono uppercase tracking-wider text-sand-600">
            Public Consumer Verification
          </span>
        </div>

        {/* STEP 1: INITIAL ARRIVAL SCREEN (Before clicking VERIFY) */}
        {!hasVerified && !loading && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sand-200 shadow-sm space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-700 font-bold shadow-sm">
                <ShieldCheck className="w-9 h-9 text-honey-600" />
              </div>
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-950">
                Honey Provenance Verification
              </h1>
              <p className="text-xs sm:text-sm text-sand-600 leading-relaxed">
                Scan-to-verify cryptographic check. Confirm origin apiary, cold processing, and NABL laboratory certification against the decentralized EVM ledger.
              </p>
            </div>

            {/* Form wrapping input & action to prevent browser reload */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleVerify(e);
              }}
              className="space-y-6"
            >
              {/* Scanned Batch Box */}
              <div className="p-5 rounded-2xl bg-sand-50 border border-sand-200/80 max-w-md mx-auto space-y-3">
                <span className="text-xs font-semibold text-sand-600 uppercase tracking-wider block">
                  Batch Token for Verification
                </span>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. BP-2026-SUN-001"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-300 bg-white text-sand-900 text-sm font-mono font-bold text-center focus:outline-none focus:ring-2 focus:ring-honey-500"
                  />
                </div>

                {/* Demo quick selector */}
                <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-sand-600">
                  <span>Try sample batch:</span>
                  <button
                    type="button"
                    onClick={() => setQuery('BP-2026-SUN-001')}
                    className="font-mono text-forest-700 underline font-semibold hover:text-honey-700"
                  >
                    BP-2026-SUN-001
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setQuery('BP-2026-SUN-009')}
                    className="font-mono text-red-700 underline font-semibold hover:text-red-900"
                  >
                    BP-2026-SUN-009 (Tampered)
                  </button>
                </div>
              </div>

              {/* Primary Action Button: VERIFY */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleVerify(e);
                  }}
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-honey-600 hover:bg-honey-700 text-white font-display font-black text-base shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>{loading ? 'VERIFYING...' : 'VERIFY'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="p-12 rounded-3xl bg-white border border-sand-200 shadow-sm text-center space-y-4">
            <div className="w-10 h-10 border-4 border-honey-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="text-base font-bold text-forest-950">Validating Cryptographic State Proof...</p>
              <p className="text-xs text-sand-600">Comparing local database record against on-chain Merkle root.</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-3 text-center">
            <div className="flex items-center justify-center gap-2 font-bold text-base">
              <XCircle className="w-5 h-5 text-red-600" />
              <span>Verification Unsuccessful</span>
            </div>
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-900 text-xs font-semibold transition"
            >
              Try Another Batch
            </button>
          </div>
        )}

        {/* STEP 2: POST-VERIFICATION RESULTS */}
        {hasVerified && data && !loading && (
          <div className="space-y-6">
            {!showDetails ? (
              /* SCREEN 2A: ONLY THE PROMINENT VERIFICATION RESULT SCREEN */
              <div
                className={`p-8 sm:p-12 rounded-3xl border-2 shadow-lg transition-all text-center space-y-6 ${
                  isVerified
                    ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
                    : 'bg-red-50/90 border-red-400 text-red-950'
                }`}
              >
                {/* Result Icon */}
                <div className="flex justify-center">
                  <div
                    className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-md ${
                      isVerified ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {isVerified ? (
                      <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
                    ) : (
                      <ShieldAlert className="w-12 h-12 stroke-[2.5]" />
                    )}
                  </div>
                </div>

                {/* Exact Prominent Result Titles */}
                <div className="space-y-2 max-w-lg mx-auto">
                  {isVerified ? (
                    <>
                      <h2 className="font-display font-black text-3xl sm:text-4xl text-emerald-950 tracking-tight">
                        ✅ VERIFIED
                      </h2>
                      <p className="text-lg font-bold text-emerald-800 tracking-wide">
                        Provenance Confirmed
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="font-display font-black text-3xl sm:text-4xl text-red-950 tracking-tight">
                        ❌ NOT VERIFIED
                      </h2>
                      <p className="text-lg font-bold text-red-800 tracking-wide">
                        Data may have been tampered
                      </p>
                    </>
                  )}

                  {/* Batch Identifier Pill */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-white/80 border border-sand-300 text-sand-800 shadow-sm mt-3">
                    <span className="text-sand-600">Batch ID:</span>
                    <span className="text-forest-950">{data.batchNumber}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-sand-700 leading-relaxed pt-2">
                    {isVerified
                      ? `Batch ${data.batchNumber} cryptographic record has been reconciled with the blockchain ledger. Harvest origin, processing parameters, laboratory testing, and custody transit are confirmed authentic.`
                      : `Warning: Batch ${data.batchNumber} failed cryptographic data-integrity check. ${data.integrityReason || 'Recorded database values do not match the on-chain Merkle root proof.'}`}
                  </p>
                </div>

                {/* View Full Details Button */}
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDetails(true)}
                    className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all ${
                      isVerified
                        ? 'bg-forest-900 hover:bg-forest-800 text-white hover:shadow-lg'
                        : 'bg-red-800 hover:bg-red-700 text-white hover:shadow-lg'
                    }`}
                  >
                    <span>View Full Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-sand-700 text-xs font-semibold transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Verify Another Batch</span>
                  </button>
                </div>
              </div>
            ) : (
              /* SCREEN 2B: FULL DETAILS VIEW (Displayed ONLY after clicking View Full Details) */
              <div className="space-y-6 animate-fadeIn">
                {/* Back to Verification Result Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-sand-200 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setShowDetails(false)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-forest-950 font-bold text-xs transition border border-sand-300 self-start sm:self-auto"
                  >
                    <ArrowLeft className="w-4 h-4 text-honey-600" />
                    <span>← Back</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-sand-600">Batch:</span>
                      <span className="font-bold text-forest-950">{data.batchNumber}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          isVerified
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {isVerified ? 'VERIFIED' : 'TAMPERED / NOT VERIFIED'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={pdfLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-honey-600 hover:bg-honey-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
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

                {/* Harvest & Origin Apiary Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-sand-200 space-y-1">
                    <span className="text-xs font-semibold text-sand-500 uppercase tracking-wide flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-honey-600" /> Origin Apiary & Harvest Details
                    </span>
                    <p className="font-bold text-forest-950 text-base">{data.clusterName}</p>
                    <p className="text-xs text-sand-600">{data.district}, {data.state} ({data.region})</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-sand-200 space-y-1">
                    <span className="text-xs font-semibold text-sand-500 uppercase tracking-wide flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-honey-600" /> Floral Source & Processing Details
                    </span>
                    <p className="font-bold text-forest-950 text-base">{data.floralSource}</p>
                    <p className="text-xs text-sand-600">Total Harvest Yield: {data.totalQuantityKg} kg</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-sand-200 space-y-1">
                    <span className="text-xs font-semibold text-sand-500 uppercase tracking-wide flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-honey-600" /> Harvest Date
                    </span>
                    <p className="font-bold text-forest-950 text-base">{data.harvestDate}</p>
                    <p className="text-xs text-sand-600">Cold extracted below 40°C</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-sand-200 space-y-1">
                    <span className="text-xs font-semibold text-sand-500 uppercase tracking-wide flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-honey-600" /> Quality Verdict
                    </span>
                    <p className="font-bold text-emerald-700 text-base">
                      {data.qualitySummary ? `Quality Verified (${data.qualitySummary.verdict})` : 'Quality Verified'}
                    </p>
                    <p className="text-xs text-sand-600">
                      {data.qualitySummary?.certificateNumber ? `Cert #${data.qualitySummary.certificateNumber}` : 'NABL Standard Compliant'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-sand-200 space-y-1 sm:col-span-2">
                    <span className="text-xs font-semibold text-sand-500 uppercase tracking-wide flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-honey-600" /> Distribution & Retail Logistics Details
                    </span>
                    <p className="font-bold text-forest-950 text-base">
                      {data.status === 'DELIVERED'
                        ? 'Delivered to Authorized Retailer'
                        : data.status === 'IN_TRANSIT'
                        ? 'Dispatched & In Transit'
                        : 'Certified for Supply Chain Distribution'}
                    </p>
                    <p className="text-xs text-sand-600">
                      End-to-end cold supply chain tracking under KVIC National Honey Mission guidelines.
                    </p>
                  </div>
                </div>

                {/* NABL Laboratory NMR & Physicochemical Metrics */}
                {data.qualitySummary && (
                  <div className="p-6 rounded-2xl bg-white border border-sand-200 space-y-3">
                    <h3 className="font-display font-bold text-sm text-forest-950 uppercase tracking-wider">
                      NABL Laboratory NMR & Physicochemical Metrics
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-sand-50 p-3 rounded-xl text-center border border-sand-200/60">
                        <span className="text-sand-600 block">Moisture Content</span>
                        <span className="font-bold text-forest-950 text-sm mt-0.5 block">
                          {data.qualitySummary.moisturePercentage}%
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">Standard &lt; 20%</span>
                      </div>
                      <div className="bg-sand-50 p-3 rounded-xl text-center border border-sand-200/60">
                        <span className="text-sand-600 block">Pollen Purity</span>
                        <span className="font-bold text-forest-950 text-sm mt-0.5 block">
                          {data.qualitySummary.pollenPurityScore}%
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">Floral Spectrum</span>
                      </div>
                      <div className="bg-sand-50 p-3 rounded-xl text-center border border-sand-200/60">
                        <span className="text-sand-600 block">NMR Spectroscopy</span>
                        <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
                          {data.qualitySummary.nmrSpectroscopyPassed ? 'PASSED' : 'FAILED'}
                        </span>
                        <span className="text-[10px] text-sand-500">Unadulterated</span>
                      </div>
                      <div className="bg-sand-50 p-3 rounded-xl text-center border border-sand-200/60">
                        <span className="text-sand-600 block">C4 Sugar Adulteration</span>
                        <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
                          {data.qualitySummary.c4SugarAdulterationDetected ? 'DETECTED' : 'NEGATIVE'}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">0% Added Sugar</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Provenance Custody Trail (Complete Traceability Timeline) */}
                <div className="p-6 rounded-2xl bg-white border border-sand-200 space-y-4">
                  <h3 className="font-display font-bold text-sm text-forest-950 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-honey-600" />
                    Provenance Custody Trail ({data.timeline?.length || 0} Stages)
                  </h3>

                  <div className="space-y-4 pl-3 border-l-2 border-honey-500 ml-2">
                    {data.timeline?.map((evt, idx) => (
                      <div key={idx} className="relative pl-5">
                        <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-honey-600 ring-4 ring-white" />
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="text-xs font-bold text-forest-900">{evt.title}</span>
                          <span className="text-[11px] text-sand-500 font-mono">
                            {new Date(evt.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-sand-600 mt-0.5 font-medium">{evt.actor} • {evt.location}</p>
                        <p className="text-xs text-sand-800 mt-1">{evt.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Public Blockchain Authenticity Confirmation Card */}
                <div
                  className={`p-4 rounded-xl space-y-2 border text-xs ${
                    isVerified ? 'bg-forest-900 border-forest-700 text-sand-100' : 'bg-red-950 border-red-800 text-red-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-honey-400">
                      <ShieldCheck className="w-4 h-4" />
                      Decentralized Ledger Provenance Record
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-bold text-sand-300">
                      Solana Blockchain Protected
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div>
                      <span className="text-sand-300">Authenticity Status: </span>
                      <span className={isVerified ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {isVerified ? '✅ Confirmed Authentic & Unadulterated' : '❌ Cryptographic Verification Failed (Potential Tampering)'}
                      </span>
                    </div>
                    <p className="text-sand-400 text-[11px]">
                      This batch's origin and quality attributes are immutably timestamped on the Solana Devnet blockchain under KVIC National Honey Mission governance.
                    </p>
                  </div>
                </div>

                {/* Packaging Details & QR Code Display */}
                {data.qrCodeUrl && (
                  <div className="p-6 rounded-2xl bg-white border border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                      <h4 className="font-bold text-forest-950 text-sm">Packaging Details & Consumer QR Token</h4>
                      <p className="text-xs text-sand-600 max-w-sm">
                        Serialized packaging QR code linked to this immutable provenance record on the BeeProof network.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <QrCodeDisplay url={data.qrCodeUrl} batchNumber={data.batchNumber} size={130} />
                    </div>
                  </div>
                )}

                {/* Back to Verification Result Bottom Button & Download PDF */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDetails(false)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-forest-950 font-bold text-xs shadow-sm transition"
                  >
                    <ArrowLeft className="w-4 h-4 text-honey-600" />
                    <span>← Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={pdfLoading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-honey-600 hover:bg-honey-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{pdfLoading ? 'Generating report...' : 'Download Verification PDF'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
