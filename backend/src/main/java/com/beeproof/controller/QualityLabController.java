package com.beeproof.controller;

import com.beeproof.domain.HoneyBatch;
import com.beeproof.domain.QualityReport;
import com.beeproof.dto.ApiResponse;
import com.beeproof.dto.SupplyChainDtos.QualityVerificationRequest;
import com.beeproof.repository.QualityReportRepository;
import com.beeproof.service.SupplyChainService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quality-lab")
@PreAuthorize("hasRole('QUALITY_LAB')")
public class QualityLabController {

    private final QualityReportRepository qualityReportRepository;
    private final SupplyChainService supplyChainService;

    public QualityLabController(QualityReportRepository qualityReportRepository, SupplyChainService supplyChainService) {
        this.qualityReportRepository = qualityReportRepository;
        this.supplyChainService = supplyChainService;
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOverview() {
        List<QualityReport> reports = qualityReportRepository.findAll();
        List<HoneyBatch> pending = supplyChainService.getPendingQualityBatches();
        Map<String, Object> data = new HashMap<>();
        data.put("labName", "National Agro-Food Quality & NMR Research Laboratory");
        data.put("accreditationNumber", "NABL-TC-8891-2026");
        data.put("totalTestsConducted", reports.size());
        data.put("pendingVerificationCount", pending.size());
        data.put("nmrAssaysPassedRate", "100%");
        data.put("reports", reports);
        data.put("pendingBatches", pending);
        return ResponseEntity.ok(ApiResponse.success("Quality lab overview retrieved", data));
    }

    @GetMapping("/batches/pending")
    public ResponseEntity<ApiResponse<List<HoneyBatch>>> getPendingBatches() {
        List<HoneyBatch> pending = supplyChainService.getPendingQualityBatches();
        return ResponseEntity.ok(ApiResponse.success("Pending batches for quality verification retrieved", pending));
    }

    @PostMapping("/batches/{batchNumber}/verify")
    public ResponseEntity<ApiResponse<QualityReport>> verifyBatchQuality(
            @PathVariable String batchNumber,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody QualityVerificationRequest request) {
        QualityReport report = supplyChainService.verifyQuality(batchNumber, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Quality verification recorded: " + report.getOverallVerdict(), report));
    }
}
