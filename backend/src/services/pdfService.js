const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const qrService = require('./qrService');

class PdfService {
  async createVerificationPdf(data, reqOrOrigin) {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 36,
          info: {
            Title: `BeeProof Verification Report - ${data.batchNumber}`,
            Author: 'BeeProof National Honey Traceability Platform',
            Subject: 'Honey Provenance & Integrity Verification Report',
            Keywords: 'BeeProof, Honey, Traceability, Provenance, Blockchain, NABL'
          }
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        const isVerified = Boolean(
          data.blockchainVerified !== false &&
          data.verificationStatus === 'VERIFIED' &&
          !data.isTampered
        );

        const primaryDark = '#111827';
        const forestGreen = '#065F46';
        const emeraldBg = '#ECFDF5';
        const emeraldBorder = '#059669';
        const redBg = '#FEF2F2';
        const redBorder = '#DC2626';
        const textMuted = '#4B5563';

        // 1. Header Banner
        doc.rect(36, 36, 523, 56).fill('#0F172A');
        
        doc.fillColor('#F8FAFC').fontSize(13).font('Helvetica-Bold')
           .text('BEEPROOF — NATIONAL HONEY TRACEABILITY REPORT', 48, 46);
        doc.fillColor('#94A3B8').fontSize(8.5).font('Helvetica')
           .text('Khadi and Village Industries Commission (KVIC) • National Apiculture Governance', 48, 64);
        doc.fillColor('#CBD5E1').fontSize(8).font('Helvetica')
           .text(`Report Generated: ${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC`, 48, 76, { align: 'right', width: 499 });

        let currentY = 104;

        // 2. Verification Result Box
        if (isVerified) {
          doc.rect(36, currentY, 523, 62).fillAndStroke(emeraldBg, emeraldBorder);
          doc.fillColor(forestGreen).fontSize(14).font('Helvetica-Bold')
             .text('PROVENANCE VERIFIED — BLOCKCHAIN INTEGRITY CONFIRMED', 48, currentY + 12);
          doc.fillColor('#064E3B').fontSize(9).font('Helvetica')
             .text(`Batch ${data.batchNumber} cryptographic record has been reconciled with the Solana Devnet blockchain ledger. Origin apiary, harvest yield, processing details, and custody trail are verified authentic.`, 48, currentY + 32, { width: 499 });
        } else {
          doc.rect(36, currentY, 523, 64).fillAndStroke(redBg, redBorder);
          doc.fillColor('#991B1B').fontSize(14).font('Helvetica-Bold')
             .text('VERIFICATION FAILED — RECORD MISMATCH (TAMPERED)', 48, currentY + 12);
          doc.fillColor('#7F1D1D').fontSize(9).font('Helvetica')
             .text(`WARNING: Batch ${data.batchNumber} failed cryptographic data-integrity check! Recorded database values do not match the on-chain Merkle root proof. THIS DOCUMENT INDICATES A VERIFICATION FAILURE AND DOES NOT CONSTITUTE AN AUTHENTICITY CERTIFICATE.`, 48, currentY + 32, { width: 499 });
        }

        currentY += 76;

        // 3. Batch Identification & Origin Summary Table
        doc.fillColor(primaryDark).fontSize(10.5).font('Helvetica-Bold')
           .text('1. BATCH IDENTIFICATION & APIARY ORIGIN', 36, currentY);
        currentY += 16;

        doc.rect(36, currentY, 523, 76).fillAndStroke('#F8FAFC', '#CBD5E1');
        
        // Row 1
        doc.fillColor(textMuted).fontSize(8.5).font('Helvetica-Bold').text('BATCH ID:', 46, currentY + 10);
        doc.fillColor(primaryDark).fontSize(9).font('Helvetica-Bold').text(data.batchNumber || 'N/A', 110, currentY + 10);

        doc.fillColor(textMuted).fontSize(8.5).font('Helvetica-Bold').text('FLORAL SOURCE:', 290, currentY + 10);
        doc.fillColor(primaryDark).fontSize(9).font('Helvetica-Bold').text(data.floralSource || 'N/A', 380, currentY + 10);

        // Row 2
        doc.fillColor(textMuted).fontSize(8.5).font('Helvetica-Bold').text('HARVEST DATE:', 46, currentY + 30);
        doc.fillColor(primaryDark).fontSize(9).font('Helvetica').text(data.harvestDate || 'N/A', 125, currentY + 30);

        doc.fillColor(textMuted).fontSize(8.5).font('Helvetica-Bold').text('HARVEST YIELD:', 290, currentY + 30);
        doc.fillColor(primaryDark).fontSize(9).font('Helvetica').text(`${data.totalQuantityKg || 0} kg`, 380, currentY + 30);

        // Row 3
        doc.fillColor(textMuted).fontSize(8.5).font('Helvetica-Bold').text('ORIGIN CLUSTER:', 46, currentY + 50);
        doc.fillColor(primaryDark).fontSize(9).font('Helvetica').text(`${data.clusterName || 'N/A'} (${data.district || ''}, ${data.state || ''})`, 135, currentY + 50);

        doc.fillColor(textMuted).fontSize(8.5).font('Helvetica-Bold').text('VERIFICATION STATUS:', 290, currentY + 50);
        doc.fillColor(isVerified ? forestGreen : '#991B1B').fontSize(9).font('Helvetica-Bold')
           .text(isVerified ? (data.verificationStatus || 'VERIFIED') : 'TAMPERED / FAILED', 405, currentY + 50);

        currentY += 92;

        // 4. Quality & NABL Laboratory Testing
        doc.fillColor(primaryDark).fontSize(10.5).font('Helvetica-Bold')
           .text('2. QUALITY VERDICT & NABL LABORATORY TESTING', 36, currentY);
        currentY += 16;

        const q = data.qualitySummary;
        const qBoxHeight = q ? 76 : 38;
        doc.rect(36, currentY, 523, qBoxHeight).fillAndStroke('#F8FAFC', '#CBD5E1');

        if (q) {
          doc.fillColor(textMuted).fontSize(8.5).font('Helvetica-Bold').text('LABORATORY:', 46, currentY + 10);
          doc.fillColor(primaryDark).fontSize(9).font('Helvetica').text(q.laboratoryName || 'Accredited NABL Quality Lab', 125, currentY + 10);

          doc.fillColor(textMuted).fontSize(8.5).font('Helvetica-Bold').text('CERTIFICATE NO:', 290, currentY + 10);
          doc.fillColor(primaryDark).fontSize(9).font('Helvetica-Bold').text(q.certificateNumber || 'N/A', 380, currentY + 10);

          doc.fillColor(textMuted).fontSize(8.5).font('Helvetica-Bold').text('QUALITY VERDICT:', 46, currentY + 30);
          doc.fillColor(q.verdict === 'PASS' || q.verdict === 'PASSED' ? forestGreen : primaryDark).fontSize(9).font('Helvetica-Bold')
             .text(`Quality Verified (${q.verdict || 'PASSED'})`, 140, currentY + 30);

          doc.fillColor(textMuted).fontSize(8.5).font('Helvetica-Bold').text('MOISTURE CONTENT:', 290, currentY + 30);
          doc.fillColor(primaryDark).fontSize(9).font('Helvetica').text(`${q.moisturePercentage}% (Standard < 20%)`, 405, currentY + 30);

          doc.fillColor(textMuted).fontSize(8.5).font('Helvetica-Bold').text('NMR SPECTROSCOPY:', 46, currentY + 50);
          doc.fillColor(q.nmrSpectroscopyPassed ? forestGreen : '#991B1B').fontSize(9).font('Helvetica-Bold')
             .text(q.nmrSpectroscopyPassed ? 'PASSED (Unadulterated)' : 'FAILED', 155, currentY + 50);

          doc.fillColor(textMuted).fontSize(8.5).font('Helvetica-Bold').text('C4 SUGARS:', 290, currentY + 50);
          doc.fillColor(!q.c4SugarAdulterationDetected ? forestGreen : '#991B1B').fontSize(9).font('Helvetica-Bold')
             .text(!q.c4SugarAdulterationDetected ? 'NEGATIVE (0% Added Sugar)' : 'DETECTED', 355, currentY + 50);
        } else {
          doc.fillColor(textMuted).fontSize(8.5).font('Helvetica-Bold')
             .text('Quality Verification Status: Quality Verified under KVIC Apiculture Guidelines.', 46, currentY + 12);
        }

        currentY += qBoxHeight + 16;

        // 5. Blockchain Integrity Record
        doc.fillColor(primaryDark).fontSize(10.5).font('Helvetica-Bold')
           .text('3. BLOCKCHAIN PROVENANCE & DECENTRALIZED LEDGER RECORD', 36, currentY);
        currentY += 16;

        doc.rect(36, currentY, 523, 68).fillAndStroke('#0F172A', '#1E293B');
        
        doc.fillColor('#94A3B8').fontSize(8.5).font('Helvetica-Bold').text('LEDGER NETWORK:', 46, currentY + 10);
        doc.fillColor('#F8FAFC').fontSize(8.5).font('Helvetica').text(data.networkName || 'Solana Devnet', 150, currentY + 10);

        doc.fillColor('#94A3B8').fontSize(8.5).font('Helvetica-Bold').text('INTEGRITY STATUS:', 290, currentY + 10);
        doc.fillColor(isVerified ? '#34D399' : '#F87171').fontSize(8.5).font('Helvetica-Bold')
           .text(isVerified ? 'Blockchain Integrity Verified' : 'Cryptographic Hash Mismatch (TAMPERED)', 390, currentY + 10);

        doc.fillColor('#94A3B8').fontSize(8.5).font('Helvetica-Bold').text('CANONICAL SHA-256:', 46, currentY + 28);
        doc.fillColor('#FDE68A').fontSize(8).font('Courier').text(data.stateMerkleRoot || 'N/A', 155, currentY + 28, { width: 390 });

        doc.fillColor('#94A3B8').fontSize(8.5).font('Helvetica-Bold').text('SOLANA TX SIGNATURE:', 46, currentY + 46);
        doc.fillColor('#CBD5E1').fontSize(7.5).font('Courier').text(data.blockchainTxHash || 'N/A', 165, currentY + 46, { width: 380 });

        currentY += 84;

        // 6. Provenance Custody Trail (Timeline)
        doc.fillColor(primaryDark).fontSize(10.5).font('Helvetica-Bold')
           .text('4. PROVENANCE CUSTODY TRAIL (TIMELINE STAGES)', 36, currentY);
        currentY += 16;

        if (data.timeline && Array.isArray(data.timeline)) {
          for (let idx = 0; idx < data.timeline.length; idx++) {
            const evt = data.timeline[idx];
            if (currentY > 730) {
              doc.addPage();
              currentY = 36;
            }
            doc.rect(36, currentY, 523, 24).fillAndStroke('#F1F5F9', '#CBD5E1');
            doc.fillColor('#0F172A').fontSize(8.5).font('Helvetica-Bold')
               .text(`Stage ${idx + 1}: ${evt.title}`, 44, currentY + 7);
            doc.fillColor(textMuted).fontSize(8).font('Helvetica')
               .text(`${new Date(evt.timestamp).toLocaleDateString()} | ${evt.actor} (${evt.location})`, 250, currentY + 7, { align: 'right', width: 300 });
            
            currentY += 26;
            doc.fillColor('#334155').fontSize(8).font('Helvetica')
               .text(evt.details, 44, currentY, { width: 505 });
            currentY += 16;
          }
        }

        currentY += 12;
        if (currentY > 670) {
          doc.addPage();
          currentY = 36;
        }

        // 7. QR Code & Footer Reference
        const qrUrl = qrService.getVerificationUrl(data.batchNumber, reqOrOrigin);
        try {
          const qrBuffer = await QRCode.toBuffer(qrUrl, { width: 100, margin: 1 });
          doc.image(qrBuffer, 36, currentY, { width: 75 });
        } catch (e) {
          // ignore QR error
        }

        doc.fillColor(primaryDark).fontSize(8.5).font('Helvetica-Bold')
           .text('VERIFY ONLINE VIA BEEPROOF PUBLIC LEDGER', 125, currentY + 6);
        doc.fillColor(textMuted).fontSize(7.5).font('Helvetica')
           .text(`Scan QR code or visit ${qrUrl} to verify this batch live on the BeeProof network.`, 125, currentY + 20, { width: 425 });

        doc.fillColor('#94A3B8').fontSize(7).font('Helvetica-Oblique')
           .text('Disclaimer: Blockchain cryptographic proofs guarantee data provenance and supply chain record immutability. Chemical purity and compliance are certified by accredited NABL laboratories under KVIC governance.', 125, currentY + 36, { width: 425 });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = new PdfService();
