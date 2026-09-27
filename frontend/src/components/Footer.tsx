import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-950 text-sand-200 border-t border-forest-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-honey-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Bee<span className="text-honey-500">Proof</span>
              </span>
            </div>
            <p className="text-xs text-sand-300 max-w-md leading-relaxed">
              Enterprise agricultural technology and honey provenance infrastructure. Empowering beekeepers,
              enforcing laboratory verification, and ensuring authentic origin transparency across India's honey supply chain.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md bg-forest-900 text-emerald-400 border border-forest-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Operational Traceability Platform
              </span>
              <span className="text-[11px] text-sand-800">KVIC Traceability Standard</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sand-200 mb-3">
              Traceability Roles
            </h4>
            <ul className="space-y-2 text-xs text-sand-300">
              <li>KVIC Admin & Governance</li>
              <li>Registered Beekeepers</li>
              <li>Processing Facilities</li>
              <li>NABL Quality Laboratories</li>
              <li>Cold-Chain Distributors</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sand-200 mb-3">
              Platform Integrity
            </h4>
            <p className="text-xs text-sand-300 leading-relaxed">
              BeeProof ensures genuine provenance verification backed by rigorous NMR spectroscopic assays and tamper-evident custody handovers.
            </p>
            <p className="text-[11px] text-sand-800 mt-4">
              © 2026 BeeProof Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
