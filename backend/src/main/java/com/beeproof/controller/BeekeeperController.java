package com.beeproof.controller;

import com.beeproof.dto.ApiResponse;
import com.beeproof.dto.DomainDtos.BeekeeperOverviewResponse;
import com.beeproof.dto.DomainDtos.HiveDto;
import com.beeproof.service.BeekeeperService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/beekeeper")
@PreAuthorize("hasRole('BEEKEEPER')")
public class BeekeeperController {

    private final BeekeeperService beekeeperService;
    private final com.beeproof.service.BatchManagementService batchManagementService;

    public BeekeeperController(BeekeeperService beekeeperService, com.beeproof.service.BatchManagementService batchManagementService) {
        this.beekeeperService = beekeeperService;
        this.batchManagementService = batchManagementService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<BeekeeperOverviewResponse>> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        BeekeeperOverviewResponse dashboard = beekeeperService.getDashboard(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Beekeeper dashboard retrieved", dashboard));
    }

    @GetMapping("/hives")
    public ResponseEntity<ApiResponse<List<HiveDto>>> getHives(
            @AuthenticationPrincipal UserDetails userDetails) {
        BeekeeperOverviewResponse dashboard = beekeeperService.getDashboard(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Assigned hives retrieved", dashboard.getHives()));
    }

    @org.springframework.web.bind.annotation.PostMapping("/batches")
    public ResponseEntity<ApiResponse<com.beeproof.dto.BatchResponse>> createBatch(
            @AuthenticationPrincipal UserDetails userDetails,
            @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.beeproof.dto.CreateBatchRequest request) {
        com.beeproof.dto.BatchResponse response = batchManagementService.createHarvestBatch(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Harvest batch created and recorded on blockchain", response));
    }

    @GetMapping("/batches")
    public ResponseEntity<ApiResponse<List<com.beeproof.dto.BatchResponse>>> getBatches(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<com.beeproof.dto.BatchResponse> batches = batchManagementService.getBatchesForBeekeeper(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Beekeeper batches retrieved", batches));
    }
}
