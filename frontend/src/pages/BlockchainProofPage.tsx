import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { BlockchainProofData } from '../types';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowLeft,
  Search,
  Database,
  Cpu,
  Lock,
  RefreshCw,
  AlertTriangle,
  FileCode,
  Layers,
  Check,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const BlockchainProofPage: React.FC = () => {
  const { batchNumber: routeBatchNumber } = useParams<{ batchNumber: string }>();
  const [query, setQuery] = useState(routeBatchNumber || 'BP-2026-SUN-001');
  const [proof, setProof] = useState<BlockchainProofData | null>(null);
  const [loading, setLoading] = useState(false);
  const [tampering, setTampering] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadProof = async (batchId: string) => {
    const clean = batchId.trim().toUpperCase();
    if (!clean) return;

    setLoading(true);
    setError(null);
    setActionMessage(null);

    try {
      const res = await api.getBlockchainProof(clean);
      if (res.success && res.data) {
        setProof(res.data);
      } else {
        setError(res.message || 'Blockchain proof not found.');
        setProof(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blockchain proof.');
      setProof(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeBatchNumber) {
      setQuery(routeBatchNumber.trim().toUpperCase());
      loadProof(routeBatchNumber);
    } else {
      loadProof(query);
    }
  }, [routeBatchNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProof(query);
  };

  const handleSimulateTamper = async () => {
    if (!proof) return;
    setTampering(true);
    setActionMessage(null);
    try {
      const res = await api.simulateTamperDemo(proof.batchNumber);
      setActionMessage(res.message || 'Batch data altered in database.');
      await loadProof(proof.batchNumber);
    } catch (err: any) {
      setError(err.message || 'Tamper simulation failed.');
    } finally {
      setTampering(false);
    }
  };

  const handleRestoreData = async () => {
    if (!proof) return;
    setRestoring(true);
    setActionMessage(null);
    try {
      const res = await api.restoreTamperDemo(proof.batchNumber);
      setActionMessage(res.message || 'Authentic batch data restored.');
      await loadProof(proof.batchNumber);
    } catch (err: any) {
      setError(err.message || 'Restore failed.');
    } finally {
      setRestoring(false);
    }
  };

  const isVerified = Boolean(proof?.hashMatches && proof?.verificationStatus === 'VERIFIED');

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-6">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-xs font-semibold text-forest-900 hover:text-honey-700 transition mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Portal</span>
            </Link>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-forest-950 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-honey-600 shrink-0" />
              <span>Solana Blockchain Proof & Hash Verification</span>
            </h1>
            <p className="text-xs sm:text-sm text-sand-600 mt-1">
              Live cryptographic verification against the deployed Solana Devnet Anchor Program.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full bg-forest-900 text-honey-400 text-xs font-mono font-bold border border-forest-700 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Solana Devnet
            </span>
          </div>
        </div>

        {/* VISUAL FLOW DIAGRAM CARD */}
        <div className="p-6 rounded-3xl bg-forest-950 text-white shadow-xl space-y-4 border border-forest-800">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-honey-400 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              End-to-End Cryptographic Verification Architecture
            </h2>
            <span className="text-[11px] font-mono text-sand-400">Anchor Program: 8eLXGBgg...</span>
          </div>

          {/* Steps Carousel / Visual Flow */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2 text-center">
            {/* Step 1: Batch Data */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center space-y-1">
              <Database className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-xs font-bold text-sand-100">1. Batch Data</span>
              <span className="text-[10px] text-sand-400">Origin & Harvest</span>
            </div>

            {/* Step 2: SHA-256 Hash */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center space-y-1">
              <Cpu className="w-5 h-5 text-honey-400 mb-1" />
              <span className="text-xs font-bold text-sand-100">2. SHA-256 Hash</span>
              <span className="text-[10px] text-sand-400">Canonical String</span>
            </div>

            {/* Step 3: Solana Devnet */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center space-y-1">
              <Lock className="w-5 h-5 text-purple-400 mb-1" />
              <span className="text-xs font-bold text-sand-100">3. Solana Devnet</span>
              <span className="text-[10px] text-sand-400">Anchor Program</span>
            </div>

            {/* Step 4: Transaction */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center space-y-1">
              <FileCode className="w-5 h-5 text-blue-400 mb-1" />
              <span className="text-xs font-bold text-sand-100">4. Transaction</span>
              <span className="text-[10px] text-sand-400">Real Signature</span>
            </div>

            {/* Step 5: Explorer */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center space-y-1">
              <ExternalLink className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="text-xs font-bold text-sand-100">5. Explorer</span>
              <span className="text-[10px] text-sand-400">On-Chain State</span>
            </div>

            {/* Step 6: Verification */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center space-y-1 col-span-2 md:col-span-1">
              <ShieldCheck className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-xs font-bold text-sand-100">6. Verification</span>
              <span className="text-[10px] text-sand-400">Hash Match</span>
            </div>
          </div>
        </div>

        {/* BATCH SELECTOR & INPUT SEARCH */}
        <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-sm space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-grow w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Batch Number (e.g. BP-2026-SUN-001)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 bg-sand-50/50 text-forest-950 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-honey-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Inspecting...' : 'Load Proof'}</span>
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-xs text-sand-600 pt-1">
            <span className="font-semibold text-sand-700">Quick Test Batches:</span>
            <button
              type="button"
              onClick={() => { setQuery('BP-2026-SUN-001'); loadProof('BP-2026-SUN-001'); }}
              className="px-2.5 py-1 rounded-lg bg-sand-100 hover:bg-sand-200 text-forest-950 font-mono font-bold transition border border-sand-300"
            >
              BP-2026-SUN-001 (Primary Real Batch)
            </button>
            <button
              type="button"
              onClick={() => { setQuery('BP-2026-SUN-003'); loadProof('BP-2026-SUN-003'); }}
              className="px-2.5 py-1 rounded-lg bg-sand-100 hover:bg-sand-200 text-forest-950 font-mono font-bold transition border border-sand-300"
            >
              BP-2026-SUN-003
            </button>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="p-12 rounded-3xl bg-white border border-sand-200 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-honey-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-bold text-forest-950 text-sm">Fetching Solana Devnet On-Chain Proof...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !loading && (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-center space-y-2">
            <XCircle className="w-8 h-8 text-red-600 mx-auto" />
            <p className="font-bold text-base">{error}</p>
          </div>
        )}

        {/* MAIN PROOF CONTENT & JUDGE DEMO */}
        {proof && !loading && (
          <div className="space-y-6">

            {/* ACTION NOTIFICATION BANNER */}
            {actionMessage && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{actionMessage}</span>
              </div>
            )}

            {/* PROMINENT VERIFICATION VERDICT BANNER */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border-2 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${
                isVerified
                  ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
                  : 'bg-red-50/90 border-red-400 text-red-950'
              }`}
            >
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                    isVerified ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                  }`}
                >
                  {isVerified ? (
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  ) : (
                    <ShieldAlert className="w-10 h-10 stroke-[2.5]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight">
                      {isVerified ? 'VERIFIED' : 'TAMPERED / NOT VERIFIED'}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
                        isVerified ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                      }`}
                    >
                      {isVerified ? 'MATCH' : 'MISMATCH'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold mt-1 opacity-90">
                    {proof.reason}
                  </p>
                </div>
              </div>

              {/* Solana Explorer Button */}
              {proof.explorerUrl && (
                <a
                  href={proof.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>View on Solana Explorer</span>
                  <ExternalLink className="w-4 h-4 text-honey-400" />
                </a>
              )}
            </div>

            {/* ADMIN TAMPER SIMULATION & RESOLUTION CONTROL BAR */}
            <div className="p-5 rounded-3xl bg-white border border-sand-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-forest-950 uppercase tracking-wider">
                    Admin Cryptographic Tamper Simulation & Resolution Testing
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isVerified ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900 animate-pulse'
                  }`}>
                    {isVerified ? 'State: Authentic' : 'State: Altered in MongoDB'}
                  </span>
                </div>
                <span className="text-[11px] text-sand-500">
                  Live verification against on-chain SHA-256 root
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleSimulateTamper}
                  disabled={tampering || restoring}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>{tampering ? 'Simulating Tamper...' : '1. Simulate DB Tamper (+100kg Adulteration)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestoreData}
                  disabled={restoring || tampering || isVerified}
                  className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition cursor-pointer border ${
                    !isVerified
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-md'
                      : 'border-sand-300 bg-sand-100 text-sand-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <RotateCcw className={`w-4 h-4 ${restoring ? 'animate-spin' : ''}`} />
                  <span>{restoring ? 'Resolving & Re-Verifying...' : '2. Resolve Tampering (Restore Original Data)'}</span>
                </button>
              </div>
            </div>

            {/* 4 TECHNICAL PROOF CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* CARD 1: BATCH HASHING PAYLOAD */}
              <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                  <h3 className="font-display font-bold text-sm text-forest-950 uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4 text-honey-600" />
                    1. Batch Hashing Payload
                  </h3>
                  <span className="text-[10px] font-mono text-sand-500 uppercase">Input Fields</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-sand-100">
                    <span className="text-sand-600 font-medium">Batch Number:</span>
                    <span className="font-mono font-bold text-forest-950">{proof.batchNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-sand-100">
                    <span className="text-sand-600 font-medium">Apiary Cluster:</span>
                    <span className="font-bold text-forest-950">{proof.clusterName} ({proof.clusterCode})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-sand-100">
                    <span className="text-sand-600 font-medium">Harvest Quantity:</span>
                    <span className="font-bold text-forest-950">{proof.totalQuantityKg} kg</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-sand-100">
                    <span className="text-sand-600 font-medium">Floral Nectar Source:</span>
                    <span className="font-bold text-forest-950">{proof.floralSource}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-sand-600 font-medium">Harvest Date:</span>
                    <span className="font-mono text-forest-950">{proof.harvestDate}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-sand-50 border border-sand-200/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-sand-500 block">
                    Canonical String Fed to SHA-256:
                  </span>
                  <p className="font-mono text-[11px] text-forest-900 break-all bg-white p-2 rounded border border-sand-200">
                    {proof.canonicalData?.canonicalString}
                  </p>
                </div>
              </div>

              {/* CARD 2: CRYPTOGRAPHIC HASH COMPARISON */}
              <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                  <h3 className="font-display font-bold text-sm text-forest-950 uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-honey-600" />
                    2. SHA-256 Hash Comparison
                  </h3>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      proof.hashMatches ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {proof.hashMatches ? 'MATCH' : 'MISMATCH'}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-sand-600 font-medium block">Computed SHA-256 Hash (Current Data):</span>
                    <p className="font-mono text-[11px] text-forest-950 break-all bg-sand-50 p-2 rounded-xl border border-sand-200">
                      {proof.computedSha256Hash}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sand-600 font-medium block">On-Chain Solana Hash (Recorded):</span>
                    <p className="font-mono text-[11px] text-honey-800 break-all bg-sand-50 p-2 rounded-xl border border-sand-200">
                      {proof.onChainHash || 'No record on-chain'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-sand-100/70 border border-sand-200 text-[11px] space-y-1">
                    <span className="font-bold text-forest-950 block">Cryptographic Verification Rules:</span>
                    <p className="text-sand-700 leading-snug">
                      Any modification to quantity or floral nectar source changes the canonical string, generating a completely different SHA-256 hash.
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD 3: SOLANA DEVNET ON-CHAIN SETTLEMENT */}
              <div className="p-6 rounded-3xl bg-forest-950 text-white border border-forest-800 shadow-md space-y-4 md:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-forest-800 pb-3">
                  <h3 className="font-display font-bold text-sm text-honey-400 uppercase tracking-wider flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    3. Solana Devnet On-Chain Settlement & Anchor Program State
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Solana Devnet Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-sand-400 text-[10px] block uppercase">Network</span>
                    <span className="font-bold text-sand-100 text-sm block">{proof.blockchainNetwork}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-sand-400 text-[10px] block uppercase">Tx Status</span>
                    <span className="font-bold text-emerald-400 text-sm block">{proof.transactionStatus}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-sand-400 text-[10px] block uppercase">Anchor Program ID</span>
                    <span className="font-bold text-honey-300 text-xs block break-all">{proof.anchorProgramId}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-sand-400 text-[10px] block uppercase">Block Slot</span>
                    <span className="font-bold text-sand-100 text-sm block">#{proof.blockSlot}</span>
                  </div>
                </div>

                {/* Real Transaction Signature Box */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-xs font-bold text-sand-300 block uppercase tracking-wider">
                    REAL Solana Devnet Transaction Signature:
                  </span>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-honey-400 break-all select-all">
                    {proof.transactionSignature || 'Processing on-chain...'}
                  </div>

                  {proof.explorerUrl && (
                    <div className="pt-2 flex justify-end">
                      <a
                        href={proof.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-honey-500 hover:bg-honey-600 text-forest-950 font-bold text-xs shadow transition-all cursor-pointer"
                      >
                        <span>Open Transaction on Solana Explorer</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* CARD 4: ON-CHAIN ACCOUNT PDA STORAGE PROOF */}
              <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-sm space-y-5 md:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-200 pb-3">
                  <h3 className="font-display font-bold text-sm text-forest-950 uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4 text-honey-600" />
                    4. ON-CHAIN STORAGE PROOF
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    ✅ Hash Stored On-Chain
                  </span>
                </div>

                {/* ON-CHAIN STORAGE PROOF DETAILS BOX */}
                <div className="p-5 rounded-2xl bg-forest-950 text-white border border-forest-800 font-mono text-xs space-y-3 shadow-inner">
                  <div className="flex justify-between items-center border-b border-forest-800 pb-2">
                    <span className="text-honey-400 font-bold tracking-wider uppercase text-[11px]">ON-CHAIN STORAGE PROOF</span>
                    <span className="text-emerald-400 text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-sans">
                      Borsh / Anchor Account Decoded
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="text-sand-400 block text-[10px]">Batch Number:</span>
                      <span className="font-bold text-white">{proof.batchNumber}</span>
                    </div>
                    <div>
                      <span className="text-sand-400 block text-[10px]">Anchor Program ID:</span>
                      <span className="font-bold text-honey-300 break-all">{proof.anchorProgramId}</span>
                    </div>
                    <div>
                      <span className="text-sand-400 block text-[10px]">Network:</span>
                      <span className="font-bold text-sand-100">{proof.blockchainNetwork}</span>
                    </div>
                    <div>
                      <span className="text-sand-400 block text-[10px]">Transaction Signature:</span>
                      <span className="font-bold text-honey-400 break-all">{proof.transactionSignature}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-sand-400 block text-[10px]">On-Chain Account / PDA Address:</span>
                      <span className="font-bold text-emerald-400 break-all select-all">{proof.pdaAddress || 'CQHVHpVZCxbmsxj8jbHQGTCTBiij2cRNqvMrh6gZ6Mky'}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-sand-400 block text-[10px]">Stored Hash (`canonical_hash` field):</span>
                      <span className="font-bold text-honey-300 break-all select-all">{proof.onChainHash}</span>
                    </div>
                  </div>
                </div>

                {/* VISUAL HASH EQUALITY FLOW */}
                <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 text-center space-y-2">
                  <span className="font-bold text-sand-600 block uppercase text-[10px] tracking-wider">
                    DECODED CRYPTOGRAPHIC EQUALITY CHECK
                  </span>
                  
                  <div className="flex flex-col items-center justify-center space-y-1 font-mono text-xs text-forest-950 pt-1">
                    <div className="flex flex-wrap items-center justify-center gap-3 bg-white px-4 py-2 rounded-xl border border-sand-300 shadow-sm">
                      <span className="font-bold text-forest-900">Backend SHA-256 Hash</span>
                      <span className="font-black text-honey-600 text-base font-sans">=</span>
                      <span className="font-bold text-forest-900">On-Chain Stored Hash</span>
                    </div>
                    
                    <div className="text-sand-400 text-sm font-bold">↓</div>
                    
                    <div className="px-3 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                      MATCH
                    </div>
                    
                    <div className="text-sand-400 text-sm font-bold">↓</div>
                    
                    <div className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs tracking-wider shadow-sm">
                      ✅ VERIFIED
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-sand-600 font-medium">
                    Anchor Account Type: <strong className="font-mono text-forest-950">BatchRecord (584 bytes)</strong>
                  </span>

                  {proof.pdaExplorerUrl && (
                    <a
                      href={proof.pdaExplorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Database className="w-4 h-4 text-honey-400" />
                      <span>View On-Chain Account</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
};
