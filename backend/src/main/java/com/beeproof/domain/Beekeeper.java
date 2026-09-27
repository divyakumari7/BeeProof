package com.beeproof.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "beekeepers", indexes = {
    @Index(name = "idx_beekeepers_kvic_reg", columnList = "kvicRegistrationNumber")
})
public class Beekeeper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true, length = 50)
    private String kvicRegistrationNumber;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(length = 255)
    private String address;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_cluster_id")
    private Cluster assignedCluster;

    @Column(length = 50)
    private String cooperativeName;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Beekeeper() {}

    public Beekeeper(Long id, User user, String kvicRegistrationNumber, String state, String district,
                     String address, Cluster assignedCluster, String cooperativeName,
                     LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.kvicRegistrationNumber = kvicRegistrationNumber;
        this.state = state;
        this.district = district;
        this.address = address;
        this.assignedCluster = assignedCluster;
        this.cooperativeName = cooperativeName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static BeekeeperBuilder builder() { return new BeekeeperBuilder(); }

    public static class BeekeeperBuilder {
        private Long id;
        private User user;
        private String kvicRegistrationNumber;
        private String state;
        private String district;
        private String address;
        private Cluster assignedCluster;
        private String cooperativeName;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public BeekeeperBuilder id(Long id) { this.id = id; return this; }
        public BeekeeperBuilder user(User user) { this.user = user; return this; }
        public BeekeeperBuilder kvicRegistrationNumber(String reg) { this.kvicRegistrationNumber = reg; return this; }
        public BeekeeperBuilder state(String state) { this.state = state; return this; }
        public BeekeeperBuilder district(String district) { this.district = district; return this; }
        public BeekeeperBuilder address(String address) { this.address = address; return this; }
        public BeekeeperBuilder assignedCluster(Cluster cluster) { this.assignedCluster = cluster; return this; }
        public BeekeeperBuilder cooperativeName(String coop) { this.cooperativeName = coop; return this; }
        public BeekeeperBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public BeekeeperBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Beekeeper build() {
            return new Beekeeper(id, user, kvicRegistrationNumber, state, district, address, assignedCluster, cooperativeName, createdAt, updatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getKvicRegistrationNumber() { return kvicRegistrationNumber; }
    public void setKvicRegistrationNumber(String kvicRegistrationNumber) { this.kvicRegistrationNumber = kvicRegistrationNumber; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Cluster getAssignedCluster() { return assignedCluster; }
    public void setAssignedCluster(Cluster assignedCluster) { this.assignedCluster = assignedCluster; }
    public String getCooperativeName() { return cooperativeName; }
    public void setCooperativeName(String cooperativeName) { this.cooperativeName = cooperativeName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
