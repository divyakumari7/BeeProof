import React, { useState } from 'react';
import {
  QrCode,
  CheckCircle2,
  X,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Package,
  Thermometer,
  Calendar,
  Layers,
  Printer
} from 'lucide-react';
import { QrCodeDisplay } from './QrCodeDisplay';

interface Props {
  batch: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProcessorQrModal: React.FC<Props> = ({ batch, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !batch) return null;

  const originUrl = window.location.origin || 'http://localhost:5173';
  const verificationUrl = `${originUrl}/verify/${batch.batchNumber}`;

  // Check verification & packaging completeness
  const isQualityVerified = ['QUALITY_VERIFIED', 'PACKAGED', 'DISPATCHED', 'DELIVERED'].includes(batch.status);
  const isPackaged = ['PACKAGED', 'DISPATCHED', 'DELIVERED'].includes(batch.status);
  const isLocked = !isQualityVerified;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    const imgElement = document.getElementById(`qr-img-${batch.batchNumber}`) as HTMLImageElement;
    if (imgElement && imgElement.src) {
      if (imgElement.src.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = imgElement.src;
        link.download = `BeeProof_QR_${batch.batchNumber}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      fetch(imgElement.src)
        .then(res => res.blob())
        .then(blob => {
          const u = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = u;
          link.download = `BeeProof_QR_${batch.batchNumber}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(u);
        })
        .catch(() => {
          window.open(imgElement.src, '_blank');
        });
    } else {
      window.open(verificationUrl, '_blank');
    }
  };

  const handlePrintQr = () => {
    const printWindow = window.open('', '_blank', 'width=650,height=750');
    if (!printWindow) {
      window.print();
      return;
    }
    const imgEl = document.getElementById(`qr-img-${batch.batchNumber}`) as HTMLImageElement;
    const qrSrc = imgEl?.src || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(verificationUrl)}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>BeeProof Provenance Label - ${batch.batchNumber}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #fff;
              color: #0D2818;
              margin: 0;
              padding: 24px;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            .label-card {
              border: 2px solid #0D2818;
              border-radius: 16px;
              padding: 24px 32px;
              max-width: 420px;
              background: #FAF8F5;
            }
            .brand {
              font-size: 22px;
              font-weight: 800;
              color: #D97706;
              letter-spacing: 1px;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .title {
              font-size: 13px;
              font-weight: 600;
              color: #0D2818;
              margin-bottom: 14px;
            }
            .qr-wrapper {
              background: #fff;
              padding: 12px;
              border: 1px solid #E5E7EB;
              border-radius: 12px;
              display: inline-block;
              margin: 10px 0;
            }
            .qr-img {
              width: 190px;
              height: 190px;
              display: block;
            }
            .batch-id {
              font-family: monospace;
              font-size: 15px;
              font-weight: 700;
              color: #0D2818;
              background: #fff;
              padding: 4px 12px;
              border-radius: 6px;
              border: 1px solid #D1D5DB;
              margin: 6px 0;
              display: inline-block;
            }
            .url {
              font-size: 10px;
              color: #4B5563;
              word-break: break-all;
              margin: 6px 0;
            }
            .seal {
              margin-top: 12px;
              font-size: 10px;
              font-weight: 700;
              color: #047857;
              text-transform: uppercase;
              border-top: 1px dashed #D1D5DB;
              padding-top: 8px;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="label-card">
            <div class="brand">BeeProof™</div>
            <div class="title">Cryptographic Honey Provenance Label</div>
            <div class="qr-wrapper">
              <img src="${qrSrc}" class="qr-img" alt="QR Code" />
            </div>
            <div>
              <span class="batch-id">${batch.batchNumber}</span>
            </div>
            <div style="font-size: 12px; color: #374151; font-weight: 600;">${batch.floralSource || 'Natural Honey'}</div>
            <div class="url">${verificationUrl}</div>
            <div class="seal">✅ NABL Laboratory Certified • Blockchain Verified</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl shadow-2xl border border-sand-300 overflow-hidden space-y-0">
        {/* Modal Header */}
        <div className="bg-forest-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-honey-600/20 text-honey-400 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Consumer Verification QR Token</h3>
              <p className="text-[11px] text-sand-300 font-mono">Batch {batch.batchNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-sand-300 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* If Quality Verification is NOT complete: LOCKED VIEW */}
          {isLocked ? (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-300 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-700">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-forest-950">
                  QR Generation Locked
                </h4>
                <p className="text-xs text-sand-700 max-w-sm mx-auto leading-relaxed">
                  Cryptographic verification QR tokens cannot be generated before accredited NABL quality laboratory testing is completed and verified on-chain.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs font-mono text-left space-y-1">
                <div className="flex justify-between">
                  <span className="text-sand-600">Current Status:</span>
                  <span className="font-bold text-amber-900">{batch.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sand-600">Required Milestone:</span>
                  <span className="font-bold text-emerald-800">QUALITY_VERIFIED</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-forest-900 text-white rounded-xl font-bold text-xs hover:bg-forest-800"
              >
                Return to Processing
              </button>
            </div>
          ) : (
            /* VERIFIED & PACKAGED: QR TOKEN DISPLAY */
            <div className="space-y-5">
              {/* Batch Workflow Status Checklist */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center justify-center gap-1 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Processing</span>
                  </div>
                  <span className="text-[10px] text-sand-600 block mt-0.5">&lt; 40°C Micro-filtered</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center justify-center gap-1 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Quality Lab</span>
                  </div>
                  <span className="text-[10px] text-sand-600 block mt-0.5">NABL Certified</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center justify-center gap-1 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Packaging</span>
                  </div>
                  <span className="text-[10px] text-sand-600 block mt-0.5">{isPackaged ? 'Packaged' : 'Pending jars'}</span>
                </div>
              </div>

              {/* Central QR Code View */}
              <div className="p-5 rounded-2xl bg-white border border-sand-200 shadow-sm flex flex-col items-center justify-center gap-3">
                <div id={`qr-svg-${batch.batchNumber}`} className="p-3 bg-white rounded-xl shadow-inner border border-sand-200">
                  <QrCodeDisplay
                    url={verificationUrl}
                    batchNumber={batch.batchNumber}
                    size={170}
                  />
                </div>

                <div className="text-center space-y-0.5">
                  <p className="font-mono text-xs font-bold text-forest-950">
                    {batch.batchNumber}
                  </p>
                  <p className="text-[11px] text-sand-600">
                    {batch.floralSource} • {batch.totalQuantityKg} kg
                  </p>
                </div>
              </div>

              {/* Consumer Verification URL Bar */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-sand-700 uppercase tracking-wide block">
                  Consumer Verification URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={verificationUrl}
                    className="w-full p-2 rounded-xl border border-sand-300 bg-sand-50 font-mono text-xs text-forest-950 truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-2 rounded-xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-sand-800 text-xs font-semibold flex items-center gap-1 shrink-0 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons: Download QR, Print QR & Open Public Verification Page */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-sand-200">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="py-2.5 px-3 rounded-xl bg-honey-600 hover:bg-honey-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                  title="Download high-resolution QR image"
                >
                  <Download className="w-4 h-4" />
                  <span>Download QR</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintQr}
                  className="py-2.5 px-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                  title="Print bottle label with QR and batch details"
                >
                  <Printer className="w-4 h-4 text-honey-400" />
                  <span>Print QR</span>
                </button>

                <a
                  href={verificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-forest-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition text-center"
                  title="Open consumer verification page"
                >
                  <ExternalLink className="w-4 h-4 text-honey-600" />
                  <span>Open Verify Page</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
