package com.beeproof.controller;

import com.beeproof.dto.ApiResponse;
import com.beeproof.dto.BatchVerificationResponse;
import com.beeproof.service.VerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/verify")
public class PublicVerificationController {

    private final VerificationService verificationService;

    public PublicVerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @GetMapping({"/batch/{batchNumber}", "/{batchNumber}"})
    public ResponseEntity<ApiResponse<BatchVerificationResponse>> verifyBatch(@PathVariable String batchNumber) {
        BatchVerificationResponse response = verificationService.verifyBatch(batchNumber);
        return ResponseEntity.ok(ApiResponse.success("Batch provenance verified successfully", response));
    }
}
