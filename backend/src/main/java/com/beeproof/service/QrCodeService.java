package com.beeproof.service;

import com.beeproof.domain.HoneyBatch;
import com.beeproof.domain.QrCodeEntity;
import com.beeproof.repository.QrCodeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class QrCodeService {

    private final QrCodeRepository qrCodeRepository;

    @Value("${beeproof.frontend.url:http://localhost:5173}")
    private String frontendBaseUrl;

    public QrCodeService(QrCodeRepository qrCodeRepository) {
        this.qrCodeRepository = qrCodeRepository;
    }

    @Transactional
    public QrCodeEntity generateBatchQrCode(HoneyBatch batch) {
        Optional<QrCodeEntity> existing = qrCodeRepository.findByBatch(batch);
        if (existing.isPresent()) {
            return existing.get();
        }

        String targetUrl = frontendBaseUrl + "/verify/" + batch.getBatchNumber();
        String token = "BP-QR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        QrCodeEntity qrCode = QrCodeEntity.builder()
                .batch(batch)
                .qrSecurityToken(token)
                .targetVerificationUrl(targetUrl)
                .totalScanCount(0L)
                .generatedAt(LocalDateTime.now())
                .build();

        return qrCodeRepository.save(qrCode);
    }

    @Transactional
    public void incrementScanCount(HoneyBatch batch) {
        qrCodeRepository.findByBatch(batch).ifPresent(qr -> {
            qr.setTotalScanCount(qr.getTotalScanCount() + 1);
            qr.setLastScannedAt(LocalDateTime.now());
            qrCodeRepository.save(qr);
        });
    }

    public Optional<QrCodeEntity> getByBatch(HoneyBatch batch) {
        return qrCodeRepository.findByBatch(batch);
    }
}
