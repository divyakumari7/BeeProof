import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Leaf, Link2, QrCode } from 'lucide-react';
import { PublicBatchModal } from '../components/PublicBatchModal';
import { AuthModal } from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [batchInput, setBatchInput] = useState('BP-2026-SUN-001');

  const { isAuthenticated, user, getDashboardPathForUser } = useAuth();
  const navigate = useNavigate();

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (batchInput.trim()) {
      navigate(`/verify/${encodeURIComponent(batchInput.trim())}`);
    } else {
      navigate('/verify');
    }
  };

  const handlePortalEntry = (role?: string) => {
    if (isAuthenticated) {
      navigate(getDashboardPathForUser());
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-[#FDFBF7] via-[#FAF6F0] to-[#FAF8F5] border-b border-sand-200/60">
        {/* Subtle Honeycomb / Hexagon Background Pattern */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.06]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="honeycomb-pattern" width="56" height="96" patternUnits="userSpaceOnUse">
                <path
                  d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 64 L56 80 L56 112 L28 128 L0 112 L0 80 Z"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="1.2"
                />
                <path
                  d="M56 48 L84 64 L84 96 L56 112 L28 96 L28 64 Z"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="1.2"
                />
                <path
                  d="M0 48 L28 64 L28 96 L0 112 L-28 96 L-28 64 Z"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="1.2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb-pattern)" />
          </svg>
        </div>

        {/* Decorative Amber Blur Glows */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-honey-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* Left Decorative: Realistic Honey Dipper & Jasmine Blossoms */}
        <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-[270px] xl:w-[340px] 2xl:w-[390px] pointer-events-none select-none z-0">
          <img
            src="/assets/honey_dipper.jpg"
            alt="Honey dipper with golden dripping honey and blossoms"
            className="w-full h-auto object-contain [mask-image:radial-gradient(circle_at_45%_50%,black_60%,transparent_98%)] [-webkit-mask-image:radial-gradient(circle_at_45%_50%,black_60%,transparent_98%)] drop-shadow-lg"
          />
        </div>

        {/* Right Decorative: Realistic Glass Honey Jar & Honeycomb on Wood Slice */}
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[270px] xl:w-[340px] 2xl:w-[390px] pointer-events-none select-none z-0">
          <img
            src="/assets/honey_jar.jpg"
            alt="BeeProof certified pure honey jar on wood slice with honeycomb"
            className="w-full h-auto object-contain [mask-image:radial-gradient(circle_at_55%_50%,black_60%,transparent_98%)] [-webkit-mask-image:radial-gradient(circle_at_55%_50%,black_60%,transparent_98%)] drop-shadow-lg"
          />
        </div>

        {/* Center Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            {/* 2. Hero badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-sand-300/80 shadow-sm text-forest-900 text-xs font-semibold backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              <span>Provenance Verified • Agricultural Technology Platform</span>
            </motion.div>

            {/* 3. Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-[54px] xl:text-6xl font-extrabold text-forest-950 tracking-tight leading-[1.12]"
            >
              Tamper-Evident <br />
              <span className="text-[#C86D0B] bg-gradient-to-r from-amber-600 via-honey-600 to-amber-700 bg-clip-text text-transparent">
                Honey Traceability
              </span> <br className="hidden sm:inline" />
              Infrastructure
            </motion.h1>

            {/* 4. Description text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base lg:text-[17px] text-sand-800 leading-relaxed max-w-2xl mx-auto font-medium"
            >
              Connecting certified beekeeping cooperatives, regional processors, accredited testing laboratories,
              and distributors under a unified provenance verification network.
            </motion.p>

            {/* 5. Batch verification/search box */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-3 max-w-xl mx-auto"
            >
              <form
                onSubmit={handleQuickVerify}
                className="p-2 rounded-2xl bg-white shadow-xl shadow-amber-950/5 border border-sand-300 flex flex-col sm:flex-row gap-2"
              >
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400" />
                  <input
                    type="text"
                    value={batchInput}
                    onChange={(e) => setBatchInput(e.target.value)}
                    placeholder="BP-2026-SUN-001"
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-mono focus:outline-none text-sand-900 placeholder:text-sand-400 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-honey-600 hover:from-amber-700 hover:to-honey-700 text-white font-bold text-sm transition-all flex items-center justify-center shrink-0 shadow-md shadow-amber-600/20 active:scale-[0.98]"
                >
                  <span>Verify Provenance</span>
                </button>
              </form>

              {/* 6. Sample batch links */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-sand-700 mt-2.5">
                <span className="font-medium text-sand-600">Try sample batches:</span>
                <button
                  type="button"
                  onClick={() => navigate('/verify/BP-2026-SUN-001')}
                  className="font-mono text-emerald-700 underline font-bold hover:text-emerald-800 transition-colors"
                >
                  BP-2026-SUN-001 (Authentic)
                </button>
                <span className="text-sand-400">•</span>
                <button
                  type="button"
                  onClick={() => navigate('/verify/BP-2026-SUN-009')}
                  className="font-mono text-red-700 underline font-bold hover:text-red-800 transition-colors"
                >
                  BP-2026-SUN-009 (Tampered)
                </button>
              </div>
            </motion.div>
          </div>

          {/* 7. Feature section (Hive Monitoring → Tamper-Evident Records → Consumer Verification) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 max-w-4xl mx-auto rounded-2xl bg-white border border-sand-200 shadow-xl shadow-amber-950/5 p-3 sm:p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-sand-200">
              {/* Feature 1: Hive Monitoring */}
              <div className="flex items-center gap-3.5 p-3 sm:px-5">
                <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-bold text-sm text-forest-950">Hive Monitoring</h3>
                  <p className="text-[11px] sm:text-xs text-sand-600 leading-snug">Monitor hive conditions and detect unusual changes.</p>
                </div>
              </div>

              {/* Feature 2: Tamper-Evident Records */}
              <div className="flex items-center gap-3.5 p-3 sm:px-5">
                <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Link2 className="w-5 h-5 text-amber-700" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-bold text-sm text-forest-950">Tamper-Evident Records</h3>
                  <p className="text-[11px] sm:text-xs text-sand-600 leading-snug">Detect changes in recorded batch information.</p>
                </div>
              </div>

              {/* Feature 3: Consumer Verification */}
              <div className="flex items-center gap-3.5 p-3 sm:px-5">
                <div className="w-11 h-11 rounded-full bg-honey-100 text-honey-800 flex items-center justify-center shrink-0">
                  <QrCode className="w-5 h-5 text-honey-700" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-bold text-sm text-forest-950">Consumer Verification</h3>
                  <p className="text-[11px] sm:text-xs text-sand-600 leading-snug">Scan or enter a batch ID to verify provenance.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4 Pillars Traceability Chain */}
      <section id="provenance-architecture" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-honey-700">End-to-End Integrity</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-950">
            The 4 Pillars of Honey Provenance
          </h2>
          <p className="text-sm text-sand-800">
            From cluster apiary harvest through laboratory spectroscopic analysis to retail delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-3 hover:border-sand-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-display font-bold text-base text-forest-950">Apiary Harvest Logging</h3>
            <p className="text-xs text-sand-800 leading-relaxed">
              Every extraction is mapped to individual hives, beekeepers, and geographic floral zones with GPS timestamps.
            </p>
            <span className="inline-block text-[11px] font-semibold text-forest-700">5 Registered Clusters</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-3 hover:border-sand-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-honey-50 text-honey-700 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-display font-bold text-base text-forest-950">Cold Processing</h3>
            <p className="text-xs text-sand-800 leading-relaxed">
              Micro-filtration below 40°C preserving native invertase and diastase enzymes without artificial caramelization.
            </p>
            <span className="inline-block text-[11px] font-semibold text-honey-700">Thermal Threshold Enforced</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-3 hover:border-sand-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-display font-bold text-base text-forest-950">NMR Laboratory Assays</h3>
            <p className="text-xs text-sand-800 leading-relaxed">
              Accredited NABL quality laboratories conduct Nuclear Magnetic Resonance and C4 sugar detection before batch clearance.
            </p>
            <span className="inline-block text-[11px] font-semibold text-purple-700">Spectral Fingerprinting</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-3 hover:border-sand-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              04
            </div>
            <h3 className="font-display font-bold text-base text-forest-950">Custody Handover</h3>
            <p className="text-xs text-sand-800 leading-relaxed">
              Tamper-evident batch serialization linking physical containers to permanent cryptographic records.
            </p>
            <span className="inline-block text-[11px] font-semibold text-blue-700">Cold-Chain Monitored</span>
          </div>
        </div>
      </section>

      {/* Registered Cooperatives Section */}
      <section id="kvic-cooperatives" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-forest-950 text-white shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-honey-400">Foundational Infrastructure</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Active Beekeeping Geographic Clusters
              </h2>
              <p className="text-xs sm:text-sm text-sand-300 max-w-xl">
                Seeded across India's ecologically diverse regions, supporting traditional indigenous apiaries.
              </p>
            </div>
            <button
              onClick={() => handlePortalEntry('ADMIN_KVIC')}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-honey-600 hover:bg-honey-500 text-white transition-colors self-start md:self-auto"
            >
              Access Admin Oversight
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-forest-900/80 border border-forest-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-honey-400 font-mono">
                <span>SUN-MNG-01</span>
                <span>West Bengal</span>
              </div>
              <h4 className="font-display font-bold text-base text-white">Sundarbans Mangrove Reserve</h4>
              <p className="text-xs text-sand-300">
                Wild Khalisha & Goran blossom nectar harvested in tidal mangrove biosphere.
              </p>
              <div className="pt-2 text-[11px] text-sand-800 flex items-center gap-4">
                <span>5 Hives</span>
                <span>2 Beekeepers</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-forest-900/80 border border-forest-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-honey-400 font-mono">
                <span>NIL-HGH-02</span>
                <span>Tamil Nadu</span>
              </div>
              <h4 className="font-display font-bold text-base text-white">Nilgiri Highlands Cluster</h4>
              <p className="text-xs text-sand-300">
                Western Ghats mountain wildflower and high-altitude eucalyptus floral nectar.
              </p>
              <div className="pt-2 text-[11px] text-sand-800 flex items-center gap-4">
                <span>5 Hives</span>
                <span>2 Beekeepers</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-forest-900/80 border border-forest-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-honey-400 font-mono">
                <span>KAS-VAL-03</span>
                <span>Jammu & Kashmir</span>
              </div>
              <h4 className="font-display font-bold text-base text-white">Kashmir Valley Acacia</h4>
              <p className="text-xs text-sand-300">
                Robinia Pseudoacacia alpine white honey with low crystallization characteristics.
              </p>
              <div className="pt-2 text-[11px] text-sand-800 flex items-center gap-4">
                <span>5 Hives</span>
                <span>1 Beekeeper</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Portal Access Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-honey-700">Enterprise Workspaces</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-950">
            Dedicated Stakeholder Portals
          </h2>
          <p className="text-sm text-sand-800">
            Unified platform with fine-grained role-based isolation for each supply-chain participant.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <button
            onClick={() => handlePortalEntry('ADMIN_KVIC')}
            className="p-5 rounded-2xl bg-white border border-sand-200 text-left hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                KVIC Oversight
              </span>
              <h4 className="font-display font-bold text-sm text-forest-950 group-hover:text-amber-700 transition-colors">
                Admin / KVIC
              </h4>
              <p className="text-xs text-sand-800 leading-relaxed">
                Supervise clusters, hives, audit logs, and system integrity.
              </p>
            </div>
            <span className="mt-4 pt-3 border-t border-sand-100 inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
              Access Portal <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => handlePortalEntry('BEEKEEPER')}
            className="p-5 rounded-2xl bg-white border border-sand-200 text-left hover:border-emerald-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                Apiary Origin
              </span>
              <h4 className="font-display font-bold text-sm text-forest-950 group-hover:text-emerald-700 transition-colors">
                Beekeeper
              </h4>
              <p className="text-xs text-sand-800 leading-relaxed">
                Manage assigned clusters, view hive status, and track harvests.
              </p>
            </div>
            <span className="mt-4 pt-3 border-t border-sand-100 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
              Access Portal <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => handlePortalEntry('PROCESSOR')}
            className="p-5 rounded-2xl bg-white border border-sand-200 text-left hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                Cold Processing
              </span>
              <h4 className="font-display font-bold text-sm text-forest-950 group-hover:text-blue-700 transition-colors">
                Processor
              </h4>
              <p className="text-xs text-sand-800 leading-relaxed">
                Log cold filtration, thermal history, and batch processing.
              </p>
            </div>
            <span className="mt-4 pt-3 border-t border-sand-100 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
              Access Portal <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => handlePortalEntry('QUALITY_LAB')}
            className="p-5 rounded-2xl bg-white border border-sand-200 text-left hover:border-purple-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 inline-block">
                NABL Testing
              </span>
              <h4 className="font-display font-bold text-sm text-forest-950 group-hover:text-purple-700 transition-colors">
                Quality Lab
              </h4>
              <p className="text-xs text-sand-800 leading-relaxed">
                Submit NMR spectroscopy certificates and sugar adulteration tests.
              </p>
            </div>
            <span className="mt-4 pt-3 border-t border-sand-100 inline-flex items-center gap-1 text-xs font-semibold text-purple-700">
              Access Portal <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => handlePortalEntry('DISTRIBUTOR')}
            className="p-5 rounded-2xl bg-white border border-sand-200 text-left hover:border-orange-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 inline-block">
                Cold-Chain Transit
              </span>
              <h4 className="font-display font-bold text-sm text-forest-950 group-hover:text-orange-700 transition-colors">
                Distributor
              </h4>
              <p className="text-xs text-sand-800 leading-relaxed">
                Track packaged lot dispatches and retail arrival custody.
              </p>
            </div>
            <span className="mt-4 pt-3 border-t border-sand-100 inline-flex items-center gap-1 text-xs font-semibold text-orange-700">
              Access Portal <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </section>

      {/* Modals */}
      <PublicBatchModal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        initialBatchNumber={batchInput}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};
