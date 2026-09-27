package com.beeproof.service;

import com.beeproof.domain.*;
import com.beeproof.dto.AiDtos;
import com.beeproof.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AiService {

    private static final Logger log = LoggerFactory.getLogger(AiService.class);

    private final HiveRepository hiveRepository;
    private final SensorReadingRepository sensorReadingRepository;
    private final HiveAlertRepository hiveAlertRepository;
    private final HiveHealthPredictionRepository healthRepo;
    private final ProductivityPredictionRepository prodRepo;
    private final DiseasePredictionRepository diseaseRepo;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${beeproof.ai.service-url:http://127.0.0.1:8000}")
    private String aiServiceUrl;

    public AiService(HiveRepository hiveRepository,
                     SensorReadingRepository sensorReadingRepository,
                     HiveAlertRepository hiveAlertRepository,
                     HiveHealthPredictionRepository healthRepo,
                     ProductivityPredictionRepository prodRepo,
                     DiseasePredictionRepository diseaseRepo,
                     AuditService auditService,
                     ObjectMapper objectMapper) {
        this.hiveRepository = hiveRepository;
        this.sensorReadingRepository = sensorReadingRepository;
        this.hiveAlertRepository = hiveAlertRepository;
        this.healthRepo = healthRepo;
        this.prodRepo = prodRepo;
        this.diseaseRepo = diseaseRepo;
        this.auditService = auditService;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(Duration.ofSeconds(2))
                .build();
    }

    @Transactional
    public AiDtos.HiveAiInsightsSummary generateOrGetInsights(Long hiveId, String actor) {
        Hive hive = hiveRepository.findById(hiveId)
                .orElseThrow(() -> new IllegalArgumentException("Hive not found with ID: " + hiveId));

        List<SensorReading> recentReadings = sensorReadingRepository.findRecentByHiveId(hiveId, PageRequest.of(0, 10));
        List<HiveAlert> unreadAlerts = hiveAlertRepository.findByHiveAndStatusOrderByCreatedAtDesc(hive, HiveAlert.AlertStatus.UNREAD);

        double temp = 34.5;
        double hum = 58.0;
        double weight = 34.0;
        double freq = 225.0;

        if (!recentReadings.isEmpty()) {
            SensorReading latest = recentReadings.get(0);
            temp = latest.getTemperatureCelsius();
            hum = latest.getRelativeHumidityPercent();
            weight = latest.getWeightKilograms();
            if (latest.getAcousticDominantFreqHz() != null) {
                freq = latest.getAcousticDominantFreqHz();
            }
        }

        AiDtos.HiveHealthAiResponse health = callHealthPrediction(hive, temp, hum, weight, freq, unreadAlerts.size());
        AiDtos.ProductivityAiResponse prod = callProductivityPrediction(hive, weight, recentReadings.size(), health.getHealthScore());
        AiDtos.DiseaseRiskAiResponse disease = callDiseaseRiskPrediction(hive, temp, hum, weight, freq);

        // Persist to database in existing tables
        healthRepo.save(HiveHealthPrediction.builder()
                .hive(hive)
                .overallHealthScore(health.getHealthScore())
                .swarmingRiskProbability(health.getSwarmingRiskProbability())
                .queenLossProbability(health.getQueenLossProbability())
                .modelVersion(health.getModelVersion())
                .generatedAt(LocalDateTime.now())
                .build());

        if ("SUCCESS".equals(prod.getStatus()) && prod.getPredictedProductionKg() != null) {
            prodRepo.save(ProductivityPrediction.builder()
                    .hive(hive)
                    .predictedSurplusKg(prod.getPredictedProductionKg())
                    .targetHarvestDate(LocalDate.now().plusWeeks(3))
                    .confidenceScore(prod.getConfidenceScore())
                    .generatedAt(LocalDateTime.now())
                    .build());
        }

        diseaseRepo.save(DiseasePrediction.builder()
                .hive(hive)
                .pathogenOrPestName(disease.getPathogenOrPestName())
                .detectionProbability(disease.getDetectionProbability())
                .severityLevel(disease.getRiskSeverity())
                .recommendedIntervention(disease.getRecommendedAction())
                .detectedAt(LocalDateTime.now())
                .build());

        auditService.log("AI_INFERENCE_REQUESTED", "HIVE", String.valueOf(hiveId),
                actor != null ? actor : "AI_ENGINE", "Generated AI health score: " + health.getHealthScore());

        return new AiDtos.HiveAiInsightsSummary(hive.getId(), hive.getHiveCode(), health, prod, disease, LocalDateTime.now());
    }

    private AiDtos.HiveHealthAiResponse callHealthPrediction(Hive hive, double temp, double hum, double weight, double freq, int anomalyCount) {
        try {
            Map<String, Object> req = new HashMap<>();
            req.put("hive_id", hive.getId());
            req.put("hive_code", hive.getHiveCode());
            req.put("temperature", temp);
            req.put("humidity", hum);
            req.put("weight", weight);
            req.put("acoustic_frequency", freq);
            req.put("active_anomalies_count", anomalyCount);

            String json = objectMapper.writeValueAsString(req);
            log.info("Sending to FastAPI: {}", json);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(aiServiceUrl + "/predict/hive-health"))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .timeout(Duration.ofSeconds(4))
                    .POST(HttpRequest.BodyPublishers.ofString(json, java.nio.charset.StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> resp = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            log.info("FastAPI response status: {}, body: {}", resp.statusCode(), resp.body());
            if (resp.statusCode() == 200) {
                return objectMapper.readValue(resp.body(), AiDtos.HiveHealthAiResponse.class);
            }
        } catch (Exception e) {
            log.warn("FastAPI AI service call failed, using heuristic fallback for health: {}", e.getMessage());
        }

        // Graceful Fallback
        AiDtos.HiveHealthAiResponse fb = new AiDtos.HiveHealthAiResponse();
        fb.setHiveId(hive.getId());
        double score = 100.0 - (Math.abs(temp - 34.5) * 8.0) - (anomalyCount * 10.0);
        fb.setHealthScore(Math.max(10.0, Math.min(98.0, Math.round(score * 10.0) / 10.0)));
        fb.setHealthStatus(fb.getHealthScore() >= 80 ? "HEALTHY" : (fb.getHealthScore() >= 55 ? "WARNING" : "CRITICAL"));
        fb.setRiskLevel(fb.getHealthScore() >= 80 ? "LOW" : (fb.getHealthScore() >= 55 ? "MEDIUM" : "HIGH"));
        fb.setSwarmingRiskProbability(freq > 250 ? 0.40 : 0.08);
        fb.setQueenLossProbability(temp < 32 ? 0.35 : 0.05);
        fb.setContributingFactors(List.of(
                "Telemetry temperature: " + temp + "°C (Optimal target 34.5°C)",
                "Chamber relative humidity: " + hum + "%",
                "Acoustic frequency: " + freq + " Hz"
        ));
        fb.setRecommendation("Inspect brood frames for thermoregulation stability.");
        fb.setModelVersion("BeeProof-HeuristicFallback-v1.0");
        fb.setDisclaimer("AI DEMO / PREDICTION — Statistical modeling demo.");
        return fb;
    }

    private AiDtos.ProductivityAiResponse callProductivityPrediction(Hive hive, double currentWeight, int historyCount, double healthScore) {
        try {
            Map<String, Object> req = new HashMap<>();
            req.put("hive_id", hive.getId());
            req.put("hive_code", hive.getHiveCode());
            req.put("current_weight", currentWeight);
            req.put("historical_points_count", historyCount);
            req.put("health_score", healthScore);
            req.put("season", "SPRING");
            req.put("location", hive.getCluster() != null ? hive.getCluster().getName() : "Regional Apiary");

            String json = objectMapper.writeValueAsString(req);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(aiServiceUrl + "/predict/productivity"))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .timeout(Duration.ofSeconds(4))
                    .POST(HttpRequest.BodyPublishers.ofString(json, java.nio.charset.StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> resp = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() == 200) {
                return objectMapper.readValue(resp.body(), AiDtos.ProductivityAiResponse.class);
            }
        } catch (Exception e) {
            log.warn("FastAPI AI service call failed, using heuristic fallback for productivity: {}", e.getMessage());
        }

        AiDtos.ProductivityAiResponse fb = new AiDtos.ProductivityAiResponse();
        fb.setHiveId(hive.getId());
        if (historyCount < 2) {
            fb.setStatus("INSUFFICIENT_DATA");
            fb.setConfidenceIndicator("INSUFFICIENT");
            fb.setContributingFactors(List.of("Fewer than 2 telemetry recording sessions.", "No historical baseline."));
            fb.setMessage("Insufficient historical data");
            fb.setDisclaimer("AI DEMO / PREDICTION — Yield forecast requires established time series.");
            return fb;
        }

        double surplus = Math.max(5.0, (currentWeight - 12.0) * 0.70);
        fb.setStatus("SUCCESS");
        fb.setPredictedProductionKg(Math.round(surplus * 10.0) / 10.0);
        fb.setExpectedRangeMinKg(Math.round(surplus * 0.88 * 10.0) / 10.0);
        fb.setExpectedRangeMaxKg(Math.round(surplus * 1.12 * 10.0) / 10.0);
        fb.setConfidenceScore(0.85);
        fb.setConfidenceIndicator("HIGH");
        fb.setContributingFactors(List.of(
                "Hive gross mass: " + currentWeight + " kg",
                "Colony active health factor: " + healthScore
        ));
        fb.setMessage("Yield forecast computed from weight scale telemetry.");
        fb.setDisclaimer("AI DEMO / PREDICTION — Honey yield forecast based on environmental trends.");
        return fb;
    }

    private AiDtos.DiseaseRiskAiResponse callDiseaseRiskPrediction(Hive hive, double temp, double hum, double weight, double freq) {
        try {
            Map<String, Object> req = new HashMap<>();
            req.put("hive_id", hive.getId());
            req.put("hive_code", hive.getHiveCode());
            req.put("temperature", temp);
            req.put("humidity", hum);
            req.put("weight", weight);
            req.put("acoustic_frequency", freq);

            String json = objectMapper.writeValueAsString(req);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(aiServiceUrl + "/predict/disease-risk"))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .timeout(Duration.ofSeconds(4))
                    .POST(HttpRequest.BodyPublishers.ofString(json, java.nio.charset.StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> resp = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() == 200) {
                return objectMapper.readValue(resp.body(), AiDtos.DiseaseRiskAiResponse.class);
            }
        } catch (Exception e) {
            log.warn("FastAPI AI service call failed, using heuristic fallback for disease risk: {}", e.getMessage());
        }

        AiDtos.DiseaseRiskAiResponse fb = new AiDtos.DiseaseRiskAiResponse();
        fb.setHiveId(hive.getId());
        fb.setRiskCategory(temp < 32.5 && hum > 70 ? "ELEVATED_CHALKBROOD_RISK" : "LOW_RISK");
        fb.setRiskSeverity(temp < 32.5 && hum > 70 ? "MODERATE" : "LOW");
        fb.setConfidence(0.88);
        fb.setPathogenOrPestName(temp < 32.5 && hum > 70 ? "Ascosphaera apis (Chalkbrood)" : "Varroa destructor (Mites)");
        fb.setDetectionProbability(temp < 32.5 && hum > 70 ? 0.72 : 0.08);
        fb.setContributingFactors(List.of("Microclimatic brood chamber parameters evaluated."));
        fb.setRecommendedAction("Maintain regular bottom board cleaning.");
        fb.setLabel("Disease Risk (Demo Inference)");
        fb.setDisclaimer("AI DEMO / PREDICTION — Requires physical NABL/veterinary inspection to confirm pathology.");
        return fb;
    }
}
