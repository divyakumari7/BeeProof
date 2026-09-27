package com.beeproof.service;

import com.beeproof.domain.Hive;
import com.beeproof.domain.HiveAlert;
import com.beeproof.domain.Sensor;
import com.beeproof.domain.SensorReading;
import com.beeproof.domain.enums.SensorType;
import com.beeproof.dto.IotDtos;
import com.beeproof.repository.HiveAlertRepository;
import com.beeproof.repository.HiveRepository;
import com.beeproof.repository.SensorReadingRepository;
import com.beeproof.repository.SensorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class IotService {

    private static final Logger log = LoggerFactory.getLogger(IotService.class);

    private final HiveRepository hiveRepository;
    private final SensorRepository sensorRepository;
    private final SensorReadingRepository sensorReadingRepository;
    private final HiveAlertRepository hiveAlertRepository;
    private final AuditService auditService;

    // Standard biological operating ranges for Apis mellifera / cerana brood chambers
    public static final double MIN_NORMAL_TEMP = 32.0;
    public static final double MAX_NORMAL_TEMP = 36.5;
    public static final double MIN_NORMAL_HUMIDITY = 45.0;
    public static final double MAX_NORMAL_HUMIDITY = 70.0;
    public static final double MIN_VALID_WEIGHT = 5.0;
    public static final double MAX_VALID_WEIGHT = 120.0;

    public IotService(HiveRepository hiveRepository,
                      SensorRepository sensorRepository,
                      SensorReadingRepository sensorReadingRepository,
                      HiveAlertRepository hiveAlertRepository,
                      AuditService auditService) {
        this.hiveRepository = hiveRepository;
        this.sensorRepository = sensorRepository;
        this.sensorReadingRepository = sensorReadingRepository;
        this.hiveAlertRepository = hiveAlertRepository;
        this.auditService = auditService;
    }

    @Transactional
    public SensorReading ingestReading(IotDtos.IngestReadingRequest request, String actor) {
        if (request.getHiveId() == null) {
            throw new IllegalArgumentException("Hive ID is required");
        }
        Hive hive = hiveRepository.findById(request.getHiveId())
                .orElseThrow(() -> new IllegalArgumentException("Hive not found with ID: " + request.getHiveId()));

        validateTelemetryRanges(request);

        // Find or register sensor
        Sensor sensor = resolveSensor(hive, request.getSensorIdentifier());
        sensor.setActive(true);
        sensorRepository.save(sensor);

        LocalDateTime readingTime = request.getTimestamp() != null ? request.getTimestamp() : LocalDateTime.now();

        SensorReading reading = SensorReading.builder()
                .sensor(sensor)
                .recordedAt(readingTime)
                .temperatureCelsius(request.getTemperatureCelsius())
                .relativeHumidityPercent(request.getRelativeHumidityPercent())
                .weightKilograms(request.getWeightKilograms())
                .acousticDominantFreqHz(request.getAcousticDominantFreqHz() != null ? request.getAcousticDominantFreqHz() : 220.0)
                .acousticAmplitudeDb(request.getAcousticAmplitudeDb() != null ? request.getAcousticAmplitudeDb() : 45.0)
                .rawDataPayload("{\"simulated\":" + (request.getIsSimulated() != null ? request.getIsSimulated() : true) + "}")
                .build();

        SensorReading savedReading = sensorReadingRepository.save(reading);

        // Check for biological and mechanical anomalies
        checkAndCreateAnomalies(hive, request);

        log.info("Ingested IoT telemetry for Hive: {} ({}), Temp: {}°C, Humidity: {}%, Weight: {}kg",
                hive.getHiveCode(), hive.getId(), request.getTemperatureCelsius(), request.getRelativeHumidityPercent(), request.getWeightKilograms());

        auditService.log("INGEST_TELEMETRY", "HIVE", String.valueOf(hive.getId()),
                actor != null ? actor : "IOT_GATEWAY", "Recorded sensor telemetry; Temp: " + request.getTemperatureCelsius());

        return savedReading;
    }

    private void validateTelemetryRanges(IotDtos.IngestReadingRequest r) {
        if (r.getTemperatureCelsius() != null && (r.getTemperatureCelsius() < -40.0 || r.getTemperatureCelsius() > 70.0)) {
            throw new IllegalArgumentException("Temperature out of physical sensor bounds: " + r.getTemperatureCelsius());
        }
        if (r.getRelativeHumidityPercent() != null && (r.getRelativeHumidityPercent() < 0.0 || r.getRelativeHumidityPercent() > 100.0)) {
            throw new IllegalArgumentException("Relative humidity must be between 0% and 100%");
        }
        if (r.getWeightKilograms() != null && (r.getWeightKilograms() < 0.0 || r.getWeightKilograms() > 300.0)) {
            throw new IllegalArgumentException("Weight must be between 0kg and 300kg");
        }
    }

    private Sensor resolveSensor(Hive hive, String sensorIdentifier) {
        if (sensorIdentifier != null && !sensorIdentifier.trim().isEmpty()) {
            return sensorRepository.findBySensorIdentifier(sensorIdentifier)
                    .orElseGet(() -> {
                        Sensor newSensor = Sensor.builder()
                                .sensorIdentifier(sensorIdentifier)
                                .hive(hive)
                                .sensorType(SensorType.MULTISENSOR_CORE)
                                .firmwareVersion("v2.4-firmware")
                                .active(true)
                                .batteryPercentage(95)
                                .installedAt(LocalDateTime.now())
                                .build();
                        return sensorRepository.save(newSensor);
                    });
        }
        // Check if hive already has a multi-metric sensor
        List<Sensor> existing = sensorRepository.findByHive(hive);
        if (!existing.isEmpty()) {
            return existing.get(0);
        }
        // Auto-provision
        String genId = "SEN-" + hive.getHiveCode() + "-M01";
        Sensor autoSensor = Sensor.builder()
                .sensorIdentifier(genId)
                .hive(hive)
                .sensorType(SensorType.MULTISENSOR_CORE)
                .firmwareVersion("v2.4-firmware")
                .active(true)
                .batteryPercentage(95)
                .installedAt(LocalDateTime.now())
                .build();
        return sensorRepository.save(autoSensor);
    }

    private void checkAndCreateAnomalies(Hive hive, IotDtos.IngestReadingRequest r) {
        // 1. High Temperature Anomaly
        if (r.getTemperatureCelsius() > MAX_NORMAL_TEMP) {
            createAlertIfAbsent(hive, "TEMPERATURE", r.getTemperatureCelsius(),
                    MIN_NORMAL_TEMP + "°C - " + MAX_NORMAL_TEMP + "°C",
                    "Hive internal temperature elevated (" + r.getTemperatureCelsius() + "°C). Possible overheating, poor ventilation, or queen rearing thermogenesis.",
                    "Ensure adequate hive shading and verify ventilation screens. Note: This indicates thermal stress, not necessarily disease.");
        }
        // 2. Low Temperature Anomaly
        else if (r.getTemperatureCelsius() < MIN_NORMAL_TEMP) {
            createAlertIfAbsent(hive, "TEMPERATURE", r.getTemperatureCelsius(),
                    MIN_NORMAL_TEMP + "°C - " + MAX_NORMAL_TEMP + "°C",
                    "Hive internal temperature dropped (" + r.getTemperatureCelsius() + "°C). Risk of brood chilling or cluster dispersal.",
                    "Inspect hive entrance for draft. Verify cluster compactness and colony population.");
        }

        // 3. High Humidity Anomaly
        if (r.getRelativeHumidityPercent() > MAX_NORMAL_HUMIDITY) {
            createAlertIfAbsent(hive, "HUMIDITY", r.getRelativeHumidityPercent(),
                    MIN_NORMAL_HUMIDITY + "% - " + MAX_NORMAL_HUMIDITY + "%",
                    "Elevated moisture content (" + r.getRelativeHumidityPercent() + "%). High humidity encourages fungal condensation and honey fermentation.",
                    "Clear bottom board debris and check top ventilation spacer. Note: Environmental moisture spike.");
        }

        // 4. Weight Anomaly (Sudden loss check against previous reading)
        List<SensorReading> recent = sensorReadingRepository.findRecentByHiveId(hive.getId(), PageRequest.of(0, 2));
        if (recent.size() >= 2) {
            double previousWeight = recent.get(1).getWeightKilograms();
            double weightDiff = r.getWeightKilograms() - previousWeight;
            if (weightDiff < -2.0) { // Lost more than 2kg rapidly
                createAlertIfAbsent(hive, "WEIGHT", r.getWeightKilograms(),
                        "Stable or gradual (+/- 0.5kg/day)",
                        "Sudden drop of " + String.format("%.2f", Math.abs(weightDiff)) + " kg detected. Possible swarming event, comb collapse, or external harvest disturbance.",
                        "Inspect colony immediately for swarm emergence or physical intrusion. Note: Does not confirm disease.");
            }
        }
    }

    private void createAlertIfAbsent(Hive hive, String metric, Double observedValue,
                                     String expectedRange, String reason, String recommendation) {
        // Prevent duplicate spam of active unread alerts for same metric
        List<HiveAlert> existing = hiveAlertRepository.findByHiveAndStatusOrderByCreatedAtDesc(hive, HiveAlert.AlertStatus.UNREAD);
        boolean duplicate = existing.stream().anyMatch(a -> a.getMetric().equalsIgnoreCase(metric));
        if (!duplicate) {
            HiveAlert alert = new HiveAlert(hive, metric, observedValue, expectedRange, reason, recommendation, HiveAlert.AlertStatus.UNREAD);
            hiveAlertRepository.save(alert);
            log.warn("Generated IoT Alert for Hive {}: Metric={}, Observed={}", hive.getHiveCode(), metric, observedValue);
        }
    }

    @Transactional(readOnly = true)
    public IotDtos.HiveTelemetryResponse getHiveTelemetry(Long hiveId) {
        Hive hive = hiveRepository.findById(hiveId)
                .orElseThrow(() -> new IllegalArgumentException("Hive not found with ID: " + hiveId));

        List<Sensor> sensors = sensorRepository.findByHive(hive);
        Sensor primarySensor = sensors.isEmpty() ? null : sensors.get(0);

        List<SensorReading> recentReadings = sensorReadingRepository.findRecentByHiveId(hiveId, PageRequest.of(0, 24));

        IotDtos.HiveTelemetryResponse resp = new IotDtos.HiveTelemetryResponse();
        resp.setHiveId(hive.getId());
        resp.setHiveCode(hive.getHiveCode());
        resp.setDataSourceLabel("DEMO / SIMULATED SENSOR DATA");

        if (primarySensor != null) {
            resp.setSensorIdentifier(primarySensor.getSensorIdentifier());
            resp.setSensorStatus(primarySensor.isActive() ? "ONLINE" : "OFFLINE");
        } else {
            resp.setSensorIdentifier("SEN-AUTO-" + hive.getHiveCode());
            resp.setSensorStatus("ONLINE");
        }

        if (!recentReadings.isEmpty()) {
            SensorReading latest = recentReadings.get(0);
            resp.setCurrentTemperature(latest.getTemperatureCelsius());
            resp.setCurrentHumidity(latest.getRelativeHumidityPercent());
            resp.setCurrentWeight(latest.getWeightKilograms());
            resp.setCurrentAcousticFreq(latest.getAcousticDominantFreqHz());
            resp.setLastSeen(latest.getRecordedAt());

            // Check if sensor is offline (e.g. no reading in last 24 hours)
            if (latest.getRecordedAt().isBefore(LocalDateTime.now().minusHours(24))) {
                resp.setSensorStatus("OFFLINE");
            }
        } else {
            // Default demo baseline
            resp.setCurrentTemperature(34.8);
            resp.setCurrentHumidity(58.5);
            resp.setCurrentWeight(34.2);
            resp.setCurrentAcousticFreq(230.0);
            resp.setLastSeen(LocalDateTime.now());
        }

        // Build chronological history list
        List<IotDtos.HistoricalPoint> history = new ArrayList<>();
        // Reverse so it's oldest to newest for UI charts
        for (int i = recentReadings.size() - 1; i >= 0; i--) {
            SensorReading sr = recentReadings.get(i);
            history.add(new IotDtos.HistoricalPoint(
                    sr.getRecordedAt(),
                    sr.getTemperatureCelsius(),
                    sr.getRelativeHumidityPercent(),
                    sr.getWeightKilograms(),
                    sr.getAcousticDominantFreqHz()
            ));
        }
        resp.setHistory(history);

        return resp;
    }

    @Transactional(readOnly = true)
    public List<HiveAlert> getHiveAlerts(Long hiveId) {
        Hive hive = hiveRepository.findById(hiveId)
                .orElseThrow(() -> new IllegalArgumentException("Hive not found with ID: " + hiveId));
        return hiveAlertRepository.findByHiveOrderByCreatedAtDesc(hive);
    }

    @Transactional(readOnly = true)
    public List<HiveAlert> getAllActiveAlerts() {
        return hiveAlertRepository.findByStatusOrderByCreatedAtDesc(HiveAlert.AlertStatus.UNREAD);
    }

    @Transactional
    public HiveAlert resolveAlert(Long alertId, String actor) {
        HiveAlert alert = hiveAlertRepository.findById(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found with ID: " + alertId));
        alert.setStatus(HiveAlert.AlertStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());
        HiveAlert saved = hiveAlertRepository.save(alert);
        auditService.log("RESOLVE_ALERT", "HIVE_ALERT", String.valueOf(alertId), actor, "Marked alert as RESOLVED");
        return saved;
    }

    @Transactional
    public Sensor setSensorStatus(String sensorIdentifier, boolean active, String actor) {
        Sensor sensor = sensorRepository.findBySensorIdentifier(sensorIdentifier)
                .orElseThrow(() -> new IllegalArgumentException("Sensor not found: " + sensorIdentifier));
        sensor.setActive(active);
        Sensor saved = sensorRepository.save(sensor);
        if (!active) {
            createAlertIfAbsent(sensor.getHive(), "SENSOR_OFFLINE", 0.0,
                    "ONLINE", "Sensor has gone OFFLINE or heartbeat interrupted.",
                    "Check IoT gateway power, LoRaWAN / GSM signal antenna, and battery levels.");
        }
        auditService.log("SET_SENSOR_STATUS", "SENSOR", sensorIdentifier, actor, "Active set to: " + active);
        return saved;
    }

    @Transactional
    public SensorReading simulateCondition(Long hiveId, String scenario, String actor) {
        Hive hive = hiveRepository.findById(hiveId)
                .orElseThrow(() -> new IllegalArgumentException("Hive not found with ID: " + hiveId));

        double temp = 34.5;
        double hum = 58.0;
        double weight = 34.0;
        double freq = 225.0;

        switch (scenario.toUpperCase()) {
            case "HIGH_TEMP":
                temp = 38.8; // Exceeds 36.5°C
                break;
            case "LOW_TEMP":
                temp = 28.2; // Below 32°C
                break;
            case "HIGH_HUMIDITY":
                hum = 82.0; // Exceeds 70%
                break;
            case "LOW_HUMIDITY":
                hum = 35.0; // Below 45%
                break;
            case "SUDDEN_WEIGHT_LOSS":
                weight = 29.5; // Dropped by 4.5kg
                break;
            case "SENSOR_OFFLINE":
                resolveSensor(hive, null);
                setSensorStatus("SEN-" + hive.getHiveCode() + "-M01", false, actor);
                return null;
            case "NORMAL":
            default:
                temp = 34.6;
                hum = 59.0;
                weight = 34.2;
                freq = 230.0;
                break;
        }

        IotDtos.IngestReadingRequest req = new IotDtos.IngestReadingRequest(
                hiveId, "SEN-" + hive.getHiveCode() + "-M01", temp, hum, weight, freq, 45.0, LocalDateTime.now()
        );
        req.setIsSimulated(true);

        return ingestReading(req, actor);
    }
}
