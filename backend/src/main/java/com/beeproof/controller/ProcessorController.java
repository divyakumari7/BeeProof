package com.beeproof.controller;

import com.beeproof.domain.HoneyBatch;
import com.beeproof.domain.PackageEntity;
import com.beeproof.domain.ProcessingEvent;
import com.beeproof.dto.ApiResponse;
import com.beeproof.dto.SupplyChainDtos.CollectBatchRequest;
import com.beeproof.dto.SupplyChainDtos.PackageBatchRequest;
import com.beeproof.dto.SupplyChainDtos.ProcessBatchRequest;
import com.beeproof.repository.HoneyBatchRepository;
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
@RequestMapping("/api/processor")
@PreAuthorize("hasRole('PROCESSOR')")
public class ProcessorController {

    private final HoneyBatchRepository batchRepository;
    private final SupplyChainService supplyChainService;

    public ProcessorController(HoneyBatchRepository batchRepository, SupplyChainService supplyChainService) {
        this.batchRepository = batchRepository;
        this.supplyChainService = supplyChainService;
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOverview() {
        List<HoneyBatch> batches = batchRepository.findAll();
        Map<String, Object> data = new HashMap<>();
        data.put("facilityName", "Northern Apex Honey Processing Facility");
        data.put("facilityRegistration", "FSSAI-PROC-2026-981");
        data.put("inboundBatchesCount", batches.size());
        data.put("batchesInProcessing", batches.stream().filter(b -> b.getStatus().name().contains("PROCESSING")).count());
        data.put("filtrationUnitsActive", 4);
        data.put("batches", batches);
        return ResponseEntity.ok(ApiResponse.success("Processor overview retrieved", data));
    }

    @GetMapping("/batches")
    public ResponseEntity<ApiResponse<List<HoneyBatch>>> getBatches() {
        List<HoneyBatch> batches = supplyChainService.getBatchesForProcessor();
        return ResponseEntity.ok(ApiResponse.success("Processor batches retrieved", batches));
    }

    @PostMapping("/batches/{batchNumber}/collect")
    public ResponseEntity<ApiResponse<HoneyBatch>> collectBatch(
            @PathVariable String batchNumber,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CollectBatchRequest request) {
        HoneyBatch batch = supplyChainService.collectBatch(batchNumber, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Batch successfully collected from apiary", batch));
    }

    @PostMapping("/batches/{batchNumber}/process")
    public ResponseEntity<ApiResponse<ProcessingEvent>> processBatch(
            @PathVariable String batchNumber,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProcessBatchRequest request) {
        ProcessingEvent event = supplyChainService.processBatch(batchNumber, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Processing logged and status updated to IN_PROCESSING", event));
    }

    @PostMapping("/batches/{batchNumber}/package")
    public ResponseEntity<ApiResponse<List<PackageEntity>>> packageBatch(
            @PathVariable String batchNumber,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PackageBatchRequest request) {
        List<PackageEntity> packages = supplyChainService.packageBatch(batchNumber, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Batch packaged into " + packages.size() + " serialized units", packages));
    }
}
