package com.beeproof.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class AiDtos {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class HiveHealthAiResponse {
        @JsonAlias({"hive_id", "hiveId"})
        private Long hiveId;

        @JsonAlias({"health_score", "healthScore"})
        private Double healthScore;

        @JsonAlias({"health_status", "healthStatus"})
        private String healthStatus;

        @JsonAlias({"risk_level", "riskLevel"})
        private String riskLevel;

        @JsonAlias({"swarming_risk_probability", "swarmingRiskProbability"})
        private Double swarmingRiskProbability;

        @JsonAlias({"queen_loss_probability", "queenLossProbability"})
        private Double queenLossProbability;

        @JsonAlias({"contributing_factors", "contributingFactors"})
        private List<String> contributingFactors;

        private String recommendation;

        @JsonAlias({"model_version", "modelVersion"})
        private String modelVersion;

        private String disclaimer;

        public HiveHealthAiResponse() {}

        public Long getHiveId() { return hiveId; }
        public void setHiveId(Long hiveId) { this.hiveId = hiveId; }
        public Double getHealthScore() { return healthScore; }
        public void setHealthScore(Double healthScore) { this.healthScore = healthScore; }
        public String getHealthStatus() { return healthStatus; }
        public void setHealthStatus(String healthStatus) { this.healthStatus = healthStatus; }
        public String getRiskLevel() { return riskLevel; }
        public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
        public Double getSwarmingRiskProbability() { return swarmingRiskProbability; }
        public void setSwarmingRiskProbability(Double swarmingRiskProbability) { this.swarmingRiskProbability = swarmingRiskProbability; }
        public Double getQueenLossProbability() { return queenLossProbability; }
        public void setQueenLossProbability(Double queenLossProbability) { this.queenLossProbability = queenLossProbability; }
        public List<String> getContributingFactors() { return contributingFactors; }
        public void setContributingFactors(List<String> contributingFactors) { this.contributingFactors = contributingFactors; }
        public String getRecommendation() { return recommendation; }
        public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
        public String getModelVersion() { return modelVersion; }
        public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }
        public String getDisclaimer() { return disclaimer; }
        public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ProductivityAiResponse {
        @JsonAlias({"hive_id", "hiveId"})
        private Long hiveId;

        private String status;

        @JsonAlias({"predicted_production_kg", "predictedProductionKg"})
        private Double predictedProductionKg;

        @JsonAlias({"expected_range_min_kg", "expectedRangeMinKg"})
        private Double expectedRangeMinKg;

        @JsonAlias({"expected_range_max_kg", "expectedRangeMaxKg"})
        private Double expectedRangeMaxKg;

        @JsonAlias({"confidence_score", "confidenceScore"})
        private Double confidenceScore;

        @JsonAlias({"confidence_indicator", "confidenceIndicator"})
        private String confidenceIndicator;

        @JsonAlias({"contributing_factors", "contributingFactors"})
        private List<String> contributingFactors;

        private String message;
        private String disclaimer;

        public ProductivityAiResponse() {}

        public Long getHiveId() { return hiveId; }
        public void setHiveId(Long hiveId) { this.hiveId = hiveId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public Double getPredictedProductionKg() { return predictedProductionKg; }
        public void setPredictedProductionKg(Double predictedProductionKg) { this.predictedProductionKg = predictedProductionKg; }
        public Double getExpectedRangeMinKg() { return expectedRangeMinKg; }
        public void setExpectedRangeMinKg(Double expectedRangeMinKg) { this.expectedRangeMinKg = expectedRangeMinKg; }
        public Double getExpectedRangeMaxKg() { return expectedRangeMaxKg; }
        public void setExpectedRangeMaxKg(Double expectedRangeMaxKg) { this.expectedRangeMaxKg = expectedRangeMaxKg; }
        public Double getConfidenceScore() { return confidenceScore; }
        public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
        public String getConfidenceIndicator() { return confidenceIndicator; }
        public void setConfidenceIndicator(String confidenceIndicator) { this.confidenceIndicator = confidenceIndicator; }
        public List<String> getContributingFactors() { return contributingFactors; }
        public void setContributingFactors(List<String> contributingFactors) { this.contributingFactors = contributingFactors; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getDisclaimer() { return disclaimer; }
        public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DiseaseRiskAiResponse {
        @JsonAlias({"hive_id", "hiveId"})
        private Long hiveId;

        @JsonAlias({"risk_category", "riskCategory"})
        private String riskCategory;

        @JsonAlias({"risk_severity", "riskSeverity"})
        private String riskSeverity;

        private Double confidence;

        @JsonAlias({"pathogen_or_pest_name", "pathogenOrPestName"})
        private String pathogenOrPestName;

        @JsonAlias({"detection_probability", "detectionProbability"})
        private Double detectionProbability;

        @JsonAlias({"contributing_factors", "contributingFactors"})
        private List<String> contributingFactors;

        @JsonAlias({"recommended_action", "recommendedAction"})
        private String recommendedAction;

        private String label;
        private String disclaimer;

        public DiseaseRiskAiResponse() {}

        public Long getHiveId() { return hiveId; }
        public void setHiveId(Long hiveId) { this.hiveId = hiveId; }
        public String getRiskCategory() { return riskCategory; }
        public void setRiskCategory(String riskCategory) { this.riskCategory = riskCategory; }
        public String getRiskSeverity() { return riskSeverity; }
        public void setRiskSeverity(String riskSeverity) { this.riskSeverity = riskSeverity; }
        public Double getConfidence() { return confidence; }
        public void setConfidence(Double confidence) { this.confidence = confidence; }
        public String getPathogenOrPestName() { return pathogenOrPestName; }
        public void setPathogenOrPestName(String pathogenOrPestName) { this.pathogenOrPestName = pathogenOrPestName; }
        public Double getDetectionProbability() { return detectionProbability; }
        public void setDetectionProbability(Double detectionProbability) { this.detectionProbability = detectionProbability; }
        public List<String> getContributingFactors() { return contributingFactors; }
        public void setContributingFactors(List<String> contributingFactors) { this.contributingFactors = contributingFactors; }
        public String getRecommendedAction() { return recommendedAction; }
        public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public String getDisclaimer() { return disclaimer; }
        public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
    }

    public static class HiveAiInsightsSummary {
        private Long hiveId;
        private String hiveCode;
        private HiveHealthAiResponse health;
        private ProductivityAiResponse productivity;
        private DiseaseRiskAiResponse diseaseRisk;
        private String disclaimer = "AI DEMO / PREDICTION";
        private LocalDateTime generatedAt;

        public HiveAiInsightsSummary() {}

        public HiveAiInsightsSummary(Long hiveId, String hiveCode, HiveHealthAiResponse health,
                                     ProductivityAiResponse productivity, DiseaseRiskAiResponse diseaseRisk,
                                     LocalDateTime generatedAt) {
            this.hiveId = hiveId;
            this.hiveCode = hiveCode;
            this.health = health;
            this.productivity = productivity;
            this.diseaseRisk = diseaseRisk;
            this.disclaimer = "AI DEMO / PREDICTION";
            this.generatedAt = generatedAt;
        }

        public Long getHiveId() { return hiveId; }
        public void setHiveId(Long hiveId) { this.hiveId = hiveId; }
        public String getHiveCode() { return hiveCode; }
        public void setHiveCode(String hiveCode) { this.hiveCode = hiveCode; }
        public HiveHealthAiResponse getHealth() { return health; }
        public void setHealth(HiveHealthAiResponse health) { this.health = health; }
        public ProductivityAiResponse getProductivity() { return productivity; }
        public void setProductivity(ProductivityAiResponse productivity) { this.productivity = productivity; }
        public DiseaseRiskAiResponse getDiseaseRisk() { return diseaseRisk; }
        public void setDiseaseRisk(DiseaseRiskAiResponse diseaseRisk) { this.diseaseRisk = diseaseRisk; }
        public String getDisclaimer() { return disclaimer; }
        public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
        public LocalDateTime getGeneratedAt() { return generatedAt; }
        public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
    }
}
