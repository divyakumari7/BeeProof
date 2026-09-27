package com.beeproof.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sensor_readings", indexes = {
    @Index(name = "idx_sensor_readings_sensor", columnList = "sensor_id"),
    @Index(name = "idx_sensor_readings_time", columnList = "recordedAt")
})
public class SensorReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sensor_id", nullable = false)
    private Sensor sensor;

    @Column(nullable = false)
    private LocalDateTime recordedAt;

    private Double temperatureCelsius;
    private Double relativeHumidityPercent;
    private Double acousticDominantFreqHz;
    private Double acousticAmplitudeDb;
    private Double weightKilograms;

    @Column(length = 255)
    private String rawDataPayload;

    public SensorReading() {}

    public SensorReading(Long id, Sensor sensor, LocalDateTime recordedAt, Double temperatureCelsius,
                         Double relativeHumidityPercent, Double acousticDominantFreqHz, Double acousticAmplitudeDb,
                         Double weightKilograms, String rawDataPayload) {
        this.id = id;
        this.sensor = sensor;
        this.recordedAt = recordedAt;
        this.temperatureCelsius = temperatureCelsius;
        this.relativeHumidityPercent = relativeHumidityPercent;
        this.acousticDominantFreqHz = acousticDominantFreqHz;
        this.acousticAmplitudeDb = acousticAmplitudeDb;
        this.weightKilograms = weightKilograms;
        this.rawDataPayload = rawDataPayload;
    }

    public static SensorReadingBuilder builder() { return new SensorReadingBuilder(); }

    public static class SensorReadingBuilder {
        private Long id;
        private Sensor sensor;
        private LocalDateTime recordedAt;
        private Double temperatureCelsius;
        private Double relativeHumidityPercent;
        private Double acousticDominantFreqHz;
        private Double acousticAmplitudeDb;
        private Double weightKilograms;
        private String rawDataPayload;

        public SensorReadingBuilder id(Long id) { this.id = id; return this; }
        public SensorReadingBuilder sensor(Sensor sensor) { this.sensor = sensor; return this; }
        public SensorReadingBuilder recordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; return this; }
        public SensorReadingBuilder temperatureCelsius(Double temp) { this.temperatureCelsius = temp; return this; }
        public SensorReadingBuilder relativeHumidityPercent(Double rh) { this.relativeHumidityPercent = rh; return this; }
        public SensorReadingBuilder acousticDominantFreqHz(Double freq) { this.acousticDominantFreqHz = freq; return this; }
        public SensorReadingBuilder acousticAmplitudeDb(Double amp) { this.acousticAmplitudeDb = amp; return this; }
        public SensorReadingBuilder weightKilograms(Double weight) { this.weightKilograms = weight; return this; }
        public SensorReadingBuilder rawDataPayload(String payload) { this.rawDataPayload = payload; return this; }

        public SensorReading build() {
            return new SensorReading(id, sensor, recordedAt, temperatureCelsius, relativeHumidityPercent, acousticDominantFreqHz, acousticAmplitudeDb, weightKilograms, rawDataPayload);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Sensor getSensor() { return sensor; }
    public void setSensor(Sensor sensor) { this.sensor = sensor; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
    public Double getTemperatureCelsius() { return temperatureCelsius; }
    public void setTemperatureCelsius(Double temperatureCelsius) { this.temperatureCelsius = temperatureCelsius; }
    public Double getRelativeHumidityPercent() { return relativeHumidityPercent; }
    public void setRelativeHumidityPercent(Double relativeHumidityPercent) { this.relativeHumidityPercent = relativeHumidityPercent; }
    public Double getAcousticDominantFreqHz() { return acousticDominantFreqHz; }
    public void setAcousticDominantFreqHz(Double acousticDominantFreqHz) { this.acousticDominantFreqHz = acousticDominantFreqHz; }
    public Double getAcousticAmplitudeDb() { return acousticAmplitudeDb; }
    public void setAcousticAmplitudeDb(Double acousticAmplitudeDb) { this.acousticAmplitudeDb = acousticAmplitudeDb; }
    public Double getWeightKilograms() { return weightKilograms; }
    public void setWeightKilograms(Double weightKilograms) { this.weightKilograms = weightKilograms; }
    public String getRawDataPayload() { return rawDataPayload; }
    public void setRawDataPayload(String rawDataPayload) { this.rawDataPayload = rawDataPayload; }
}
