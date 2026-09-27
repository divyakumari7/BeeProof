package com.beeproof.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SupplyChainDtos {

    public static class CollectBatchRequest {
        @NotBlank(message = "Collection location is required")
        private String collectionLocation;
        private String notes;

        public CollectBatchRequest() {}
        public CollectBatchRequest(String collectionLocation, String notes) {
            this.collectionLocation = collectionLocation;
            this.notes = notes;
        }
        public String getCollectionLocation() { return collectionLocation; }
        public void setCollectionLocation(String collectionLocation) { this.collectionLocation = collectionLocation; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class ProcessBatchRequest {
        @NotBlank(message = "Facility name is required")
        private String facilityName;

        @NotBlank(message = "Operation type is required")
        private String operationType; // e.g. COLD_FILTRATION

        @NotNull(message = "Processed quantity is required")
        @DecimalMin(value = "0.1")
        private Double processedQuantityKg;

        private Double finalMoisturePercent;
        private Double processingTemperatureCelsius;
        private String notes;

        public ProcessBatchRequest() {}
        public ProcessBatchRequest(String facilityName, String operationType, Double processedQuantityKg,
                                   Double finalMoisturePercent, Double processingTemperatureCelsius, String notes) {
            this.facilityName = facilityName;
            this.operationType = operationType;
            this.processedQuantityKg = processedQuantityKg;
            this.finalMoisturePercent = finalMoisturePercent;
            this.processingTemperatureCelsius = processingTemperatureCelsius;
            this.notes = notes;
        }

        public String getFacilityName() { return facilityName; }
        public void setFacilityName(String facilityName) { this.facilityName = facilityName; }
        public String getOperationType() { return operationType; }
        public void setOperationType(String operationType) { this.operationType = operationType; }
        public Double getProcessedQuantityKg() { return processedQuantityKg; }
        public void setProcessedQuantityKg(Double processedQuantityKg) { this.processedQuantityKg = processedQuantityKg; }
        public Double getFinalMoisturePercent() { return finalMoisturePercent; }
        public void setFinalMoisturePercent(Double finalMoisturePercent) { this.finalMoisturePercent = finalMoisturePercent; }
        public Double getProcessingTemperatureCelsius() { return processingTemperatureCelsius; }
        public void setProcessingTemperatureCelsius(Double processingTemperatureCelsius) { this.processingTemperatureCelsius = processingTemperatureCelsius; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class QualityVerificationRequest {
        @NotBlank(message = "Certificate number is required")
        private String certificateNumber;

        @NotBlank(message = "Laboratory name is required")
        private String laboratoryName;

        @NotNull(message = "Moisture percentage is required")
        private Double moisturePercentage;

        private Double fructosePercentage;
        private Double glucosePercentage;
        private Double sucrosePercentage;

        @NotNull(message = "Pollen purity score is required")
        private Double pollenPurityScore;

        @NotNull(message = "NMR spectroscopy result is required")
        private Boolean nmrSpectroscopyPassed;

        @NotNull(message = "C4 sugar adulteration flag is required")
        private Boolean c4SugarAdulterationDetected;

        @NotBlank(message = "Overall verdict is required (PASSED / REJECTED)")
        private String overallVerdict; // PASSED or REJECTED

        private String remarks;

        public QualityVerificationRequest() {}

        public String getCertificateNumber() { return certificateNumber; }
        public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }
        public String getLaboratoryName() { return laboratoryName; }
        public void setLaboratoryName(String laboratoryName) { this.laboratoryName = laboratoryName; }
        public Double getMoisturePercentage() { return moisturePercentage; }
        public void setMoisturePercentage(Double moisturePercentage) { this.moisturePercentage = moisturePercentage; }
        public Double getFructosePercentage() { return fructosePercentage; }
        public void setFructosePercentage(Double fructosePercentage) { this.fructosePercentage = fructosePercentage; }
        public Double getGlucosePercentage() { return glucosePercentage; }
        public void setGlucosePercentage(Double glucosePercentage) { this.glucosePercentage = glucosePercentage; }
        public Double getSucrosePercentage() { return sucrosePercentage; }
        public void setSucrosePercentage(Double sucrosePercentage) { this.sucrosePercentage = sucrosePercentage; }
        public Double getPollenPurityScore() { return pollenPurityScore; }
        public void setPollenPurityScore(Double pollenPurityScore) { this.pollenPurityScore = pollenPurityScore; }
        public Boolean getNmrSpectroscopyPassed() { return nmrSpectroscopyPassed; }
        public void setNmrSpectroscopyPassed(Boolean nmrSpectroscopyPassed) { this.nmrSpectroscopyPassed = nmrSpectroscopyPassed; }
        public Boolean getC4SugarAdulterationDetected() { return c4SugarAdulterationDetected; }
        public void setC4SugarAdulterationDetected(Boolean c4SugarAdulterationDetected) { this.c4SugarAdulterationDetected = c4SugarAdulterationDetected; }
        public String getOverallVerdict() { return overallVerdict; }
        public void setOverallVerdict(String overallVerdict) { this.overallVerdict = overallVerdict; }
        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
    }

    public static class PackageBatchRequest {
        @NotBlank(message = "Packaging type is required")
        private String packagingType; // e.g. 500g_GLASS_JAR

        @NotNull(message = "Unit count is required")
        private Integer unitCount;

        @NotNull(message = "Net weight per unit is required")
        private Double netWeightGrams;

        private Integer bestBeforeMonths; // default 24

        public PackageBatchRequest() {}

        public String getPackagingType() { return packagingType; }
        public void setPackagingType(String packagingType) { this.packagingType = packagingType; }
        public Integer getUnitCount() { return unitCount; }
        public void setUnitCount(Integer unitCount) { this.unitCount = unitCount; }
        public Double getNetWeightGrams() { return netWeightGrams; }
        public void setNetWeightGrams(Double netWeightGrams) { this.netWeightGrams = netWeightGrams; }
        public Integer getBestBeforeMonths() { return bestBeforeMonths; }
        public void setBestBeforeMonths(Integer bestBeforeMonths) { this.bestBeforeMonths = bestBeforeMonths; }
    }

    public static class DispatchBatchRequest {
        @NotBlank(message = "Origin location is required")
        private String originLocation;

        @NotBlank(message = "Destination location is required")
        private String destinationLocation;

        @NotNull(message = "Quantity dispatched is required")
        private Double quantityDispatchedKg;

        private Double ambientTemperatureCelsius;
        private String trackingReference;

        public DispatchBatchRequest() {}

        public String getOriginLocation() { return originLocation; }
        public void setOriginLocation(String originLocation) { this.originLocation = originLocation; }
        public String getDestinationLocation() { return destinationLocation; }
        public void setDestinationLocation(String destinationLocation) { this.destinationLocation = destinationLocation; }
        public Double getQuantityDispatchedKg() { return quantityDispatchedKg; }
        public void setQuantityDispatchedKg(Double quantityDispatchedKg) { this.quantityDispatchedKg = quantityDispatchedKg; }
        public Double getAmbientTemperatureCelsius() { return ambientTemperatureCelsius; }
        public void setAmbientTemperatureCelsius(Double ambientTemperatureCelsius) { this.ambientTemperatureCelsius = ambientTemperatureCelsius; }
        public String getTrackingReference() { return trackingReference; }
        public void setTrackingReference(String trackingReference) { this.trackingReference = trackingReference; }
    }

    public static class DeliverBatchRequest {
        @NotBlank(message = "Destination depot confirmation is required")
        private String destinationDepot;
        private String remarks;

        public DeliverBatchRequest() {}

        public String getDestinationDepot() { return destinationDepot; }
        public void setDestinationDepot(String destinationDepot) { this.destinationDepot = destinationDepot; }
        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
    }
}
