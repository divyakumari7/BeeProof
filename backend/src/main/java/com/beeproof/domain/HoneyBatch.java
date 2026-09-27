package com.beeproof.domain;

import com.beeproof.domain.enums.BatchStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "honey_batches", indexes = {
    @Index(name = "idx_batches_number", columnList = "batchNumber")
})
public class HoneyBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String batchNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cluster_id", nullable = false)
    private Cluster cluster;

    @Column(nullable = false, length = 100)
    private String floralSource;

    @Column(nullable = false)
    private LocalDate harvestDate;

    @Column(nullable = false)
    private Double totalQuantityKg;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private BatchStatus status = BatchStatus.HARVESTED;

    @Column(length = 64)
    private String rawPurityIndex;

    @Column(length = 255)
    private String blockchainTxHash;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public HoneyBatch() {}

    public HoneyBatch(Long id, String batchNumber, Cluster cluster, String floralSource, LocalDate harvestDate,
                      Double totalQuantityKg, BatchStatus status, String rawPurityIndex, String blockchainTxHash,
                      LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.batchNumber = batchNumber;
        this.cluster = cluster;
        this.floralSource = floralSource;
        this.harvestDate = harvestDate;
        this.totalQuantityKg = totalQuantityKg;
        this.status = status != null ? status : BatchStatus.HARVESTED;
        this.rawPurityIndex = rawPurityIndex;
        this.blockchainTxHash = blockchainTxHash;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static HoneyBatchBuilder builder() { return new HoneyBatchBuilder(); }

    public static class HoneyBatchBuilder {
        private Long id;
        private String batchNumber;
        private Cluster cluster;
        private String floralSource;
        private LocalDate harvestDate;
        private Double totalQuantityKg;
        private BatchStatus status = BatchStatus.HARVESTED;
        private String rawPurityIndex;
        private String blockchainTxHash;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public HoneyBatchBuilder id(Long id) { this.id = id; return this; }
        public HoneyBatchBuilder batchNumber(String batchNumber) { this.batchNumber = batchNumber; return this; }
        public HoneyBatchBuilder cluster(Cluster cluster) { this.cluster = cluster; return this; }
        public HoneyBatchBuilder floralSource(String floralSource) { this.floralSource = floralSource; return this; }
        public HoneyBatchBuilder harvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; return this; }
        public HoneyBatchBuilder totalQuantityKg(Double totalQuantityKg) { this.totalQuantityKg = totalQuantityKg; return this; }
        public HoneyBatchBuilder status(BatchStatus status) { this.status = status; return this; }
        public HoneyBatchBuilder rawPurityIndex(String rawPurityIndex) { this.rawPurityIndex = rawPurityIndex; return this; }
        public HoneyBatchBuilder blockchainTxHash(String blockchainTxHash) { this.blockchainTxHash = blockchainTxHash; return this; }
        public HoneyBatchBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public HoneyBatchBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public HoneyBatch build() {
            return new HoneyBatch(id, batchNumber, cluster, floralSource, harvestDate, totalQuantityKg, status, rawPurityIndex, blockchainTxHash, createdAt, updatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }
    public Cluster getCluster() { return cluster; }
    public void setCluster(Cluster cluster) { this.cluster = cluster; }
    public String getFloralSource() { return floralSource; }
    public void setFloralSource(String floralSource) { this.floralSource = floralSource; }
    public LocalDate getHarvestDate() { return harvestDate; }
    public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }
    public Double getTotalQuantityKg() { return totalQuantityKg; }
    public void setTotalQuantityKg(Double totalQuantityKg) { this.totalQuantityKg = totalQuantityKg; }
    public BatchStatus getStatus() { return status; }
    public void setStatus(BatchStatus status) { this.status = status; }
    public String getRawPurityIndex() { return rawPurityIndex; }
    public void setRawPurityIndex(String rawPurityIndex) { this.rawPurityIndex = rawPurityIndex; }
    public String getBlockchainTxHash() { return blockchainTxHash; }
    public void setBlockchainTxHash(String blockchainTxHash) { this.blockchainTxHash = blockchainTxHash; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
