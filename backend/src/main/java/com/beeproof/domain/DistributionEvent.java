package com.beeproof.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "distribution_events")
public class DistributionEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private HoneyBatch batch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "distributor_user_id", nullable = false)
    private User distributor;

    @Column(nullable = false, length = 100)
    private String originLocation;

    @Column(nullable = false, length = 100)
    private String destinationLocation;

    @Column(nullable = false, length = 50)
    private String status;

    private Double ambientTemperatureCelsius;
    private Double quantityDispatchedKg;

    @Column(nullable = false)
    private LocalDateTime eventTimestamp;

    @Column(length = 255)
    private String trackingReference;

    public DistributionEvent() {}

    public DistributionEvent(Long id, HoneyBatch batch, User distributor, String originLocation, String destinationLocation,
                             String status, Double ambientTemperatureCelsius, Double quantityDispatchedKg,
                             LocalDateTime eventTimestamp, String trackingReference) {
        this.id = id;
        this.batch = batch;
        this.distributor = distributor;
        this.originLocation = originLocation;
        this.destinationLocation = destinationLocation;
        this.status = status;
        this.ambientTemperatureCelsius = ambientTemperatureCelsius;
        this.quantityDispatchedKg = quantityDispatchedKg;
        this.eventTimestamp = eventTimestamp;
        this.trackingReference = trackingReference;
    }

    public static DistributionEventBuilder builder() { return new DistributionEventBuilder(); }

    public static class DistributionEventBuilder {
        private Long id;
        private HoneyBatch batch;
        private User distributor;
        private String originLocation;
        private String destinationLocation;
        private String status;
        private Double ambientTemperatureCelsius;
        private Double quantityDispatchedKg;
        private LocalDateTime eventTimestamp;
        private String trackingReference;

        public DistributionEventBuilder id(Long id) { this.id = id; return this; }
        public DistributionEventBuilder batch(HoneyBatch batch) { this.batch = batch; return this; }
        public DistributionEventBuilder distributor(User distributor) { this.distributor = distributor; return this; }
        public DistributionEventBuilder originLocation(String originLocation) { this.originLocation = originLocation; return this; }
        public DistributionEventBuilder destinationLocation(String destinationLocation) { this.destinationLocation = destinationLocation; return this; }
        public DistributionEventBuilder status(String status) { this.status = status; return this; }
        public DistributionEventBuilder ambientTemperatureCelsius(Double ambientTemperatureCelsius) { this.ambientTemperatureCelsius = ambientTemperatureCelsius; return this; }
        public DistributionEventBuilder quantityDispatchedKg(Double quantityDispatchedKg) { this.quantityDispatchedKg = quantityDispatchedKg; return this; }
        public DistributionEventBuilder eventTimestamp(LocalDateTime eventTimestamp) { this.eventTimestamp = eventTimestamp; return this; }
        public DistributionEventBuilder trackingReference(String trackingReference) { this.trackingReference = trackingReference; return this; }

        public DistributionEvent build() {
            return new DistributionEvent(id, batch, distributor, originLocation, destinationLocation, status, ambientTemperatureCelsius, quantityDispatchedKg, eventTimestamp, trackingReference);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public HoneyBatch getBatch() { return batch; }
    public void setBatch(HoneyBatch batch) { this.batch = batch; }
    public User getDistributor() { return distributor; }
    public void setDistributor(User distributor) { this.distributor = distributor; }
    public String getOriginLocation() { return originLocation; }
    public void setOriginLocation(String originLocation) { this.originLocation = originLocation; }
    public String getDestinationLocation() { return destinationLocation; }
    public void setDestinationLocation(String destinationLocation) { this.destinationLocation = destinationLocation; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getAmbientTemperatureCelsius() { return ambientTemperatureCelsius; }
    public void setAmbientTemperatureCelsius(Double ambientTemperatureCelsius) { this.ambientTemperatureCelsius = ambientTemperatureCelsius; }
    public Double getQuantityDispatchedKg() { return quantityDispatchedKg; }
    public void setQuantityDispatchedKg(Double quantityDispatchedKg) { this.quantityDispatchedKg = quantityDispatchedKg; }
    public LocalDateTime getEventTimestamp() { return eventTimestamp; }
    public void setEventTimestamp(LocalDateTime eventTimestamp) { this.eventTimestamp = eventTimestamp; }
    public String getTrackingReference() { return trackingReference; }
    public void setTrackingReference(String trackingReference) { this.trackingReference = trackingReference; }
}
