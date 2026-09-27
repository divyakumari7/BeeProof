package com.beeproof.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateBatchRequest {

    @NotNull(message = "Hive ID is required")
    private Long hiveId;

    @NotNull(message = "Quantity extracted is required")
    @DecimalMin(value = "0.5", message = "Minimum quantity is 0.5 kg")
    private Double quantityKg;

    @NotBlank(message = "Floral source is required")
    private String floralSource;

    @NotNull(message = "Harvest date is required")
    private LocalDate harvestDate;

    private Double moistureContentPercentage;
    private String notes;

    public CreateBatchRequest() {}

    public CreateBatchRequest(Long hiveId, Double quantityKg, String floralSource, LocalDate harvestDate, Double moistureContentPercentage, String notes) {
        this.hiveId = hiveId;
        this.quantityKg = quantityKg;
        this.floralSource = floralSource;
        this.harvestDate = harvestDate;
        this.moistureContentPercentage = moistureContentPercentage;
        this.notes = notes;
    }

    public Long getHiveId() { return hiveId; }
    public void setHiveId(Long hiveId) { this.hiveId = hiveId; }
    public Double getQuantityKg() { return quantityKg; }
    public void setQuantityKg(Double quantityKg) { this.quantityKg = quantityKg; }
    public String getFloralSource() { return floralSource; }
    public void setFloralSource(String floralSource) { this.floralSource = floralSource; }
    public LocalDate getHarvestDate() { return harvestDate; }
    public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }
    public Double getMoistureContentPercentage() { return moistureContentPercentage; }
    public void setMoistureContentPercentage(Double moistureContentPercentage) { this.moistureContentPercentage = moistureContentPercentage; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
