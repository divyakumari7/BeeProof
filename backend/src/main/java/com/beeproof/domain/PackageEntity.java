package com.beeproof.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "packages", indexes = {
    @Index(name = "idx_packages_serial", columnList = "serialNumber")
})
public class PackageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private HoneyBatch batch;

    @Column(nullable = false, unique = true, length = 64)
    private String serialNumber;

    @Column(nullable = false)
    private Double netWeightGrams;

    @Column(length = 50)
    private String packagingType;

    private LocalDate packagingDate;
    private LocalDate bestBeforeDate;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public PackageEntity() {}

    public PackageEntity(Long id, HoneyBatch batch, String serialNumber, Double netWeightGrams, String packagingType,
                         LocalDate packagingDate, LocalDate bestBeforeDate, LocalDateTime createdAt) {
        this.id = id;
        this.batch = batch;
        this.serialNumber = serialNumber;
        this.netWeightGrams = netWeightGrams;
        this.packagingType = packagingType;
        this.packagingDate = packagingDate;
        this.bestBeforeDate = bestBeforeDate;
        this.createdAt = createdAt;
    }

    public static PackageEntityBuilder builder() { return new PackageEntityBuilder(); }

    public static class PackageEntityBuilder {
        private Long id;
        private HoneyBatch batch;
        private String serialNumber;
        private Double netWeightGrams;
        private String packagingType;
        private LocalDate packagingDate;
        private LocalDate bestBeforeDate;
        private LocalDateTime createdAt;

        public PackageEntityBuilder id(Long id) { this.id = id; return this; }
        public PackageEntityBuilder batch(HoneyBatch batch) { this.batch = batch; return this; }
        public PackageEntityBuilder serialNumber(String serialNumber) { this.serialNumber = serialNumber; return this; }
        public PackageEntityBuilder netWeightGrams(Double netWeightGrams) { this.netWeightGrams = netWeightGrams; return this; }
        public PackageEntityBuilder packagingType(String packagingType) { this.packagingType = packagingType; return this; }
        public PackageEntityBuilder packagingDate(LocalDate packagingDate) { this.packagingDate = packagingDate; return this; }
        public PackageEntityBuilder bestBeforeDate(LocalDate bestBeforeDate) { this.bestBeforeDate = bestBeforeDate; return this; }
        public PackageEntityBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public PackageEntity build() {
            return new PackageEntity(id, batch, serialNumber, netWeightGrams, packagingType, packagingDate, bestBeforeDate, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public HoneyBatch getBatch() { return batch; }
    public void setBatch(HoneyBatch batch) { this.batch = batch; }
    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }
    public Double getNetWeightGrams() { return netWeightGrams; }
    public void setNetWeightGrams(Double netWeightGrams) { this.netWeightGrams = netWeightGrams; }
    public String getPackagingType() { return packagingType; }
    public void setPackagingType(String packagingType) { this.packagingType = packagingType; }
    public LocalDate getPackagingDate() { return packagingDate; }
    public void setPackagingDate(LocalDate packagingDate) { this.packagingDate = packagingDate; }
    public LocalDate getBestBeforeDate() { return bestBeforeDate; }
    public void setBestBeforeDate(LocalDate bestBeforeDate) { this.bestBeforeDate = bestBeforeDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
