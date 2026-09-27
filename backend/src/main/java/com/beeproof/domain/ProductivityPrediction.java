package com.beeproof.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "productivity_predictions")
public class ProductivityPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hive_id", nullable = false)
    private Hive hive;

    private Double predictedSurplusKg;
    private LocalDate targetHarvestDate;
    private Double confidenceScore;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime generatedAt;

    public ProductivityPrediction() {}

    public ProductivityPrediction(Long id, Hive hive, Double predictedSurplusKg, LocalDate targetHarvestDate,
                                  Double confidenceScore, LocalDateTime generatedAt) {
        this.id = id;
        this.hive = hive;
        this.predictedSurplusKg = predictedSurplusKg;
        this.targetHarvestDate = targetHarvestDate;
        this.confidenceScore = confidenceScore;
        this.generatedAt = generatedAt;
    }

    public static ProductivityPredictionBuilder builder() { return new ProductivityPredictionBuilder(); }

    public static class ProductivityPredictionBuilder {
        private Long id;
        private Hive hive;
        private Double predictedSurplusKg;
        private LocalDate targetHarvestDate;
        private Double confidenceScore;
        private LocalDateTime generatedAt;

        public ProductivityPredictionBuilder id(Long id) { this.id = id; return this; }
        public ProductivityPredictionBuilder hive(Hive hive) { this.hive = hive; return this; }
        public ProductivityPredictionBuilder predictedSurplusKg(Double predictedSurplusKg) { this.predictedSurplusKg = predictedSurplusKg; return this; }
        public ProductivityPredictionBuilder targetHarvestDate(LocalDate targetHarvestDate) { this.targetHarvestDate = targetHarvestDate; return this; }
        public ProductivityPredictionBuilder confidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; return this; }
        public ProductivityPredictionBuilder generatedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; return this; }

        public ProductivityPrediction build() {
            return new ProductivityPrediction(id, hive, predictedSurplusKg, targetHarvestDate, confidenceScore, generatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Hive getHive() { return hive; }
    public void setHive(Hive hive) { this.hive = hive; }
    public Double getPredictedSurplusKg() { return predictedSurplusKg; }
    public void setPredictedSurplusKg(Double predictedSurplusKg) { this.predictedSurplusKg = predictedSurplusKg; }
    public LocalDate getTargetHarvestDate() { return targetHarvestDate; }
    public void setTargetHarvestDate(LocalDate targetHarvestDate) { this.targetHarvestDate = targetHarvestDate; }
    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
}
