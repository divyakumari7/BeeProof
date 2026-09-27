package com.beeproof.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class BatchVerificationResponse {
    private String batchNumber;
    private String verificationStatus;
    private String status;
    private LocalDate harvestDate;
    private String floralSource;
    private Double totalQuantityKg;
    private String blockchainTxHash;
    private Boolean blockchainVerified;
    private String stateMerkleRoot;
    private Long blockNumber;
    private String networkName;
    private String qrCodeUrl;

    private String clusterCode;
    private String clusterName;
    private String region;
    private String state;
    private String district;
    private Double latitude;
    private Double longitude;

    private QualitySummary qualitySummary;
    private List<ProvenanceEvent> timeline;

    public BatchVerificationResponse() {}

    public BatchVerificationResponse(String batchNumber, String verificationStatus, String status, LocalDate harvestDate,
                                   String floralSource, Double totalQuantityKg, String blockchainTxHash, String clusterCode,
                                   String clusterName, String region, String state, String district, Double latitude,
                                   Double longitude, QualitySummary qualitySummary, List<ProvenanceEvent> timeline) {
        this.batchNumber = batchNumber;
        this.verificationStatus = verificationStatus;
        this.status = status;
        this.harvestDate = harvestDate;
        this.floralSource = floralSource;
        this.totalQuantityKg = totalQuantityKg;
        this.blockchainTxHash = blockchainTxHash;
        this.clusterCode = clusterCode;
        this.clusterName = clusterName;
        this.region = region;
        this.state = state;
        this.district = district;
        this.latitude = latitude;
        this.longitude = longitude;
        this.qualitySummary = qualitySummary;
        this.timeline = timeline;
    }

    public static BatchVerificationResponseBuilder builder() { return new BatchVerificationResponseBuilder(); }

    public static class BatchVerificationResponseBuilder {
        private String batchNumber;
        private String verificationStatus;
        private String status;
        private LocalDate harvestDate;
        private String floralSource;
        private Double totalQuantityKg;
        private String blockchainTxHash;
        private Boolean blockchainVerified;
        private String stateMerkleRoot;
        private Long blockNumber;
        private String networkName;
        private String qrCodeUrl;
        private String clusterCode;
        private String clusterName;
        private String region;
        private String state;
        private String district;
        private Double latitude;
        private Double longitude;
        private QualitySummary qualitySummary;
        private List<ProvenanceEvent> timeline;

        public BatchVerificationResponseBuilder batchNumber(String batchNumber) { this.batchNumber = batchNumber; return this; }
        public BatchVerificationResponseBuilder verificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; return this; }
        public BatchVerificationResponseBuilder status(String status) { this.status = status; return this; }
        public BatchVerificationResponseBuilder harvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; return this; }
        public BatchVerificationResponseBuilder floralSource(String floralSource) { this.floralSource = floralSource; return this; }
        public BatchVerificationResponseBuilder totalQuantityKg(Double totalQuantityKg) { this.totalQuantityKg = totalQuantityKg; return this; }
        public BatchVerificationResponseBuilder blockchainTxHash(String blockchainTxHash) { this.blockchainTxHash = blockchainTxHash; return this; }
        public BatchVerificationResponseBuilder blockchainVerified(Boolean blockchainVerified) { this.blockchainVerified = blockchainVerified; return this; }
        public BatchVerificationResponseBuilder stateMerkleRoot(String stateMerkleRoot) { this.stateMerkleRoot = stateMerkleRoot; return this; }
        public BatchVerificationResponseBuilder blockNumber(Long blockNumber) { this.blockNumber = blockNumber; return this; }
        public BatchVerificationResponseBuilder networkName(String networkName) { this.networkName = networkName; return this; }
        public BatchVerificationResponseBuilder qrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; return this; }
        public BatchVerificationResponseBuilder clusterCode(String clusterCode) { this.clusterCode = clusterCode; return this; }
        public BatchVerificationResponseBuilder clusterName(String clusterName) { this.clusterName = clusterName; return this; }
        public BatchVerificationResponseBuilder region(String region) { this.region = region; return this; }
        public BatchVerificationResponseBuilder state(String state) { this.state = state; return this; }
        public BatchVerificationResponseBuilder district(String district) { this.district = district; return this; }
        public BatchVerificationResponseBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public BatchVerificationResponseBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public BatchVerificationResponseBuilder qualitySummary(QualitySummary qualitySummary) { this.qualitySummary = qualitySummary; return this; }
        public BatchVerificationResponseBuilder timeline(List<ProvenanceEvent> timeline) { this.timeline = timeline; return this; }

        public BatchVerificationResponse build() {
            BatchVerificationResponse r = new BatchVerificationResponse();
            r.batchNumber = batchNumber;
            r.verificationStatus = verificationStatus;
            r.status = status;
            r.harvestDate = harvestDate;
            r.floralSource = floralSource;
            r.totalQuantityKg = totalQuantityKg;
            r.blockchainTxHash = blockchainTxHash;
            r.blockchainVerified = blockchainVerified;
            r.stateMerkleRoot = stateMerkleRoot;
            r.blockNumber = blockNumber;
            r.networkName = networkName;
            r.qrCodeUrl = qrCodeUrl;
            r.clusterCode = clusterCode;
            r.clusterName = clusterName;
            r.region = region;
            r.state = state;
            r.district = district;
            r.latitude = latitude;
            r.longitude = longitude;
            r.qualitySummary = qualitySummary;
            r.timeline = timeline;
            return r;
        }
    }

    public static class QualitySummary {
        private String certificateNumber;
        private String laboratoryName;
        private Double moisturePercentage;
        private Double pollenPurityScore;
        private Boolean nmrSpectroscopyPassed;
        private Boolean c4SugarAdulterationDetected;
        private String verdict;
        private LocalDateTime certifiedAt;

        public QualitySummary() {}

        public QualitySummary(String certificateNumber, String laboratoryName, Double moisturePercentage,
                              Double pollenPurityScore, Boolean nmrSpectroscopyPassed, Boolean c4SugarAdulterationDetected,
                              String verdict, LocalDateTime certifiedAt) {
            this.certificateNumber = certificateNumber;
            this.laboratoryName = laboratoryName;
            this.moisturePercentage = moisturePercentage;
            this.pollenPurityScore = pollenPurityScore;
            this.nmrSpectroscopyPassed = nmrSpectroscopyPassed;
            this.c4SugarAdulterationDetected = c4SugarAdulterationDetected;
            this.verdict = verdict;
            this.certifiedAt = certifiedAt;
        }

        public static QualitySummaryBuilder builder() { return new QualitySummaryBuilder(); }

        public static class QualitySummaryBuilder {
            private String certificateNumber;
            private String laboratoryName;
            private Double moisturePercentage;
            private Double pollenPurityScore;
            private Boolean nmrSpectroscopyPassed;
            private Boolean c4SugarAdulterationDetected;
            private String verdict;
            private LocalDateTime certifiedAt;

            public QualitySummaryBuilder certificateNumber(String cert) { this.certificateNumber = cert; return this; }
            public QualitySummaryBuilder laboratoryName(String lab) { this.laboratoryName = lab; return this; }
            public QualitySummaryBuilder moisturePercentage(Double m) { this.moisturePercentage = m; return this; }
            public QualitySummaryBuilder pollenPurityScore(Double p) { this.pollenPurityScore = p; return this; }
            public QualitySummaryBuilder nmrSpectroscopyPassed(Boolean n) { this.nmrSpectroscopyPassed = n; return this; }
            public QualitySummaryBuilder c4SugarAdulterationDetected(Boolean c) { this.c4SugarAdulterationDetected = c; return this; }
            public QualitySummaryBuilder verdict(String v) { this.verdict = v; return this; }
            public QualitySummaryBuilder certifiedAt(LocalDateTime t) { this.certifiedAt = t; return this; }

            public QualitySummary build() {
                return new QualitySummary(certificateNumber, laboratoryName, moisturePercentage, pollenPurityScore,
                        nmrSpectroscopyPassed, c4SugarAdulterationDetected, verdict, certifiedAt);
            }
        }

        public String getCertificateNumber() { return certificateNumber; }
        public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }
        public String getLaboratoryName() { return laboratoryName; }
        public void setLaboratoryName(String laboratoryName) { this.laboratoryName = laboratoryName; }
        public Double getMoisturePercentage() { return moisturePercentage; }
        public void setMoisturePercentage(Double moisturePercentage) { this.moisturePercentage = moisturePercentage; }
        public Double getPollenPurityScore() { return pollenPurityScore; }
        public void setPollenPurityScore(Double pollenPurityScore) { this.pollenPurityScore = pollenPurityScore; }
        public Boolean getNmrSpectroscopyPassed() { return nmrSpectroscopyPassed; }
        public void setNmrSpectroscopyPassed(Boolean nmrSpectroscopyPassed) { this.nmrSpectroscopyPassed = nmrSpectroscopyPassed; }
        public Boolean getC4SugarAdulterationDetected() { return c4SugarAdulterationDetected; }
        public void setC4SugarAdulterationDetected(Boolean c4SugarAdulterationDetected) { this.c4SugarAdulterationDetected = c4SugarAdulterationDetected; }
        public String getVerdict() { return verdict; }
        public void setVerdict(String verdict) { this.verdict = verdict; }
        public LocalDateTime getCertifiedAt() { return certifiedAt; }
        public void setCertifiedAt(LocalDateTime certifiedAt) { this.certifiedAt = certifiedAt; }
    }

    public static class ProvenanceEvent {
        private String stage;
        private String title;
        private String actor;
        private String location;
        private LocalDateTime timestamp;
        private String details;
        private boolean completed;

        public ProvenanceEvent() {}

        public ProvenanceEvent(String stage, String title, String actor, String location,
                               LocalDateTime timestamp, String details, boolean completed) {
            this.stage = stage;
            this.title = title;
            this.actor = actor;
            this.location = location;
            this.timestamp = timestamp;
            this.details = details;
            this.completed = completed;
        }

        public static ProvenanceEventBuilder builder() { return new ProvenanceEventBuilder(); }

        public static class ProvenanceEventBuilder {
            private String stage;
            private String title;
            private String actor;
            private String location;
            private LocalDateTime timestamp;
            private String details;
            private boolean completed;

            public ProvenanceEventBuilder stage(String stage) { this.stage = stage; return this; }
            public ProvenanceEventBuilder title(String title) { this.title = title; return this; }
            public ProvenanceEventBuilder actor(String actor) { this.actor = actor; return this; }
            public ProvenanceEventBuilder location(String location) { this.location = location; return this; }
            public ProvenanceEventBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }
            public ProvenanceEventBuilder details(String details) { this.details = details; return this; }
            public ProvenanceEventBuilder completed(boolean completed) { this.completed = completed; return this; }

            public ProvenanceEvent build() {
                return new ProvenanceEvent(stage, title, actor, location, timestamp, details, completed);
            }
        }

        public String getStage() { return stage; }
        public void setStage(String stage) { this.stage = stage; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getActor() { return actor; }
        public void setActor(String actor) { this.actor = actor; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }
        public boolean isCompleted() { return completed; }
        public void setCompleted(boolean completed) { this.completed = completed; }
    }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }
    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDate getHarvestDate() { return harvestDate; }
    public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }
    public String getFloralSource() { return floralSource; }
    public void setFloralSource(String floralSource) { this.floralSource = floralSource; }
    public Double getTotalQuantityKg() { return totalQuantityKg; }
    public void setTotalQuantityKg(Double totalQuantityKg) { this.totalQuantityKg = totalQuantityKg; }
    public String getBlockchainTxHash() { return blockchainTxHash; }
    public void setBlockchainTxHash(String blockchainTxHash) { this.blockchainTxHash = blockchainTxHash; }
    public Boolean getBlockchainVerified() { return blockchainVerified; }
    public void setBlockchainVerified(Boolean blockchainVerified) { this.blockchainVerified = blockchainVerified; }
    public String getStateMerkleRoot() { return stateMerkleRoot; }
    public void setStateMerkleRoot(String stateMerkleRoot) { this.stateMerkleRoot = stateMerkleRoot; }
    public Long getBlockNumber() { return blockNumber; }
    public void setBlockNumber(Long blockNumber) { this.blockNumber = blockNumber; }
    public String getNetworkName() { return networkName; }
    public void setNetworkName(String networkName) { this.networkName = networkName; }
    public String getQrCodeUrl() { return qrCodeUrl; }
    public void setQrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; }
    public String getClusterCode() { return clusterCode; }
    public void setClusterCode(String clusterCode) { this.clusterCode = clusterCode; }
    public String getClusterName() { return clusterName; }
    public void setClusterName(String clusterName) { this.clusterName = clusterName; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public QualitySummary getQualitySummary() { return qualitySummary; }
    public void setQualitySummary(QualitySummary qualitySummary) { this.qualitySummary = qualitySummary; }
    public List<ProvenanceEvent> getTimeline() { return timeline; }
    public void setTimeline(List<ProvenanceEvent> timeline) { this.timeline = timeline; }
}
