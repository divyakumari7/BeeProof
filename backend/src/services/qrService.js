const QRCode = require('qrcode');

class QrService {
  getVerificationUrl(batchNumber, reqOrOrigin) {
    let frontendBase = null;

    if (typeof reqOrOrigin === 'string' && reqOrOrigin.startsWith('http')) {
      frontendBase = reqOrOrigin.replace(/\/+$/, '');
    } else if (reqOrOrigin && typeof reqOrOrigin === 'object') {
      const origin = reqOrOrigin.get ? reqOrOrigin.get('origin') : (reqOrOrigin.headers && reqOrOrigin.headers.origin);
      const referer = reqOrOrigin.get ? reqOrOrigin.get('referer') : (reqOrOrigin.headers && reqOrOrigin.headers.referer);
      if (origin) {
        frontendBase = origin.replace(/\/+$/, '');
      } else if (referer) {
        try {
          const u = new URL(referer);
          frontendBase = `${u.protocol}//${u.host}`;
        } catch (e) {
          // ignore
        }
      }
    }

    if (!frontendBase) {
      frontendBase = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
    }

    return `${frontendBase}/verify/${encodeURIComponent(batchNumber)}`;
  }

  async generateQrDataUrl(batchNumber, reqOrOrigin) {
    const url = typeof reqOrOrigin === 'string' && reqOrOrigin.includes('/verify/')
      ? reqOrOrigin
      : this.getVerificationUrl(batchNumber, reqOrOrigin);

    try {
      const dataUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 320,
        margin: 2,
        color: {
          dark: '#0D2818',
          light: '#FFFFFF'
        }
      });
      return { url, dataUrl, batchNumber };
    } catch (err) {
      console.error('Error generating QR code:', err);
      return { url, dataUrl: null, batchNumber };
    }
  }
}

module.exports = new QrService();
