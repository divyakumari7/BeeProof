package com.beeproof.controller;

import com.beeproof.domain.HiveAlert;
import com.beeproof.domain.Sensor;
import com.beeproof.domain.SensorReading;
import com.beeproof.dto.ApiResponse;
import com.beeproof.dto.IotDtos;
import com.beeproof.service.IotService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/iot")
public class IotController {

    private final IotService iotService;

    public IotController(IotService iotService) {
        this.iotService = iotService;
    }

    @PostMapping("/readings")
    public ResponseEntity<ApiResponse<SensorReading>> ingestReading(
            @Valid @RequestBody IotDtos.IngestReadingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String actor = userDetails != null ? userDetails.getUsername() : "IOT_GATEWAY";
        SensorReading reading = iotService.ingestReading(request, actor);
        return ResponseEntity.ok(ApiResponse.success("Telemetry reading recorded successfully", reading));
    }

    @GetMapping("/hives/{hiveId}/telemetry")
    public ResponseEntity<ApiResponse<IotDtos.HiveTelemetryResponse>> getTelemetry(
            @PathVariable Long hiveId) {
        IotDtos.HiveTelemetryResponse telemetry = iotService.getHiveTelemetry(hiveId);
        return ResponseEntity.ok(ApiResponse.success("Telemetry retrieved", telemetry));
    }

    @GetMapping("/hives/{hiveId}/alerts")
    public ResponseEntity<ApiResponse<List<HiveAlert>>> getHiveAlerts(
            @PathVariable Long hiveId) {
        List<HiveAlert> alerts = iotService.getHiveAlerts(hiveId);
        return ResponseEntity.ok(ApiResponse.success("Hive alerts retrieved", alerts));
    }

    @GetMapping("/alerts/active")
    public ResponseEntity<ApiResponse<List<HiveAlert>>> getActiveAlerts() {
        List<HiveAlert> alerts = iotService.getAllActiveAlerts();
        return ResponseEntity.ok(ApiResponse.success("Active alerts retrieved", alerts));
    }

    @PutMapping("/alerts/{alertId}/resolve")
    public ResponseEntity<ApiResponse<HiveAlert>> resolveAlert(
            @PathVariable Long alertId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String actor = userDetails != null ? userDetails.getUsername() : "SYSTEM";
        HiveAlert resolved = iotService.resolveAlert(alertId, actor);
        return ResponseEntity.ok(ApiResponse.success("Alert marked as resolved", resolved));
    }

    @PostMapping("/hives/{hiveId}/simulate")
    public ResponseEntity<ApiResponse<SensorReading>> simulateScenario(
            @PathVariable Long hiveId,
            @RequestParam(defaultValue = "NORMAL") String scenario,
            @AuthenticationPrincipal UserDetails userDetails) {
        String actor = userDetails != null ? userDetails.getUsername() : "SIMULATOR";
        SensorReading reading = iotService.simulateCondition(hiveId, scenario, actor);
        return ResponseEntity.ok(ApiResponse.success("Simulated scenario '" + scenario + "' executed", reading));
    }

    @PutMapping("/sensors/{sensorIdentifier}/status")
    public ResponseEntity<ApiResponse<Sensor>> setSensorStatus(
            @PathVariable String sensorIdentifier,
            @RequestParam boolean active,
            @AuthenticationPrincipal UserDetails userDetails) {
        String actor = userDetails != null ? userDetails.getUsername() : "SYSTEM";
        Sensor sensor = iotService.setSensorStatus(sensorIdentifier, active, actor);
        return ResponseEntity.ok(ApiResponse.success("Sensor status updated to " + (active ? "ONLINE" : "OFFLINE"), sensor));
    }
}
