package com.beeproof.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hive_alerts", indexes = {
    @Index(name = "idx_hive_alerts_hive_status", columnList = "hive_id, status")
})
public class HiveAlert {

    public enum AlertStatus {
        UNREAD, READ, RESOLVED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hive_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "beekeeper", "cluster"})
    private Hive hive;

    @Column(nullable = false, length = 50)
    private String metric; // TEMPERATURE, HUMIDITY, WEIGHT, ACOUSTIC, SENSOR_OFFLINE

    @Column(nullable = false)
    private Double observedValue;

    @Column(nullable = false, length = 100)
    private String expectedRange;

    @Column(nullable = false, length = 500)
    private String reason;

    @Column(nullable = false, length = 500)
    private String recommendedAction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AlertStatus status = AlertStatus.UNREAD;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;

    public HiveAlert() {}

    public HiveAlert(Hive hive, String metric, Double observedValue, String expectedRange,
                     String reason, String recommendedAction, AlertStatus status) {
        this.hive = hive;
        this.metric = metric;
        this.observedValue = observedValue;
        this.expectedRange = expectedRange;
        this.reason = reason;
        this.recommendedAction = recommendedAction;
        this.status = status != null ? status : AlertStatus.UNREAD;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Hive getHive() { return hive; }
    public void setHive(Hive hive) { this.hive = hive; }
    public String getMetric() { return metric; }
    public void setMetric(String metric) { this.metric = metric; }
    public Double getObservedValue() { return observedValue; }
    public void setObservedValue(Double observedValue) { this.observedValue = observedValue; }
    public String getExpectedRange() { return expectedRange; }
    public void setExpectedRange(String expectedRange) { this.expectedRange = expectedRange; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }
    public AlertStatus getStatus() { return status; }
    public void setStatus(AlertStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
