package com.beeproof.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class BatchResponse {
    private Long id;
    private String batchNumber;
    private String clusterCode;
    private String clusterName;
    private String floralSource;
    private LocalDate harvestDate;
    private Double totalQuantityKg;
    private String status;
    private String blockchainTxHash;
    private String stateMerkleRoot;
    private Long blockNumber;
    private String qrCodeUrl;
    private LocalDateTime createdAt;

    public BatchResponse() {}

    public BatchResponse(Long id, String batchNumber, String clusterCode, String clusterName, String floralSource,
                         LocalDate harvestDate, Double totalQuantityKg, String status, String blockchainTxHash,
                         String stateMerkleRoot, Long blockNumber, String qrCodeUrl, LocalDateTime createdAt) {
        this.id = id;
        this.batchNumber = batchNumber;
        this.clusterCode = clusterCode;
        this.clusterName = clusterName;
        this.floralSource = floralSource;
        this.harvestDate = harvestDate;
        this.totalQuantityKg = totalQuantityKg;
        this.status = status;
        this.blockchainTxHash = blockchainTxHash;
        this.stateMerkleRoot = stateMerkleRoot;
        this.blockNumber = blockNumber;
        this.qrCodeUrl = qrCodeUrl;
        this.createdAt = createdAt;
    }

    public static BatchResponseBuilder builder() { return new BatchResponseBuilder(); }

    public static class BatchResponseBuilder {
        private Long id;
        private String batchNumber;
        private String clusterCode;
        private String clusterName;
        private String floralSource;
        private LocalDate harvestDate;
        private Double totalQuantityKg;
        private String status;
        private String blockchainTxHash;
        private String stateMerkleRoot;
        private Long blockNumber;
        private String qrCodeUrl;
        private LocalDateTime createdAt;

        public BatchResponseBuilder id(Long id) { this.id = id; return this; }
        public BatchResponseBuilder batchNumber(String batchNumber) { this.batchNumber = batchNumber; return this; }
        public BatchResponseBuilder clusterCode(String clusterCode) { this.clusterCode = clusterCode; return this; }
        public BatchResponseBuilder clusterName(String clusterName) { this.clusterName = clusterName; return this; }
        public BatchResponseBuilder floralSource(String floralSource) { this.floralSource = floralSource; return this; }
        public BatchResponseBuilder harvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; return this; }
        public BatchResponseBuilder totalQuantityKg(Double totalQuantityKg) { this.totalQuantityKg = totalQuantityKg; return this; }
        public BatchResponseBuilder status(String status) { this.status = status; return this; }
        public BatchResponseBuilder blockchainTxHash(String blockchainTxHash) { this.blockchainTxHash = blockchainTxHash; return this; }
        public BatchResponseBuilder stateMerkleRoot(String stateMerkleRoot) { this.stateMerkleRoot = stateMerkleRoot; return this; }
        public BatchResponseBuilder blockNumber(Long blockNumber) { this.blockNumber = blockNumber; return this; }
        public BatchResponseBuilder qrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; return this; }
        public BatchResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public BatchResponse build() {
            return new BatchResponse(id, batchNumber, clusterCode, clusterName, floralSource, harvestDate, totalQuantityKg, status, blockchainTxHash, stateMerkleRoot, blockNumber, qrCodeUrl, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }
    public String getClusterCode() { return clusterCode; }
    public void setClusterCode(String clusterCode) { this.clusterCode = clusterCode; }
    public String getClusterName() { return clusterName; }
    public void setClusterName(String clusterName) { this.clusterName = clusterName; }
    public String getFloralSource() { return floralSource; }
    public void setFloralSource(String floralSource) { this.floralSource = floralSource; }
    public LocalDate getHarvestDate() { return harvestDate; }
    public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }
    public Double getTotalQuantityKg() { return totalQuantityKg; }
    public void setTotalQuantityKg(Double totalQuantityKg) { this.totalQuantityKg = totalQuantityKg; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getBlockchainTxHash() { return blockchainTxHash; }
    public void setBlockchainTxHash(String blockchainTxHash) { this.blockchainTxHash = blockchainTxHash; }
    public String getStateMerkleRoot() { return stateMerkleRoot; }
    public void setStateMerkleRoot(String stateMerkleRoot) { this.stateMerkleRoot = stateMerkleRoot; }
    public Long getBlockNumber() { return blockNumber; }
    public void setBlockNumber(Long blockNumber) { this.blockNumber = blockNumber; }
    public String getQrCodeUrl() { return qrCodeUrl; }
    public void setQrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
