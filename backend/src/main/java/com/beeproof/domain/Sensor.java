package com.beeproof.domain;

import com.beeproof.domain.enums.SensorType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "sensors", indexes = {
    @Index(name = "idx_sensors_id_str", columnList = "sensorIdentifier")
})
public class Sensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String sensorIdentifier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hive_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "beekeeper", "cluster"})
    private Hive hive;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private SensorType sensorType;

    @Column(length = 50)
    private String firmwareVersion;

    @Column(nullable = false)
    private boolean active = true;

    private Integer batteryPercentage;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime installedAt;

    public Sensor() {}

    public Sensor(Long id, String sensorIdentifier, Hive hive, SensorType sensorType, String firmwareVersion, boolean active, Integer batteryPercentage, LocalDateTime installedAt) {
        this.id = id;
        this.sensorIdentifier = sensorIdentifier;
        this.hive = hive;
        this.sensorType = sensorType;
        this.firmwareVersion = firmwareVersion;
        this.active = active;
        this.batteryPercentage = batteryPercentage;
        this.installedAt = installedAt;
    }

    public static SensorBuilder builder() { return new SensorBuilder(); }

    public static class SensorBuilder {
        private Long id;
        private String sensorIdentifier;
        private Hive hive;
        private SensorType sensorType;
        private String firmwareVersion;
        private boolean active = true;
        private Integer batteryPercentage;
        private LocalDateTime installedAt;

        public SensorBuilder id(Long id) { this.id = id; return this; }
        public SensorBuilder sensorIdentifier(String sensorIdentifier) { this.sensorIdentifier = sensorIdentifier; return this; }
        public SensorBuilder hive(Hive hive) { this.hive = hive; return this; }
        public SensorBuilder sensorType(SensorType sensorType) { this.sensorType = sensorType; return this; }
        public SensorBuilder firmwareVersion(String firmwareVersion) { this.firmwareVersion = firmwareVersion; return this; }
        public SensorBuilder active(boolean active) { this.active = active; return this; }
        public SensorBuilder batteryPercentage(Integer batteryPercentage) { this.batteryPercentage = batteryPercentage; return this; }
        public SensorBuilder installedAt(LocalDateTime installedAt) { this.installedAt = installedAt; return this; }

        public Sensor build() {
            return new Sensor(id, sensorIdentifier, hive, sensorType, firmwareVersion, active, batteryPercentage, installedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSensorIdentifier() { return sensorIdentifier; }
    public void setSensorIdentifier(String sensorIdentifier) { this.sensorIdentifier = sensorIdentifier; }
    public Hive getHive() { return hive; }
    public void setHive(Hive hive) { this.hive = hive; }
    public SensorType getSensorType() { return sensorType; }
    public void setSensorType(SensorType sensorType) { this.sensorType = sensorType; }
    public String getFirmwareVersion() { return firmwareVersion; }
    public void setFirmwareVersion(String firmwareVersion) { this.firmwareVersion = firmwareVersion; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public Integer getBatteryPercentage() { return batteryPercentage; }
    public void setBatteryPercentage(Integer batteryPercentage) { this.batteryPercentage = batteryPercentage; }
    public LocalDateTime getInstalledAt() { return installedAt; }
    public void setInstalledAt(LocalDateTime installedAt) { this.installedAt = installedAt; }
}
