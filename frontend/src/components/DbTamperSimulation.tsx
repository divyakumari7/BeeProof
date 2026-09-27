import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Database,
  ArrowRight,
  Info,
  Lock,
  RefreshCw,
  Check,
  Cpu,
  Layers,
  FileCheck2
} from 'lucide-react';
import { api } from '../services/api';
import { BatchResponse, BlockchainProofData } from '../types';

interface Props {
  batches: BatchResponse[];
  onDataChanged?: () => void;
}

export const DbTamperSimulation: React.FC<Props> = ({ batches, onDataChanged }) => {
  // Pick first batch as default (e.g. BP-2026-SUN-001)
  const [selectedBatchNumber, setSelectedBatchNumber] = useState<string>(
    batches[0]?.batchNumber || 'BP-2026-SUN-001'
  );

  const currentBatch = batches.find(b => b.batchNumber === selectedBatchNumber) || batches[0];

  const [modifiedQuantity, setModifiedQuantity] = useState<string>('585.5');
  const [tamperReason, setTamperReason] = useState<string>(
    'Simulated illicit volume inflation (+100kg artificial corn syrup dilution)'
  );

  const [loadingTamper, setLoadingTamper] = useState(false);
  const [loadingRestore, setLoadingRestore] = useState(false);
  const [loadingProof, setLoadingProof] = useState(false);
  const [resolutionStep, setResolutionStep] = useState<string | null>(null);
  const [proofData, setProofData] = useState<BlockchainProofData | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'tampered';
    title: string;
    details?: string;
  } | null>(null);

  // Fetch live proof data for currently selected batch
  const fetchLiveProof = async (batchNum: string) => {
    if (!batchNum) return;
    setLoadingProof(true);
    try {
      const res = await api.getBlockchainProof(batchNum);
      if (res.success && res.data) {
        setProofData(res.data);
      } else {
        setProofData(null);
      }
    } catch (e) {
      setProofData(null);
    } finally {
      setLoadingProof(false);
    }
  };

  // Sync default modified quantity & live proof when selected batch changes
  useEffect(() => {
    if (currentBatch) {
      setModifiedQuantity(String((Number(currentBatch.totalQuantityKg) + 100).toFixed(1)));
      fetchLiveProof(currentBatch.batchNumber);
    }
  }, [currentBatch?.batchNumber, currentBatch?.totalQuantityKg]);

  const handleSimulateTamper = async () => {
    if (!selectedBatchNumber) return;
    setLoadingTamper(true);
    setStatusMessage(null);
    setResolutionStep(null);
    try {
      const res = await api.tamperBatch(selectedBatchNumber, {
        modifiedQuantity: Number(modifiedQuantity),
        reason: tamperReason
      });
      if (res.success) {
        await fetchLiveProof(selectedBatchNumber);
        setStatusMessage({
          type: 'tampered',
          title: `DATABASE COMPROMISED: Batch ${selectedBatchNumber} modified in MongoDB`,
          details: `Quantity altered to ${modifiedQuantity}kg & floral source changed. SHA-256 canonical hash recomputed against MongoDB now MISMATCHES the immutable Solana Devnet on-chain proof.`
        });
        if (onDataChanged) onDataChanged();
      } else {
        setStatusMessage({
          type: 'error',
          title: 'Tamper Simulation Failed',
          details: res.message || 'Could not alter batch record.'
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        title: 'Tamper Simulation Error',
        details: err.message || 'Error executing tamper simulation.'
      });
    } finally {
      setLoadingTamper(false);
    }
  };

  const handleResolveTampering = async () => {
    if (!selectedBatchNumber) return;
    setLoadingRestore(true);
    setStatusMessage(null);
    setResolutionStep('1/3 Restoring authentic original database values in MongoDB...');

    try {
      // Step 1 & 2: Restore authentic values in MongoDB
      const res = await api.restoreBatch(selectedBatchNumber);
      
      setResolutionStep('2/3 Recomputing canonical 7-field SHA-256 hash from MongoDB...');
      await new Promise(r => setTimeout(r, 400));

      // Step 3 & 4: Automatically re-run cryptographic verification against Solana Devnet
      setResolutionStep('3/3 Comparing recomputed hash against Solana Devnet recorded root...');
      const proofRes = await api.getBlockchainProof(selectedBatchNumber);
      
      if (proofRes.success && proofRes.data) {
        setProofData(proofRes.data);
      }

      if (proofRes.success && proofRes.data && proofRes.data.hashMatches && proofRes.data.verificationStatus === 'VERIFIED') {
        setStatusMessage({
          type: 'success',
          title: `INTEGRITY RESOLVED: Batch ${selectedBatchNumber} PROVENANCE VERIFIED`,
          details: `Authentic database values restored in MongoDB (${proofRes.data.totalQuantityKg}kg, ${proofRes.data.floralSource}). Recomputed SHA-256 hash (${proofRes.data.computedSha256Hash.substring(0, 14)}...) exactly matches the Solana Devnet recorded state root.`
        });
      } else {
        setStatusMessage({
          type: 'error',
          title: 'Resolution Incomplete: Hash Mismatch Persists',
          details: 'Database values restored, but recomputed hash does not match on-chain Solana proof (TAMPERED / NOT VERIFIED).'
        });
      }

      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        title: 'Tamper Resolution Failed',
        details: err.message || 'Error executing restoration workflow.'
      });
    } finally {
      setLoadingRestore(false);
      setResolutionStep(null);
    }
  };

  const isTampered = Boolean(
    currentBatch?.isTampered ||
    (proofData && (!proofData.hashMatches || proofData.verificationStatus !== 'VERIFIED'))
  );

  const verifyUrl = `/verify/${encodeURIComponent(selectedBatchNumber)}`;
  const proofUrl = `/admin/blockchain-proof/${encodeURIComponent(selectedBatchNumber)}`;

  return (
    <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center text-red-700 font-bold">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="font-display text-xl font-bold text-forest-950">
              Cryptographic Integrity & DB Tamper Simulation
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
              isTampered
                ? 'bg-red-100 text-red-900 border border-red-300 animate-pulse'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}>
              {isTampered ? 'STATUS: TAMPERED (HASH MISMATCH)' : 'STATUS: AUTHENTIC / ON-CHAIN VERIFIED'}
            </span>
          </div>
          <p className="text-xs text-sand-700 mt-1">
            Test the live cryptographic tamper-detection pipeline by modifying database records and restoring them against the immutable Solana Devnet state root.
          </p>
        </div>

        {/* Live Integrity Mode Indicator */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sand-50 border border-sand-200 text-xs text-sand-700">
          <Database className="w-3.5 h-3.5 text-forest-700" />
          <span>Solana Devnet Anchor SHA-256 Check</span>
        </div>
      </div>

      {/* Dynamic Status Toast / Banner */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl text-xs flex items-start gap-3 transition-all border ${
          statusMessage.type === 'tampered'
            ? 'bg-red-50 border-red-300 text-red-950'
            : statusMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}>
          {statusMessage.type === 'tampered' ? (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          ) : statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="font-bold">{statusMessage.title}</p>
            {statusMessage.details && (
              <p className="text-[11px] opacity-90 leading-relaxed">{statusMessage.details}</p>
            )}
          </div>
        </div>
      )}

      {/* Resolution Step Tracker (When resolving) */}
      {resolutionStep && (
        <div className="p-4 rounded-2xl bg-forest-950 text-white border border-forest-800 text-xs flex items-center gap-3 animate-pulse">
          <RefreshCw className="w-4 h-4 text-honey-400 animate-spin shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-honey-400 uppercase text-[10px] tracking-wider block">
              Cryptographic Resolution Pipeline in Progress
            </span>
            <span className="font-mono text-sand-200">{resolutionStep}</span>
          </div>
        </div>
      )}

      {/* Target Batch Selector & Comparison Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Target Selector & Tamper Inputs */}
        <div className="lg:col-span-6 space-y-4">
          {/* Target Batch Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-forest-950 uppercase tracking-wide block">
              Select Target Batch for Simulation & Resolution
            </label>
            <select
              value={selectedBatchNumber}
              onChange={(e) => setSelectedBatchNumber(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-sand-300 bg-sand-50 font-mono text-xs font-bold text-forest-950 focus:ring-2 focus:ring-honey-500 cursor-pointer"
            >
              {batches.map((b) => (
                <option key={b.batchNumber} value={b.batchNumber}>
                  {b.batchNumber} — {b.floralSource} ({b.totalQuantityKg} kg) {b.isTampered ? '⚠️ TAMPERED' : '✅'}
                </option>
              ))}
            </select>
          </div>

          {/* Current vs Modified Quantity Input */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
              isTampered ? 'bg-red-50/50 border-red-300' : 'bg-sand-50 border-sand-200'
            }`}>
              <span className="text-[11px] text-sand-600 font-semibold block">Current MongoDB Quantity:</span>
              <p className="font-mono font-bold text-base text-forest-950">
                {currentBatch?.totalQuantityKg ?? '485.5'} kg
              </p>
              <span className={`text-[10px] font-bold block ${isTampered ? 'text-red-700' : 'text-emerald-700'}`}>
                {isTampered ? '⚠️ Altered from original' : 'Authentic state'}
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-sand-700 uppercase tracking-wide block">
                Simulated Modified Quantity (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={modifiedQuantity}
                onChange={(e) => setModifiedQuantity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-red-300 bg-red-50/40 font-mono text-xs font-bold text-red-950 focus:ring-2 focus:ring-red-500"
                placeholder="e.g. 585.5"
              />
              <span className="text-[10px] text-red-600 block">Simulate unauthorized weight inflation</span>
            </div>
          </div>

          {/* Audit / Reason Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-forest-950 uppercase tracking-wide block">
              Audit Reason / Attack Vector Description
            </label>
            <input
              type="text"
              value={tamperReason}
              onChange={(e) => setTamperReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-sand-300 bg-white text-xs text-sand-900"
              placeholder="e.g. Adulteration testing / artificial sugar syrup dilution"
            />
          </div>
        </div>

        {/* Right Column: State Proof Comparison Card */}
        <div className="lg:col-span-6 space-y-3">
          <label className="text-xs font-bold text-forest-950 uppercase tracking-wide block">
            Cryptographic State Verification Proof
          </label>

          <div className={`p-5 rounded-2xl border transition-all space-y-3 ${
            isTampered
              ? 'bg-red-50/70 border-red-300 text-red-950 shadow-sm'
              : 'bg-sand-50/70 border-sand-200 text-forest-950'
          }`}>
            <div className="flex items-center justify-between text-xs border-b border-sand-200 pb-2">
              <span className="font-bold">On-Chain Solana Root:</span>
              <span className="font-mono text-[10px] text-sand-700 truncate max-w-[190px]">
                {proofData?.onChainHash || currentBatch?.onChainHash || '0x3f1bf0...cb39'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs border-b border-sand-200 pb-2">
              <span className="font-bold">Recomputed SHA-256:</span>
              <span className="font-mono text-[10px] truncate max-w-[190px]">
                {proofData?.computedSha256Hash || 'Loading hash...'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs border-b border-sand-200 pb-2">
              <span className="font-bold">Database State:</span>
              <span className={`font-mono font-bold ${isTampered ? 'text-red-700' : 'text-emerald-800'}`}>
                {isTampered ? '❌ MISMATCH (Altered in MongoDB)' : '✅ MATCHES SOLANA DEVNET ROOT'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs border-b border-sand-200 pb-2">
              <span className="font-bold">Floral Source Recorded:</span>
              <span className="text-[11px] truncate max-w-[210px]">
                {currentBatch?.floralSource}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">Verification Verdict:</span>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                isTampered
                  ? 'bg-red-200 text-red-950 border border-red-300'
                  : 'bg-emerald-200 text-emerald-950 border border-emerald-300'
              }`}>
                {isTampered ? 'TAMPERED / NOT VERIFIED' : 'PROVENANCE VERIFIED'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* HIGHLIGHTED RESOLUTION BANNER IF TAMPERED */}
      {isTampered && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border-2 border-red-300 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-red-950">
                Tampering Detected: Restore Database to Match Solana On-Chain Root
              </h4>
              <p className="text-xs text-sand-700">
                Click below to restore authentic recorded values in MongoDB and immediately re-run cryptographic verification.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResolveTampering}
            disabled={loadingRestore}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
          >
            {loadingRestore ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>Resolve Tampering (Restore Original Data)</span>
          </button>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-sand-200">
        {/* Button 1: Simulate DB Tampering */}
        <button
          type="button"
          onClick={handleSimulateTamper}
          disabled={loadingTamper}
          className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
        >
          {loadingTamper ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <ShieldAlert className="w-4 h-4" />
          )}
          <span>1. Simulate DB Tampering (Modify DB)</span>
        </button>

        {/* Button 2: Resolve Tampering / Restore DB State */}
        <button
          type="button"
          onClick={handleResolveTampering}
          disabled={loadingRestore || !isTampered}
          className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border ${
            isTampered
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-sm'
              : 'border-sand-300 bg-white hover:bg-sand-50 text-sand-800 disabled:opacity-40'
          }`}
        >
          {loadingRestore ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RotateCcw className="w-4 h-4 text-emerald-400" />
          )}
          <span>Resolve Tampering (Restore Original Data)</span>
        </button>

        {/* Button 3: Inspect Cryptographic Proof */}
        <a
          href={proofUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-3 px-4 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition text-center"
        >
          <Database className="w-4 h-4 text-honey-400" />
          <span>2. Open Technical Blockchain Proof</span>
        </a>

        {/* Button 4: Open Public Consumer Page */}
        <a
          href={verifyUrl}
          target="_blank"
          rel="noreferrer"
          className="py-3 px-4 rounded-xl border border-sand-300 bg-white hover:bg-sand-50 text-sand-800 font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition text-center"
        >
          <ExternalLink className="w-4 h-4 text-forest-700" />
          <span>Consumer QR View</span>
        </a>
      </div>
    </div>
  );
};
