package com.beeproof.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "disease_predictions")
public class DiseasePrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hive_id", nullable = false)
    private Hive hive;

    @Column(nullable = false, length = 100)
    private String pathogenOrPestName;

    private Double detectionProbability;

    @Column(length = 50)
    private String severityLevel;

    @Column(length = 255)
    private String recommendedIntervention;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime detectedAt;

    public DiseasePrediction() {}

    public DiseasePrediction(Long id, Hive hive, String pathogenOrPestName, Double detectionProbability,
                             String severityLevel, String recommendedIntervention, LocalDateTime detectedAt) {
        this.id = id;
        this.hive = hive;
        this.pathogenOrPestName = pathogenOrPestName;
        this.detectionProbability = detectionProbability;
        this.severityLevel = severityLevel;
        this.recommendedIntervention = recommendedIntervention;
        this.detectedAt = detectedAt;
    }

    public static DiseasePredictionBuilder builder() { return new DiseasePredictionBuilder(); }

    public static class DiseasePredictionBuilder {
        private Long id;
        private Hive hive;
        private String pathogenOrPestName;
        private Double detectionProbability;
        private String severityLevel;
        private String recommendedIntervention;
        private LocalDateTime detectedAt;

        public DiseasePredictionBuilder id(Long id) { this.id = id; return this; }
        public DiseasePredictionBuilder hive(Hive hive) { this.hive = hive; return this; }
        public DiseasePredictionBuilder pathogenOrPestName(String pathogenOrPestName) { this.pathogenOrPestName = pathogenOrPestName; return this; }
        public DiseasePredictionBuilder detectionProbability(Double detectionProbability) { this.detectionProbability = detectionProbability; return this; }
        public DiseasePredictionBuilder severityLevel(String severityLevel) { this.severityLevel = severityLevel; return this; }
        public DiseasePredictionBuilder recommendedIntervention(String recommendedIntervention) { this.recommendedIntervention = recommendedIntervention; return this; }
        public DiseasePredictionBuilder detectedAt(LocalDateTime detectedAt) { this.detectedAt = detectedAt; return this; }

        public DiseasePrediction build() {
            return new DiseasePrediction(id, hive, pathogenOrPestName, detectionProbability, severityLevel, recommendedIntervention, detectedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Hive getHive() { return hive; }
    public void setHive(Hive hive) { this.hive = hive; }
    public String getPathogenOrPestName() { return pathogenOrPestName; }
    public void setPathogenOrPestName(String pathogenOrPestName) { this.pathogenOrPestName = pathogenOrPestName; }
    public Double getDetectionProbability() { return detectionProbability; }
    public void setDetectionProbability(Double detectionProbability) { this.detectionProbability = detectionProbability; }
    public String getSeverityLevel() { return severityLevel; }
    public void setSeverityLevel(String severityLevel) { this.severityLevel = severityLevel; }
    public String getRecommendedIntervention() { return recommendedIntervention; }
    public void setRecommendedIntervention(String recommendedIntervention) { this.recommendedIntervention = recommendedIntervention; }
    public LocalDateTime getDetectedAt() { return detectedAt; }
    public void setDetectedAt(LocalDateTime detectedAt) { this.detectedAt = detectedAt; }
}
