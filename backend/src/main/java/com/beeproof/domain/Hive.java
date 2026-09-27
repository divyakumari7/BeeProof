package com.beeproof.domain;

import com.beeproof.domain.enums.HiveStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "hives", indexes = {
    @Index(name = "idx_hives_code", columnList = "hiveCode")
})
public class Hive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String hiveCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cluster_id", nullable = false)
    private Cluster cluster;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "beekeeper_id", nullable = false)
    private Beekeeper beekeeper;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private HiveStatus status = HiveStatus.ACTIVE;

    @Column(length = 100)
    private String beeSpecies;

    private LocalDate installationDate;

    private Double latitude;
    private Double longitude;

    @Column(length = 255)
    private String notes;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Hive() {}

    public Hive(Long id, String hiveCode, Cluster cluster, Beekeeper beekeeper, HiveStatus status,
                String beeSpecies, LocalDate installationDate, Double latitude, Double longitude,
                String notes, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.hiveCode = hiveCode;
        this.cluster = cluster;
        this.beekeeper = beekeeper;
        this.status = status != null ? status : HiveStatus.ACTIVE;
        this.beeSpecies = beeSpecies;
        this.installationDate = installationDate;
        this.latitude = latitude;
        this.longitude = longitude;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static HiveBuilder builder() { return new HiveBuilder(); }

    public static class HiveBuilder {
        private Long id;
        private String hiveCode;
        private Cluster cluster;
        private Beekeeper beekeeper;
        private HiveStatus status = HiveStatus.ACTIVE;
        private String beeSpecies;
        private LocalDate installationDate;
        private Double latitude;
        private Double longitude;
        private String notes;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public HiveBuilder id(Long id) { this.id = id; return this; }
        public HiveBuilder hiveCode(String hiveCode) { this.hiveCode = hiveCode; return this; }
        public HiveBuilder cluster(Cluster cluster) { this.cluster = cluster; return this; }
        public HiveBuilder beekeeper(Beekeeper beekeeper) { this.beekeeper = beekeeper; return this; }
        public HiveBuilder status(HiveStatus status) { this.status = status; return this; }
        public HiveBuilder beeSpecies(String beeSpecies) { this.beeSpecies = beeSpecies; return this; }
        public HiveBuilder installationDate(LocalDate installationDate) { this.installationDate = installationDate; return this; }
        public HiveBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public HiveBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public HiveBuilder notes(String notes) { this.notes = notes; return this; }
        public HiveBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public HiveBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Hive build() {
            return new Hive(id, hiveCode, cluster, beekeeper, status, beeSpecies, installationDate, latitude, longitude, notes, createdAt, updatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getHiveCode() { return hiveCode; }
    public void setHiveCode(String hiveCode) { this.hiveCode = hiveCode; }
    public Cluster getCluster() { return cluster; }
    public void setCluster(Cluster cluster) { this.cluster = cluster; }
    public Beekeeper getBeekeeper() { return beekeeper; }
    public void setBeekeeper(Beekeeper beekeeper) { this.beekeeper = beekeeper; }
    public HiveStatus getStatus() { return status; }
    public void setStatus(HiveStatus status) { this.status = status; }
    public String getBeeSpecies() { return beeSpecies; }
    public void setBeeSpecies(String beeSpecies) { this.beeSpecies = beeSpecies; }
    public LocalDate getInstallationDate() { return installationDate; }
    public void setInstallationDate(LocalDate installationDate) { this.installationDate = installationDate; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
