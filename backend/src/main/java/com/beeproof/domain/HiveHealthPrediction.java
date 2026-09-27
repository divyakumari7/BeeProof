package com.beeproof.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hive_health_predictions")
public class HiveHealthPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hive_id", nullable = false)
    private Hive hive;

    private Double overallHealthScore;
    private Double swarmingRiskProbability;
    private Double queenLossProbability;

    @Column(length = 50)
    private String modelVersion;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime generatedAt;

    public HiveHealthPrediction() {}

    public HiveHealthPrediction(Long id, Hive hive, Double overallHealthScore, Double swarmingRiskProbability,
                                Double queenLossProbability, String modelVersion, LocalDateTime generatedAt) {
        this.id = id;
        this.hive = hive;
        this.overallHealthScore = overallHealthScore;
        this.swarmingRiskProbability = swarmingRiskProbability;
        this.queenLossProbability = queenLossProbability;
        this.modelVersion = modelVersion;
        this.generatedAt = generatedAt;
    }

    public static HiveHealthPredictionBuilder builder() { return new HiveHealthPredictionBuilder(); }

    public static class HiveHealthPredictionBuilder {
        private Long id;
        private Hive hive;
        private Double overallHealthScore;
        private Double swarmingRiskProbability;
        private Double queenLossProbability;
        private String modelVersion;
        private LocalDateTime generatedAt;

        public HiveHealthPredictionBuilder id(Long id) { this.id = id; return this; }
        public HiveHealthPredictionBuilder hive(Hive hive) { this.hive = hive; return this; }
        public HiveHealthPredictionBuilder overallHealthScore(Double score) { this.overallHealthScore = score; return this; }
        public HiveHealthPredictionBuilder swarmingRiskProbability(Double p) { this.swarmingRiskProbability = p; return this; }
        public HiveHealthPredictionBuilder queenLossProbability(Double p) { this.queenLossProbability = p; return this; }
        public HiveHealthPredictionBuilder modelVersion(String v) { this.modelVersion = v; return this; }
        public HiveHealthPredictionBuilder generatedAt(LocalDateTime t) { this.generatedAt = t; return this; }

        public HiveHealthPrediction build() {
            return new HiveHealthPrediction(id, hive, overallHealthScore, swarmingRiskProbability, queenLossProbability, modelVersion, generatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Hive getHive() { return hive; }
    public void setHive(Hive hive) { this.hive = hive; }
    public Double getOverallHealthScore() { return overallHealthScore; }
    public void setOverallHealthScore(Double overallHealthScore) { this.overallHealthScore = overallHealthScore; }
    public Double getSwarmingRiskProbability() { return swarmingRiskProbability; }
    public void setSwarmingRiskProbability(Double swarmingRiskProbability) { this.swarmingRiskProbability = swarmingRiskProbability; }
    public Double getQueenLossProbability() { return queenLossProbability; }
    public void setQueenLossProbability(Double queenLossProbability) { this.queenLossProbability = queenLossProbability; }
    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
}
