package com.beeproof.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public class IotDtos {

    public static class IngestReadingRequest {
        @NotNull(message = "Hive ID is required")
        private Long hiveId;

        private String sensorIdentifier;

        @NotNull(message = "Temperature is required")
        private Double temperatureCelsius;

        @NotNull(message = "Relative humidity is required")
        private Double relativeHumidityPercent;

        @NotNull(message = "Weight is required")
        private Double weightKilograms;

        private Double acousticDominantFreqHz;
        private Double acousticAmplitudeDb;
        private LocalDateTime timestamp;
        private Boolean isSimulated = true;

        public IngestReadingRequest() {}

        public IngestReadingRequest(Long hiveId, String sensorIdentifier, Double temperatureCelsius, Double relativeHumidityPercent,
                                   Double weightKilograms, Double acousticDominantFreqHz, Double acousticAmplitudeDb, LocalDateTime timestamp) {
            this.hiveId = hiveId;
            this.sensorIdentifier = sensorIdentifier;
            this.temperatureCelsius = temperatureCelsius;
            this.relativeHumidityPercent = relativeHumidityPercent;
            this.weightKilograms = weightKilograms;
            this.acousticDominantFreqHz = acousticDominantFreqHz;
            this.acousticAmplitudeDb = acousticAmplitudeDb;
            this.timestamp = timestamp;
            this.isSimulated = true;
        }

        public Long getHiveId() { return hiveId; }
        public void setHiveId(Long hiveId) { this.hiveId = hiveId; }
        public String getSensorIdentifier() { return sensorIdentifier; }
        public void setSensorIdentifier(String sensorIdentifier) { this.sensorIdentifier = sensorIdentifier; }
        public Double getTemperatureCelsius() { return temperatureCelsius; }
        public void setTemperatureCelsius(Double temperatureCelsius) { this.temperatureCelsius = temperatureCelsius; }
        public Double getRelativeHumidityPercent() { return relativeHumidityPercent; }
        public void setRelativeHumidityPercent(Double relativeHumidityPercent) { this.relativeHumidityPercent = relativeHumidityPercent; }
        public Double getWeightKilograms() { return weightKilograms; }
        public void setWeightKilograms(Double weightKilograms) { this.weightKilograms = weightKilograms; }
        public Double getAcousticDominantFreqHz() { return acousticDominantFreqHz; }
        public void setAcousticDominantFreqHz(Double acousticDominantFreqHz) { this.acousticDominantFreqHz = acousticDominantFreqHz; }
        public Double getAcousticAmplitudeDb() { return acousticAmplitudeDb; }
        public void setAcousticAmplitudeDb(Double acousticAmplitudeDb) { this.acousticAmplitudeDb = acousticAmplitudeDb; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
        public Boolean getIsSimulated() { return isSimulated; }
        public void setIsSimulated(Boolean isSimulated) { this.isSimulated = isSimulated; }
    }

    public static class HiveTelemetryResponse {
        private Long hiveId;
        private String hiveCode;
        private String sensorIdentifier;
        private String sensorStatus; // ONLINE, OFFLINE
        private Double currentTemperature;
        private Double currentHumidity;
        private Double currentWeight;
        private Double currentAcousticFreq;
        private LocalDateTime lastSeen;
        private String dataSourceLabel; // "DEMO / SIMULATED SENSOR DATA"
        private List<HistoricalPoint> history;

        public HiveTelemetryResponse() {}

        public Long getHiveId() { return hiveId; }
        public void setHiveId(Long hiveId) { this.hiveId = hiveId; }
        public String getHiveCode() { return hiveCode; }
        public void setHiveCode(String hiveCode) { this.hiveCode = hiveCode; }
        public String getSensorIdentifier() { return sensorIdentifier; }
        public void setSensorIdentifier(String sensorIdentifier) { this.sensorIdentifier = sensorIdentifier; }
        public String getSensorStatus() { return sensorStatus; }
        public void setSensorStatus(String sensorStatus) { this.sensorStatus = sensorStatus; }
        public Double getCurrentTemperature() { return currentTemperature; }
        public void setCurrentTemperature(Double currentTemperature) { this.currentTemperature = currentTemperature; }
        public Double getCurrentHumidity() { return currentHumidity; }
        public void setCurrentHumidity(Double currentHumidity) { this.currentHumidity = currentHumidity; }
        public Double getCurrentWeight() { return currentWeight; }
        public void setCurrentWeight(Double currentWeight) { this.currentWeight = currentWeight; }
        public Double getCurrentAcousticFreq() { return currentAcousticFreq; }
        public void setCurrentAcousticFreq(Double currentAcousticFreq) { this.currentAcousticFreq = currentAcousticFreq; }
        public LocalDateTime getLastSeen() { return lastSeen; }
        public void setLastSeen(LocalDateTime lastSeen) { this.lastSeen = lastSeen; }
        public String getDataSourceLabel() { return dataSourceLabel; }
        public void setDataSourceLabel(String dataSourceLabel) { this.dataSourceLabel = dataSourceLabel; }
        public List<HistoricalPoint> getHistory() { return history; }
        public void setHistory(List<HistoricalPoint> history) { this.history = history; }
    }

    public static class HistoricalPoint {
        private LocalDateTime timestamp;
        private Double temperature;
        private Double humidity;
        private Double weight;
        private Double frequency;

        public HistoricalPoint() {}
        public HistoricalPoint(LocalDateTime timestamp, Double temperature, Double humidity, Double weight, Double frequency) {
            this.timestamp = timestamp;
            this.temperature = temperature;
            this.humidity = humidity;
            this.weight = weight;
            this.frequency = frequency;
        }

        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
        public Double getTemperature() { return temperature; }
        public void setTemperature(Double temperature) { this.temperature = temperature; }
        public Double getHumidity() { return humidity; }
        public void setHumidity(Double humidity) { this.humidity = humidity; }
        public Double getWeight() { return weight; }
        public void setWeight(Double weight) { this.weight = weight; }
        public Double getFrequency() { return frequency; }
        public void setFrequency(Double frequency) { this.frequency = frequency; }
    }

    public static class AlertDto {
        private Long id;
        private String title;
        private String message;
        private String category;
        private boolean isRead;
        private LocalDateTime createdAt;

        public AlertDto() {}
        public AlertDto(Long id, String title, String message, String category, boolean isRead, LocalDateTime createdAt) {
            this.id = id;
            this.title = title;
            this.message = message;
            this.category = category;
            this.isRead = isRead;
            this.createdAt = createdAt;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public boolean isRead() { return isRead; }
        public void setRead(boolean read) { isRead = read; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
