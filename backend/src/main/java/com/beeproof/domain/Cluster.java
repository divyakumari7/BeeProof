package com.beeproof.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "clusters", indexes = {
    @Index(name = "idx_clusters_code", columnList = "clusterCode")
})
public class Cluster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String clusterCode;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String region;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(length = 150)
    private String predominantFlora;

    private Double latitude;
    private Double longitude;

    @Column(length = 255)
    private String description;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Cluster() {}

    public Cluster(Long id, String clusterCode, String name, String region, String state, String district,
                   String predominantFlora, Double latitude, Double longitude, String description,
                   LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.clusterCode = clusterCode;
        this.name = name;
        this.region = region;
        this.state = state;
        this.district = district;
        this.predominantFlora = predominantFlora;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static ClusterBuilder builder() { return new ClusterBuilder(); }

    public static class ClusterBuilder {
        private Long id;
        private String clusterCode;
        private String name;
        private String region;
        private String state;
        private String district;
        private String predominantFlora;
        private Double latitude;
        private Double longitude;
        private String description;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ClusterBuilder id(Long id) { this.id = id; return this; }
        public ClusterBuilder clusterCode(String clusterCode) { this.clusterCode = clusterCode; return this; }
        public ClusterBuilder name(String name) { this.name = name; return this; }
        public ClusterBuilder region(String region) { this.region = region; return this; }
        public ClusterBuilder state(String state) { this.state = state; return this; }
        public ClusterBuilder district(String district) { this.district = district; return this; }
        public ClusterBuilder predominantFlora(String predominantFlora) { this.predominantFlora = predominantFlora; return this; }
        public ClusterBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public ClusterBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public ClusterBuilder description(String description) { this.description = description; return this; }
        public ClusterBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ClusterBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Cluster build() {
            return new Cluster(id, clusterCode, name, region, state, district, predominantFlora, latitude, longitude, description, createdAt, updatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getClusterCode() { return clusterCode; }
    public void setClusterCode(String clusterCode) { this.clusterCode = clusterCode; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getPredominantFlora() { return predominantFlora; }
    public void setPredominantFlora(String predominantFlora) { this.predominantFlora = predominantFlora; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
