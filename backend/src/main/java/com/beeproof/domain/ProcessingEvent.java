package com.beeproof.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "processing_events")
public class ProcessingEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private HoneyBatch batch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processor_user_id", nullable = false)
    private User processor;

    @Column(nullable = false, length = 100)
    private String facilityName;

    @Column(nullable = false, length = 50)
    private String operationType;

    private Double processedQuantityKg;
    private Double finalMoisturePercent;
    private Double processingTemperatureCelsius;

    @Column(nullable = false)
    private LocalDateTime processedAt;

    @Column(length = 255)
    private String notes;

    public ProcessingEvent() {}

    public ProcessingEvent(Long id, HoneyBatch batch, User processor, String facilityName, String operationType,
                           Double processedQuantityKg, Double finalMoisturePercent, Double processingTemperatureCelsius,
                           LocalDateTime processedAt, String notes) {
        this.id = id;
        this.batch = batch;
        this.processor = processor;
        this.facilityName = facilityName;
        this.operationType = operationType;
        this.processedQuantityKg = processedQuantityKg;
        this.finalMoisturePercent = finalMoisturePercent;
        this.processingTemperatureCelsius = processingTemperatureCelsius;
        this.processedAt = processedAt;
        this.notes = notes;
    }

    public static ProcessingEventBuilder builder() { return new ProcessingEventBuilder(); }

    public static class ProcessingEventBuilder {
        private Long id;
        private HoneyBatch batch;
        private User processor;
        private String facilityName;
        private String operationType;
        private Double processedQuantityKg;
        private Double finalMoisturePercent;
        private Double processingTemperatureCelsius;
        private LocalDateTime processedAt;
        private String notes;

        public ProcessingEventBuilder id(Long id) { this.id = id; return this; }
        public ProcessingEventBuilder batch(HoneyBatch batch) { this.batch = batch; return this; }
        public ProcessingEventBuilder processor(User processor) { this.processor = processor; return this; }
        public ProcessingEventBuilder facilityName(String facilityName) { this.facilityName = facilityName; return this; }
        public ProcessingEventBuilder operationType(String operationType) { this.operationType = operationType; return this; }
        public ProcessingEventBuilder processedQuantityKg(Double processedQuantityKg) { this.processedQuantityKg = processedQuantityKg; return this; }
        public ProcessingEventBuilder finalMoisturePercent(Double finalMoisturePercent) { this.finalMoisturePercent = finalMoisturePercent; return this; }
        public ProcessingEventBuilder processingTemperatureCelsius(Double processingTemperatureCelsius) { this.processingTemperatureCelsius = processingTemperatureCelsius; return this; }
        public ProcessingEventBuilder processedAt(LocalDateTime processedAt) { this.processedAt = processedAt; return this; }
        public ProcessingEventBuilder notes(String notes) { this.notes = notes; return this; }

        public ProcessingEvent build() {
            return new ProcessingEvent(id, batch, processor, facilityName, operationType, processedQuantityKg, finalMoisturePercent, processingTemperatureCelsius, processedAt, notes);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public HoneyBatch getBatch() { return batch; }
    public void setBatch(HoneyBatch batch) { this.batch = batch; }
    public User getProcessor() { return processor; }
    public void setProcessor(User processor) { this.processor = processor; }
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
    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
