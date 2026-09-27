package com.beeproof.controller;

import com.beeproof.domain.DistributionEvent;
import com.beeproof.domain.HoneyBatch;
import com.beeproof.dto.ApiResponse;
import com.beeproof.dto.SupplyChainDtos.DeliverBatchRequest;
import com.beeproof.dto.SupplyChainDtos.DispatchBatchRequest;
import com.beeproof.repository.DistributionEventRepository;
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
@RequestMapping("/api/distributor")
@PreAuthorize("hasRole('DISTRIBUTOR')")
public class DistributorController {

    private final DistributionEventRepository distributionEventRepository;
    private final SupplyChainService supplyChainService;

    public DistributorController(DistributionEventRepository distributionEventRepository, SupplyChainService supplyChainService) {
        this.distributionEventRepository = distributionEventRepository;
        this.supplyChainService = supplyChainService;
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOverview() {
        List<DistributionEvent> events = distributionEventRepository.findAll();
        List<HoneyBatch> packagedBatches = supplyChainService.getPackagedBatches();
        Map<String, Object> data = new HashMap<>();
        data.put("distributorName", "EcoLogistics Distribution Network Ltd.");
        data.put("licenseNumber", "DIST-KVIC-DL-2026");
        data.put("activeConsignments", events.size());
        data.put("packagedBatchesAvailable", packagedBatches.size());
        data.put("coldChainCompliantRate", "99.8%");
        data.put("events", events);
        data.put("packagedBatches", packagedBatches);
        return ResponseEntity.ok(ApiResponse.success("Distributor overview retrieved", data));
    }

    @GetMapping("/batches/packaged")
    public ResponseEntity<ApiResponse<List<HoneyBatch>>> getPackagedBatches() {
        List<HoneyBatch> batches = supplyChainService.getPackagedBatches();
        return ResponseEntity.ok(ApiResponse.success("Packaged batches retrieved for distribution", batches));
    }

    @PostMapping("/batches/{batchNumber}/dispatch")
    public ResponseEntity<ApiResponse<DistributionEvent>> dispatchBatch(
            @PathVariable String batchNumber,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody DispatchBatchRequest request) {
        DistributionEvent event = supplyChainService.dispatchBatch(batchNumber, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Consignment dispatched with tracking " + event.getTrackingReference(), event));
    }

    @PostMapping("/batches/{batchNumber}/deliver")
    public ResponseEntity<ApiResponse<DistributionEvent>> deliverBatch(
            @PathVariable String batchNumber,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody DeliverBatchRequest request) {
        DistributionEvent event = supplyChainService.deliverBatch(batchNumber, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Consignment delivery confirmed at " + event.getDestinationLocation(), event));
    }
}
