import React, { useState, useEffect } from 'react';
import { QrCode, Copy, Check, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

interface QrCodeDisplayProps {
  url: string;
  batchNumber: string;
  size?: number;
  dataUrl?: string;
  showActions?: boolean;
}

export const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({
  url,
  batchNumber,
  size = 180,
  dataUrl: initialDataUrl,
  showActions = true
}) => {
  const [copied, setCopied] = useState(false);
  const [localDataUrl, setLocalDataUrl] = useState<string | null>(initialDataUrl || null);

  useEffect(() => {
    if (initialDataUrl) {
      setLocalDataUrl(initialDataUrl);
      return;
    }
    let isMounted = true;
    const fetchQr = async () => {
      try {
        const origin = window.location.origin;
        const res = await api.getBatchQr(batchNumber, origin);
        if (isMounted && res.success && res.data?.dataUrl) {
          setLocalDataUrl(res.data.dataUrl);
        }
      } catch (e) {
        // Fallback to online service if backend QR route fails
      }
    };
    fetchQr();
    return () => {
      isMounted = false;
    };
  }, [batchNumber, initialDataUrl]);

  // Encode URL for QR code API as fallback
  const fallbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&color=0D2818&bgcolor=FFFFFF`;
  const displaySrc = localDataUrl || fallbackQrUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center bg-white border border-sand-200 p-4 rounded-2xl shadow-sm">
      <div className="relative p-3 bg-white rounded-xl shadow-inner border border-sand-200 flex items-center justify-center">
        <img
          id={`qr-img-${batchNumber}`}
          src={displaySrc}
          alt={`Verification QR for ${batchNumber}`}
          style={{ width: `${size}px`, height: `${size}px` }}
          className="object-contain rounded-lg"
          onError={(e) => {
            if (displaySrc !== fallbackQrUrl) {
              setLocalDataUrl(null);
            }
          }}
        />
      </div>

      {showActions && (
        <div className="mt-3 text-center space-y-2 w-full">
          <span className="text-[11px] font-mono text-sand-500 uppercase tracking-wider block">
            Scan with Mobile Camera to Verify
          </span>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-sand-50 hover:bg-sand-100 border border-sand-300 text-forest-900 rounded-xl transition font-medium cursor-pointer"
              title="Copy verification link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-sand-500" />}
              <span>{copied ? 'Copied Link' : 'Copy URL'}</span>
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-honey-600 hover:bg-honey-700 text-white rounded-xl transition font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Link</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
