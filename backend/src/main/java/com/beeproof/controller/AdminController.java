package com.beeproof.controller;

import com.beeproof.domain.HiveAlert;
import com.beeproof.dto.ApiResponse;
import com.beeproof.dto.BatchResponse;
import com.beeproof.dto.DomainDtos.*;
import com.beeproof.service.AdminService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN_KVIC')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<AdminOverviewResponse>> getOverview() {
        AdminOverviewResponse overview = adminService.getOverview();
        return ResponseEntity.ok(ApiResponse.success("Admin overview data retrieved", overview));
    }

    @GetMapping("/analytics/summary")
    public ResponseEntity<ApiResponse<AdminAnalyticsSummary>> getAnalyticsSummary() {
        AdminAnalyticsSummary summary = adminService.getAnalyticsSummary();
        return ResponseEntity.ok(ApiResponse.success("National KVIC analytics summary retrieved", summary));
    }

    @GetMapping("/clusters/{id}/drilldown")
    public ResponseEntity<ApiResponse<ClusterDrilldownResponse>> getClusterDrilldown(@PathVariable Long id) {
        ClusterDrilldownResponse drilldown = adminService.getClusterDrilldown(id);
        return ResponseEntity.ok(ApiResponse.success("Cluster drilldown retrieved for ID: " + id, drilldown));
    }

    @GetMapping("/beekeepers")
    public ResponseEntity<ApiResponse<List<BeekeeperDto>>> getBeekeepers() {
        List<BeekeeperDto> beekeepers = adminService.getAllBeekeepers();
        return ResponseEntity.ok(ApiResponse.success("Beekeepers list retrieved", beekeepers));
    }

    @GetMapping("/clusters")
    public ResponseEntity<ApiResponse<List<ClusterDto>>> getClusters() {
        List<ClusterDto> clusters = adminService.getAllClusters();
        return ResponseEntity.ok(ApiResponse.success("Clusters list retrieved", clusters));
    }

    @GetMapping("/hives")
    public ResponseEntity<ApiResponse<List<HiveDto>>> getHives() {
        List<HiveDto> hives = adminService.getAllHives();
        return ResponseEntity.ok(ApiResponse.success("Hives list retrieved", hives));
    }

    @GetMapping("/batches")
    public ResponseEntity<ApiResponse<List<BatchResponse>>> getBatches() {
        List<BatchResponse> batches = adminService.getAllBatches();
        return ResponseEntity.ok(ApiResponse.success("All system honey batches retrieved", batches));
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<HiveAlert>>> getAlerts() {
        List<HiveAlert> alerts = adminService.getAllAlerts();
        return ResponseEntity.ok(ApiResponse.success("All hive telemetry alerts retrieved", alerts));
    }

    @GetMapping("/blockchain/stats")
    public ResponseEntity<ApiResponse<BlockchainStatsResponse>> getBlockchainStats() {
        BlockchainStatsResponse stats = adminService.getBlockchainStats();
        return ResponseEntity.ok(ApiResponse.success("Blockchain registry telemetry stats retrieved", stats));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLogDto>>> getAuditLogs() {
        List<AuditLogDto> auditLogs = adminService.getAuditLogs();
        return ResponseEntity.ok(ApiResponse.success("Audit trail logs retrieved", auditLogs));
    }

    @GetMapping(value = "/export/audit-logs", produces = "text/csv")
    public ResponseEntity<String> exportAuditLogs() {
        String csv = adminService.exportAuditLogsCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"beeproof_audit_logs.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
