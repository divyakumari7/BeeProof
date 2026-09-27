package com.beeproof.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "qr_codes", indexes = {
    @Index(name = "idx_qr_token", columnList = "qrSecurityToken")
})
public class QrCodeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id")
    private HoneyBatch batch;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id")
    private PackageEntity packageEntity;

    @Column(nullable = false, unique = true, length = 128)
    private String qrSecurityToken;

    @Column(nullable = false, length = 255)
    private String targetVerificationUrl;

    @Column(nullable = false)
    private Long totalScanCount = 0L;

    private LocalDateTime lastScannedAt;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime generatedAt;

    public QrCodeEntity() {}

    public QrCodeEntity(Long id, HoneyBatch batch, PackageEntity packageEntity, String qrSecurityToken,
                        String targetVerificationUrl, Long totalScanCount, LocalDateTime lastScannedAt, LocalDateTime generatedAt) {
        this.id = id;
        this.batch = batch;
        this.packageEntity = packageEntity;
        this.qrSecurityToken = qrSecurityToken;
        this.targetVerificationUrl = targetVerificationUrl;
        this.totalScanCount = totalScanCount != null ? totalScanCount : 0L;
        this.lastScannedAt = lastScannedAt;
        this.generatedAt = generatedAt;
    }

    public static QrCodeEntityBuilder builder() { return new QrCodeEntityBuilder(); }

    public static class QrCodeEntityBuilder {
        private Long id;
        private HoneyBatch batch;
        private PackageEntity packageEntity;
        private String qrSecurityToken;
        private String targetVerificationUrl;
        private Long totalScanCount = 0L;
        private LocalDateTime lastScannedAt;
        private LocalDateTime generatedAt;

        public QrCodeEntityBuilder id(Long id) { this.id = id; return this; }
        public QrCodeEntityBuilder batch(HoneyBatch batch) { this.batch = batch; return this; }
        public QrCodeEntityBuilder packageEntity(PackageEntity packageEntity) { this.packageEntity = packageEntity; return this; }
        public QrCodeEntityBuilder qrSecurityToken(String qrSecurityToken) { this.qrSecurityToken = qrSecurityToken; return this; }
        public QrCodeEntityBuilder targetVerificationUrl(String targetVerificationUrl) { this.targetVerificationUrl = targetVerificationUrl; return this; }
        public QrCodeEntityBuilder totalScanCount(Long totalScanCount) { this.totalScanCount = totalScanCount; return this; }
        public QrCodeEntityBuilder lastScannedAt(LocalDateTime lastScannedAt) { this.lastScannedAt = lastScannedAt; return this; }
        public QrCodeEntityBuilder generatedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; return this; }

        public QrCodeEntity build() {
            return new QrCodeEntity(id, batch, packageEntity, qrSecurityToken, targetVerificationUrl, totalScanCount, lastScannedAt, generatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public HoneyBatch getBatch() { return batch; }
    public void setBatch(HoneyBatch batch) { this.batch = batch; }
    public PackageEntity getPackageEntity() { return packageEntity; }
    public void setPackageEntity(PackageEntity packageEntity) { this.packageEntity = packageEntity; }
    public String getQrSecurityToken() { return qrSecurityToken; }
    public void setQrSecurityToken(String qrSecurityToken) { this.qrSecurityToken = qrSecurityToken; }
    public String getTargetVerificationUrl() { return targetVerificationUrl; }
    public void setTargetVerificationUrl(String targetVerificationUrl) { this.targetVerificationUrl = targetVerificationUrl; }
    public Long getTotalScanCount() { return totalScanCount; }
    public void setTotalScanCount(Long totalScanCount) { this.totalScanCount = totalScanCount; }
    public LocalDateTime getLastScannedAt() { return lastScannedAt; }
    public void setLastScannedAt(LocalDateTime lastScannedAt) { this.lastScannedAt = lastScannedAt; }
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
}
