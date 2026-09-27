package com.beeproof.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class DomainDtos {

    public static class AdminOverviewResponse {
        private long totalUsers;
        private long totalBeekeepers;
        private long totalClusters;
        private long totalHives;
        private long totalHoneyBatches;
        private long totalVerifiedBatches;
        private List<ClusterDto> clusters;
        private List<BeekeeperDto> recentBeekeepers;
        private List<AuditLogDto> recentAuditLogs;

        public AdminOverviewResponse() {}

        public AdminOverviewResponse(long totalUsers, long totalBeekeepers, long totalClusters, long totalHives,
                                     long totalHoneyBatches, long totalVerifiedBatches, List<ClusterDto> clusters,
                                     List<BeekeeperDto> recentBeekeepers, List<AuditLogDto> recentAuditLogs) {
            this.totalUsers = totalUsers;
            this.totalBeekeepers = totalBeekeepers;
            this.totalClusters = totalClusters;
            this.totalHives = totalHives;
            this.totalHoneyBatches = totalHoneyBatches;
            this.totalVerifiedBatches = totalVerifiedBatches;
            this.clusters = clusters;
            this.recentBeekeepers = recentBeekeepers;
            this.recentAuditLogs = recentAuditLogs;
        }

        public static AdminOverviewResponseBuilder builder() {
            return new AdminOverviewResponseBuilder();
        }

        public static class AdminOverviewResponseBuilder {
            private long totalUsers;
            private long totalBeekeepers;
            private long totalClusters;
            private long totalHives;
            private long totalHoneyBatches;
            private long totalVerifiedBatches;
            private List<ClusterDto> clusters;
            private List<BeekeeperDto> recentBeekeepers;
            private List<AuditLogDto> recentAuditLogs;

            public AdminOverviewResponseBuilder totalUsers(long totalUsers) { this.totalUsers = totalUsers; return this; }
            public AdminOverviewResponseBuilder totalBeekeepers(long totalBeekeepers) { this.totalBeekeepers = totalBeekeepers; return this; }
            public AdminOverviewResponseBuilder totalClusters(long totalClusters) { this.totalClusters = totalClusters; return this; }
            public AdminOverviewResponseBuilder totalHives(long totalHives) { this.totalHives = totalHives; return this; }
            public AdminOverviewResponseBuilder totalHoneyBatches(long totalHoneyBatches) { this.totalHoneyBatches = totalHoneyBatches; return this; }
            public AdminOverviewResponseBuilder totalVerifiedBatches(long totalVerifiedBatches) { this.totalVerifiedBatches = totalVerifiedBatches; return this; }
            public AdminOverviewResponseBuilder clusters(List<ClusterDto> clusters) { this.clusters = clusters; return this; }
            public AdminOverviewResponseBuilder recentBeekeepers(List<BeekeeperDto> recentBeekeepers) { this.recentBeekeepers = recentBeekeepers; return this; }
            public AdminOverviewResponseBuilder recentAuditLogs(List<AuditLogDto> recentAuditLogs) { this.recentAuditLogs = recentAuditLogs; return this; }

            public AdminOverviewResponse build() {
                return new AdminOverviewResponse(totalUsers, totalBeekeepers, totalClusters, totalHives,
                        totalHoneyBatches, totalVerifiedBatches, clusters, recentBeekeepers, recentAuditLogs);
            }
        }

        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
        public long getTotalBeekeepers() { return totalBeekeepers; }
        public void setTotalBeekeepers(long totalBeekeepers) { this.totalBeekeepers = totalBeekeepers; }
        public long getTotalClusters() { return totalClusters; }
        public void setTotalClusters(long totalClusters) { this.totalClusters = totalClusters; }
        public long getTotalHives() { return totalHives; }
        public void setTotalHives(long totalHives) { this.totalHives = totalHives; }
        public long getTotalHoneyBatches() { return totalHoneyBatches; }
        public void setTotalHoneyBatches(long totalHoneyBatches) { this.totalHoneyBatches = totalHoneyBatches; }
        public long getTotalVerifiedBatches() { return totalVerifiedBatches; }
        public void setTotalVerifiedBatches(long totalVerifiedBatches) { this.totalVerifiedBatches = totalVerifiedBatches; }
        public List<ClusterDto> getClusters() { return clusters; }
        public void setClusters(List<ClusterDto> clusters) { this.clusters = clusters; }
        public List<BeekeeperDto> getRecentBeekeepers() { return recentBeekeepers; }
        public void setRecentBeekeepers(List<BeekeeperDto> recentBeekeepers) { this.recentBeekeepers = recentBeekeepers; }
        public List<AuditLogDto> getRecentAuditLogs() { return recentAuditLogs; }
        public void setRecentAuditLogs(List<AuditLogDto> recentAuditLogs) { this.recentAuditLogs = recentAuditLogs; }
    }

    public static class BeekeeperOverviewResponse {
        private Long beekeeperId;
        private String fullName;
        private String kvicRegistrationNumber;
        private String cooperativeName;
        private String state;
        private String district;
        private String clusterName;
        private String clusterCode;
        private String predominantFlora;
        private long assignedHiveCount;
        private long activeHiveCount;
        private List<HiveDto> hives;

        public BeekeeperOverviewResponse() {}

        public BeekeeperOverviewResponse(Long beekeeperId, String fullName, String kvicRegistrationNumber,
                                        String cooperativeName, String state, String district, String clusterName,
                                        String clusterCode, String predominantFlora, long assignedHiveCount,
                                        long activeHiveCount, List<HiveDto> hives) {
            this.beekeeperId = beekeeperId;
            this.fullName = fullName;
            this.kvicRegistrationNumber = kvicRegistrationNumber;
            this.cooperativeName = cooperativeName;
            this.state = state;
            this.district = district;
            this.clusterName = clusterName;
            this.clusterCode = clusterCode;
            this.predominantFlora = predominantFlora;
            this.assignedHiveCount = assignedHiveCount;
            this.activeHiveCount = activeHiveCount;
            this.hives = hives;
        }

        public static BeekeeperOverviewResponseBuilder builder() {
            return new BeekeeperOverviewResponseBuilder();
        }

        public static class BeekeeperOverviewResponseBuilder {
            private Long beekeeperId;
            private String fullName;
            private String kvicRegistrationNumber;
            private String cooperativeName;
            private String state;
            private String district;
            private String clusterName;
            private String clusterCode;
            private String predominantFlora;
            private long assignedHiveCount;
            private long activeHiveCount;
            private List<HiveDto> hives;

            public BeekeeperOverviewResponseBuilder beekeeperId(Long beekeeperId) { this.beekeeperId = beekeeperId; return this; }
            public BeekeeperOverviewResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
            public BeekeeperOverviewResponseBuilder kvicRegistrationNumber(String reg) { this.kvicRegistrationNumber = reg; return this; }
            public BeekeeperOverviewResponseBuilder cooperativeName(String coop) { this.cooperativeName = coop; return this; }
            public BeekeeperOverviewResponseBuilder state(String state) { this.state = state; return this; }
            public BeekeeperOverviewResponseBuilder district(String district) { this.district = district; return this; }
            public BeekeeperOverviewResponseBuilder clusterName(String clusterName) { this.clusterName = clusterName; return this; }
            public BeekeeperOverviewResponseBuilder clusterCode(String clusterCode) { this.clusterCode = clusterCode; return this; }
            public BeekeeperOverviewResponseBuilder predominantFlora(String flora) { this.predominantFlora = flora; return this; }
            public BeekeeperOverviewResponseBuilder assignedHiveCount(long count) { this.assignedHiveCount = count; return this; }
            public BeekeeperOverviewResponseBuilder activeHiveCount(long count) { this.activeHiveCount = count; return this; }
            public BeekeeperOverviewResponseBuilder hives(List<HiveDto> hives) { this.hives = hives; return this; }

            public BeekeeperOverviewResponse build() {
                return new BeekeeperOverviewResponse(beekeeperId, fullName, kvicRegistrationNumber, cooperativeName,
                        state, district, clusterName, clusterCode, predominantFlora, assignedHiveCount, activeHiveCount, hives);
            }
        }

        public Long getBeekeeperId() { return beekeeperId; }
        public void setBeekeeperId(Long beekeeperId) { this.beekeeperId = beekeeperId; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getKvicRegistrationNumber() { return kvicRegistrationNumber; }
        public void setKvicRegistrationNumber(String kvicRegistrationNumber) { this.kvicRegistrationNumber = kvicRegistrationNumber; }
        public String getCooperativeName() { return cooperativeName; }
        public void setCooperativeName(String cooperativeName) { this.cooperativeName = cooperativeName; }
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }
        public String getClusterName() { return clusterName; }
        public void setClusterName(String clusterName) { this.clusterName = clusterName; }
        public String getClusterCode() { return clusterCode; }
        public void setClusterCode(String clusterCode) { this.clusterCode = clusterCode; }
        public String getPredominantFlora() { return predominantFlora; }
        public void setPredominantFlora(String predominantFlora) { this.predominantFlora = predominantFlora; }
        public long getAssignedHiveCount() { return assignedHiveCount; }
        public void setAssignedHiveCount(long assignedHiveCount) { this.assignedHiveCount = assignedHiveCount; }
        public long getActiveHiveCount() { return activeHiveCount; }
        public void setActiveHiveCount(long activeHiveCount) { this.activeHiveCount = activeHiveCount; }
        public List<HiveDto> getHives() { return hives; }
        public void setHives(List<HiveDto> hives) { this.hives = hives; }
    }

    public static class HiveDto {
        private Long id;
        private String hiveCode;
        private String clusterCode;
        private String clusterName;
        private String beekeeperName;
        private String status;
        private String beeSpecies;
        private LocalDate installationDate;
        private Double latitude;
        private Double longitude;
        private String notes;

        public HiveDto() {}

        public HiveDto(Long id, String hiveCode, String clusterCode, String clusterName, String beekeeperName,
                       String status, String beeSpecies, LocalDate installationDate, Double latitude, Double longitude, String notes) {
            this.id = id;
            this.hiveCode = hiveCode;
            this.clusterCode = clusterCode;
            this.clusterName = clusterName;
            this.beekeeperName = beekeeperName;
            this.status = status;
            this.beeSpecies = beeSpecies;
            this.installationDate = installationDate;
            this.latitude = latitude;
            this.longitude = longitude;
            this.notes = notes;
        }

        public static HiveDtoBuilder builder() { return new HiveDtoBuilder(); }

        public static class HiveDtoBuilder {
            private Long id;
            private String hiveCode;
            private String clusterCode;
            private String clusterName;
            private String beekeeperName;
            private String status;
            private String beeSpecies;
            private LocalDate installationDate;
            private Double latitude;
            private Double longitude;
            private String notes;

            public HiveDtoBuilder id(Long id) { this.id = id; return this; }
            public HiveDtoBuilder hiveCode(String hiveCode) { this.hiveCode = hiveCode; return this; }
            public HiveDtoBuilder clusterCode(String clusterCode) { this.clusterCode = clusterCode; return this; }
            public HiveDtoBuilder clusterName(String clusterName) { this.clusterName = clusterName; return this; }
            public HiveDtoBuilder beekeeperName(String beekeeperName) { this.beekeeperName = beekeeperName; return this; }
            public HiveDtoBuilder status(String status) { this.status = status; return this; }
            public HiveDtoBuilder beeSpecies(String beeSpecies) { this.beeSpecies = beeSpecies; return this; }
            public HiveDtoBuilder installationDate(LocalDate installationDate) { this.installationDate = installationDate; return this; }
            public HiveDtoBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
            public HiveDtoBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
            public HiveDtoBuilder notes(String notes) { this.notes = notes; return this; }

            public HiveDto build() {
                return new HiveDto(id, hiveCode, clusterCode, clusterName, beekeeperName, status, beeSpecies,
                        installationDate, latitude, longitude, notes);
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getHiveCode() { return hiveCode; }
        public void setHiveCode(String hiveCode) { this.hiveCode = hiveCode; }
        public String getClusterCode() { return clusterCode; }
        public void setClusterCode(String clusterCode) { this.clusterCode = clusterCode; }
        public String getClusterName() { return clusterName; }
        public void setClusterName(String clusterName) { this.clusterName = clusterName; }
        public String getBeekeeperName() { return beekeeperName; }
        public void setBeekeeperName(String beekeeperName) { this.beekeeperName = beekeeperName; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
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
    }

    public static class ClusterDto {
        private Long id;
        private String clusterCode;
        private String name;
        private String region;
        private String state;
        private String district;
        private String predominantFlora;
        private Double latitude;
        private Double longitude;
        private long hiveCount;
        private long beekeeperCount;

        public ClusterDto() {}

        public ClusterDto(Long id, String clusterCode, String name, String region, String state, String district,
                          String predominantFlora, Double latitude, Double longitude, long hiveCount, long beekeeperCount) {
            this.id = id;
            this.clusterCode = clusterCode;
            this.name = name;
            this.region = region;
            this.state = state;
            this.district = district;
            this.predominantFlora = predominantFlora;
            this.latitude = latitude;
            this.longitude = longitude;
            this.hiveCount = hiveCount;
            this.beekeeperCount = beekeeperCount;
        }

        public static ClusterDtoBuilder builder() { return new ClusterDtoBuilder(); }

        public static class ClusterDtoBuilder {
            private Long id;
            private String clusterCode;
            private String name;
            private String region;
            private String state;
            private String district;
            private String predominantFlora;
            private Double latitude;
            private Double longitude;
            private long hiveCount;
            private long beekeeperCount;

            public ClusterDtoBuilder id(Long id) { this.id = id; return this; }
            public ClusterDtoBuilder clusterCode(String clusterCode) { this.clusterCode = clusterCode; return this; }
            public ClusterDtoBuilder name(String name) { this.name = name; return this; }
            public ClusterDtoBuilder region(String region) { this.region = region; return this; }
            public ClusterDtoBuilder state(String state) { this.state = state; return this; }
            public ClusterDtoBuilder district(String district) { this.district = district; return this; }
            public ClusterDtoBuilder predominantFlora(String predominantFlora) { this.predominantFlora = predominantFlora; return this; }
            public ClusterDtoBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
            public ClusterDtoBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
            public ClusterDtoBuilder hiveCount(long hiveCount) { this.hiveCount = hiveCount; return this; }
            public ClusterDtoBuilder beekeeperCount(long beekeeperCount) { this.beekeeperCount = beekeeperCount; return this; }

            public ClusterDto build() {
                return new ClusterDto(id, clusterCode, name, region, state, district, predominantFlora,
                        latitude, longitude, hiveCount, beekeeperCount);
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
        public long getHiveCount() { return hiveCount; }
        public void setHiveCount(long hiveCount) { this.hiveCount = hiveCount; }
        public long getBeekeeperCount() { return beekeeperCount; }
        public void setBeekeeperCount(long beekeeperCount) { this.beekeeperCount = beekeeperCount; }
    }

    public static class BeekeeperDto {
        private Long id;
        private String fullName;
        private String username;
        private String email;
        private String kvicRegistrationNumber;
        private String cooperativeName;
        private String state;
        private String district;
        private String clusterName;
        private long hiveCount;

        public BeekeeperDto() {}

        public BeekeeperDto(Long id, String fullName, String username, String email, String kvicRegistrationNumber,
                            String cooperativeName, String state, String district, String clusterName, long hiveCount) {
            this.id = id;
            this.fullName = fullName;
            this.username = username;
            this.email = email;
            this.kvicRegistrationNumber = kvicRegistrationNumber;
            this.cooperativeName = cooperativeName;
            this.state = state;
            this.district = district;
            this.clusterName = clusterName;
            this.hiveCount = hiveCount;
        }

        public static BeekeeperDtoBuilder builder() { return new BeekeeperDtoBuilder(); }

        public static class BeekeeperDtoBuilder {
            private Long id;
            private String fullName;
            private String username;
            private String email;
            private String kvicRegistrationNumber;
            private String cooperativeName;
            private String state;
            private String district;
            private String clusterName;
            private long hiveCount;

            public BeekeeperDtoBuilder id(Long id) { this.id = id; return this; }
            public BeekeeperDtoBuilder fullName(String fullName) { this.fullName = fullName; return this; }
            public BeekeeperDtoBuilder username(String username) { this.username = username; return this; }
            public BeekeeperDtoBuilder email(String email) { this.email = email; return this; }
            public BeekeeperDtoBuilder kvicRegistrationNumber(String reg) { this.kvicRegistrationNumber = reg; return this; }
            public BeekeeperDtoBuilder cooperativeName(String coop) { this.cooperativeName = coop; return this; }
            public BeekeeperDtoBuilder state(String state) { this.state = state; return this; }
            public BeekeeperDtoBuilder district(String district) { this.district = district; return this; }
            public BeekeeperDtoBuilder clusterName(String clusterName) { this.clusterName = clusterName; return this; }
            public BeekeeperDtoBuilder hiveCount(long hiveCount) { this.hiveCount = hiveCount; return this; }

            public BeekeeperDto build() {
                return new BeekeeperDto(id, fullName, username, email, kvicRegistrationNumber, cooperativeName,
                        state, district, clusterName, hiveCount);
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getKvicRegistrationNumber() { return kvicRegistrationNumber; }
        public void setKvicRegistrationNumber(String kvicRegistrationNumber) { this.kvicRegistrationNumber = kvicRegistrationNumber; }
        public String getCooperativeName() { return cooperativeName; }
        public void setCooperativeName(String cooperativeName) { this.cooperativeName = cooperativeName; }
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }
        public String getClusterName() { return clusterName; }
        public void setClusterName(String clusterName) { this.clusterName = clusterName; }
        public long getHiveCount() { return hiveCount; }
        public void setHiveCount(long hiveCount) { this.hiveCount = hiveCount; }
    }

    public static class AuditLogDto {
        private Long id;
        private String action;
        private String entityName;
        private String entityId;
        private String performedBy;
        private String details;
        private LocalDateTime timestamp;

        public AuditLogDto() {}

        public AuditLogDto(Long id, String action, String entityName, String entityId, String performedBy, String details, LocalDateTime timestamp) {
            this.id = id;
            this.action = action;
            this.entityName = entityName;
            this.entityId = entityId;
            this.performedBy = performedBy;
            this.details = details;
            this.timestamp = timestamp;
        }

        public static AuditLogDtoBuilder builder() { return new AuditLogDtoBuilder(); }

        public static class AuditLogDtoBuilder {
            private Long id;
            private String action;
            private String entityName;
            private String entityId;
            private String performedBy;
            private String details;
            private LocalDateTime timestamp;

            public AuditLogDtoBuilder id(Long id) { this.id = id; return this; }
            public AuditLogDtoBuilder action(String action) { this.action = action; return this; }
            public AuditLogDtoBuilder entityName(String entityName) { this.entityName = entityName; return this; }
            public AuditLogDtoBuilder entityId(String entityId) { this.entityId = entityId; return this; }
            public AuditLogDtoBuilder performedBy(String performedBy) { this.performedBy = performedBy; return this; }
            public AuditLogDtoBuilder details(String details) { this.details = details; return this; }
            public AuditLogDtoBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

            public AuditLogDto build() {
                return new AuditLogDto(id, action, entityName, entityId, performedBy, details, timestamp);
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
        public String getEntityName() { return entityName; }
        public void setEntityName(String entityName) { this.entityName = entityName; }
        public String getEntityId() { return entityId; }
        public void setEntityId(String entityId) { this.entityId = entityId; }
        public String getPerformedBy() { return performedBy; }
        public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }
        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }

    public static class ClusterProductionRanking {
        private Long clusterId;
        private String clusterCode;
        private String clusterName;
        private String state;
        private double productionKg;
        private long batchCount;
        private long beekeeperCount;
        private long hiveCount;

        public ClusterProductionRanking() {}

        public ClusterProductionRanking(Long clusterId, String clusterCode, String clusterName, String state,
                                       double productionKg, long batchCount, long beekeeperCount, long hiveCount) {
            this.clusterId = clusterId;
            this.clusterCode = clusterCode;
            this.clusterName = clusterName;
            this.state = state;
            this.productionKg = productionKg;
            this.batchCount = batchCount;
            this.beekeeperCount = beekeeperCount;
            this.hiveCount = hiveCount;
        }

        public Long getClusterId() { return clusterId; }
        public void setClusterId(Long clusterId) { this.clusterId = clusterId; }
        public String getClusterCode() { return clusterCode; }
        public void setClusterCode(String clusterCode) { this.clusterCode = clusterCode; }
        public String getClusterName() { return clusterName; }
        public void setClusterName(String clusterName) { this.clusterName = clusterName; }
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public double getProductionKg() { return productionKg; }
        public void setProductionKg(double productionKg) { this.productionKg = productionKg; }
        public long getBatchCount() { return batchCount; }
        public void setBatchCount(long batchCount) { this.batchCount = batchCount; }
        public long getBeekeeperCount() { return beekeeperCount; }
        public void setBeekeeperCount(long beekeeperCount) { this.beekeeperCount = beekeeperCount; }
        public long getHiveCount() { return hiveCount; }
        public void setHiveCount(long hiveCount) { this.hiveCount = hiveCount; }
    }

    public static class FloralDistribution {
        private String floralSource;
        private double volumeKg;
        private double percentage;

        public FloralDistribution() {}

        public FloralDistribution(String floralSource, double volumeKg, double percentage) {
            this.floralSource = floralSource;
            this.volumeKg = volumeKg;
            this.percentage = percentage;
        }

        public String getFloralSource() { return floralSource; }
        public void setFloralSource(String floralSource) { this.floralSource = floralSource; }
        public double getVolumeKg() { return volumeKg; }
        public void setVolumeKg(double volumeKg) { this.volumeKg = volumeKg; }
        public double getPercentage() { return percentage; }
        public void setPercentage(double percentage) { this.percentage = percentage; }
    }

    public static class AdminAnalyticsSummary {
        private double totalProductionKg;
        private long totalBatchesCount;
        private long certifiedBatchesCount;
        private long totalBeekeepersCount;
        private long totalClustersCount;
        private long totalHivesCount;
        private long activeHivesCount;
        private long warningHivesCount;
        private long criticalHivesCount;
        private long blockchainVerificationsCount;
        private double authenticityRatePercentage;
        private List<ClusterProductionRanking> clusterRankings;
        private List<FloralDistribution> floralDistributions;
        private String disclaimer = "DEMO / APPROXIMATE GEOGRAPHIC LOCATIONS";

        public AdminAnalyticsSummary() {}

        public double getTotalProductionKg() { return totalProductionKg; }
        public void setTotalProductionKg(double totalProductionKg) { this.totalProductionKg = totalProductionKg; }
        public long getTotalBatchesCount() { return totalBatchesCount; }
        public void setTotalBatchesCount(long totalBatchesCount) { this.totalBatchesCount = totalBatchesCount; }
        public long getCertifiedBatchesCount() { return certifiedBatchesCount; }
        public void setCertifiedBatchesCount(long certifiedBatchesCount) { this.certifiedBatchesCount = certifiedBatchesCount; }
        public long getTotalBeekeepersCount() { return totalBeekeepersCount; }
        public void setTotalBeekeepersCount(long totalBeekeepersCount) { this.totalBeekeepersCount = totalBeekeepersCount; }
        public long getTotalClustersCount() { return totalClustersCount; }
        public void setTotalClustersCount(long totalClustersCount) { this.totalClustersCount = totalClustersCount; }
        public long getTotalHivesCount() { return totalHivesCount; }
        public void setTotalHivesCount(long totalHivesCount) { this.totalHivesCount = totalHivesCount; }
        public long getActiveHivesCount() { return activeHivesCount; }
        public void setActiveHivesCount(long activeHivesCount) { this.activeHivesCount = activeHivesCount; }
        public long getWarningHivesCount() { return warningHivesCount; }
        public void setWarningHivesCount(long warningHivesCount) { this.warningHivesCount = warningHivesCount; }
        public long getCriticalHivesCount() { return criticalHivesCount; }
        public void setCriticalHivesCount(long criticalHivesCount) { this.criticalHivesCount = criticalHivesCount; }
        public long getBlockchainVerificationsCount() { return blockchainVerificationsCount; }
        public void setBlockchainVerificationsCount(long blockchainVerificationsCount) { this.blockchainVerificationsCount = blockchainVerificationsCount; }
        public double getAuthenticityRatePercentage() { return authenticityRatePercentage; }
        public void setAuthenticityRatePercentage(double authenticityRatePercentage) { this.authenticityRatePercentage = authenticityRatePercentage; }
        public List<ClusterProductionRanking> getClusterRankings() { return clusterRankings; }
        public void setClusterRankings(List<ClusterProductionRanking> clusterRankings) { this.clusterRankings = clusterRankings; }
        public List<FloralDistribution> getFloralDistributions() { return floralDistributions; }
        public void setFloralDistributions(List<FloralDistribution> floralDistributions) { this.floralDistributions = floralDistributions; }
        public String getDisclaimer() { return disclaimer; }
        public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
    }

    public static class ClusterDrilldownResponse {
        private ClusterDto cluster;
        private List<BeekeeperDto> beekeepers;
        private List<HiveDto> hives;
        private List<BatchResponse> batches;
        private double totalYieldKg;
        private int activeAlertsCount;

        public ClusterDrilldownResponse() {}

        public ClusterDrilldownResponse(ClusterDto cluster, List<BeekeeperDto> beekeepers, List<HiveDto> hives,
                                       List<BatchResponse> batches, double totalYieldKg, int activeAlertsCount) {
            this.cluster = cluster;
            this.beekeepers = beekeepers;
            this.hives = hives;
            this.batches = batches;
            this.totalYieldKg = totalYieldKg;
            this.activeAlertsCount = activeAlertsCount;
        }

        public ClusterDto getCluster() { return cluster; }
        public void setCluster(ClusterDto cluster) { this.cluster = cluster; }
        public List<BeekeeperDto> getBeekeepers() { return beekeepers; }
        public void setBeekeepers(List<BeekeeperDto> beekeepers) { this.beekeepers = beekeepers; }
        public List<HiveDto> getHives() { return hives; }
        public void setHives(List<HiveDto> hives) { this.hives = hives; }
        public List<BatchResponse> getBatches() { return batches; }
        public void setBatches(List<BatchResponse> batches) { this.batches = batches; }
        public double getTotalYieldKg() { return totalYieldKg; }
        public void setTotalYieldKg(double totalYieldKg) { this.totalYieldKg = totalYieldKg; }
        public int getActiveAlertsCount() { return activeAlertsCount; }
        public void setActiveAlertsCount(int activeAlertsCount) { this.activeAlertsCount = activeAlertsCount; }
    }

    public static class BlockchainStatsResponse {
        private String networkName;
        private String contractAddress;
        private long latestBlockNumber;
        private long totalBatchesOnChain;
        private String nodeStatus;
        private String rpcUrl;

        public BlockchainStatsResponse() {}

        public BlockchainStatsResponse(String networkName, String contractAddress, long latestBlockNumber,
                                       long totalBatchesOnChain, String nodeStatus, String rpcUrl) {
            this.networkName = networkName;
            this.contractAddress = contractAddress;
            this.latestBlockNumber = latestBlockNumber;
            this.totalBatchesOnChain = totalBatchesOnChain;
            this.nodeStatus = nodeStatus;
            this.rpcUrl = rpcUrl;
        }

        public String getNetworkName() { return networkName; }
        public void setNetworkName(String networkName) { this.networkName = networkName; }
        public String getContractAddress() { return contractAddress; }
        public void setContractAddress(String contractAddress) { this.contractAddress = contractAddress; }
        public long getLatestBlockNumber() { return latestBlockNumber; }
        public void setLatestBlockNumber(long latestBlockNumber) { this.latestBlockNumber = latestBlockNumber; }
        public long getTotalBatchesOnChain() { return totalBatchesOnChain; }
        public void setTotalBatchesOnChain(long totalBatchesOnChain) { this.totalBatchesOnChain = totalBatchesOnChain; }
        public String getNodeStatus() { return nodeStatus; }
        public void setNodeStatus(String nodeStatus) { this.nodeStatus = nodeStatus; }
        public String getRpcUrl() { return rpcUrl; }
        public void setRpcUrl(String rpcUrl) { this.rpcUrl = rpcUrl; }
    }
}

