package com.beeproof.controller;

import com.beeproof.dto.AiDtos;
import com.beeproof.dto.ApiResponse;
import com.beeproof.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/hives/{hiveId}/insights")
    public ResponseEntity<ApiResponse<AiDtos.HiveAiInsightsSummary>> getHiveInsights(
            @PathVariable Long hiveId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String actor = userDetails != null ? userDetails.getUsername() : "AI_VIEWER";
        AiDtos.HiveAiInsightsSummary summary = aiService.generateOrGetInsights(hiveId, actor);
        return ResponseEntity.ok(ApiResponse.success("AI insights computed successfully", summary));
    }

    @PostMapping("/hives/{hiveId}/refresh-predictions")
    public ResponseEntity<ApiResponse<AiDtos.HiveAiInsightsSummary>> refreshPredictions(
            @PathVariable Long hiveId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String actor = userDetails != null ? userDetails.getUsername() : "BEEKEEPER";
        AiDtos.HiveAiInsightsSummary summary = aiService.generateOrGetInsights(hiveId, actor);
        return ResponseEntity.ok(ApiResponse.success("AI predictions refreshed from biometric telemetry", summary));
    }
}
