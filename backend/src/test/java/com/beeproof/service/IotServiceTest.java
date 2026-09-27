package com.beeproof.service;

import com.beeproof.domain.*;
import com.beeproof.domain.enums.SensorType;
import com.beeproof.dto.IotDtos;
import com.beeproof.repository.HiveAlertRepository;
import com.beeproof.repository.HiveRepository;
import com.beeproof.repository.SensorReadingRepository;
import com.beeproof.repository.SensorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IotServiceTest {

    @Mock
    private HiveRepository hiveRepository;
    @Mock
    private SensorRepository sensorRepository;
    @Mock
    private SensorReadingRepository sensorReadingRepository;
    @Mock
    private HiveAlertRepository hiveAlertRepository;
    @Mock
    private AuditService auditService;

    @InjectMocks
    private IotService iotService;

    private Hive testHive;
    private Sensor testSensor;

    @BeforeEach
    void setUp() {
        testHive = new Hive();
        testHive.setId(10L);
        testHive.setHiveCode("HIVE-P4-001");

        testSensor = Sensor.builder()
                .id(1L)
                .sensorIdentifier("SEN-HIVE-P4-001-M01")
                .hive(testHive)
                .sensorType(SensorType.MULTISENSOR_CORE)
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Should ingest normal telemetry and persist reading")
    void testIngestNormalTelemetry() {
        when(hiveRepository.findById(10L)).thenReturn(Optional.of(testHive));
        when(sensorRepository.findBySensorIdentifier(anyString())).thenReturn(Optional.of(testSensor));
        when(sensorRepository.save(any(Sensor.class))).thenReturn(testSensor);
        when(sensorReadingRepository.save(any(SensorReading.class))).thenAnswer(i -> i.getArgument(0));

        IotDtos.IngestReadingRequest req = new IotDtos.IngestReadingRequest(
                10L, "SEN-HIVE-P4-001-M01", 34.5, 55.0, 32.0, 220.0, 45.0, LocalDateTime.now()
        );

        SensorReading result = iotService.ingestReading(req, "test-beekeeper");

        assertNotNull(result);
        assertEquals(34.5, result.getTemperatureCelsius());
        assertEquals(55.0, result.getRelativeHumidityPercent());
        verify(sensorReadingRepository, times(1)).save(any(SensorReading.class));
        verify(hiveAlertRepository, never()).save(any(HiveAlert.class));
    }

    @Test
    @DisplayName("Should trigger abnormal high temperature alert when temp > 36.5°C")
    void testIngestAbnormalHighTemperatureAlert() {
        when(hiveRepository.findById(10L)).thenReturn(Optional.of(testHive));
        when(sensorRepository.findBySensorIdentifier(anyString())).thenReturn(Optional.of(testSensor));
        when(sensorRepository.save(any(Sensor.class))).thenReturn(testSensor);
        when(sensorReadingRepository.save(any(SensorReading.class))).thenAnswer(i -> i.getArgument(0));
        when(hiveAlertRepository.findByHiveAndStatusOrderByCreatedAtDesc(eq(testHive), eq(HiveAlert.AlertStatus.UNREAD)))
                .thenReturn(Collections.emptyList());

        IotDtos.IngestReadingRequest req = new IotDtos.IngestReadingRequest(
                10L, "SEN-HIVE-P4-001-M01", 39.2, 55.0, 32.0, 220.0, 45.0, LocalDateTime.now()
        );

        iotService.ingestReading(req, "test-beekeeper");

        verify(hiveAlertRepository, times(1)).save(argThat(alert ->
                alert.getMetric().equals("TEMPERATURE") &&
                alert.getObservedValue() == 39.2 &&
                alert.getStatus() == HiveAlert.AlertStatus.UNREAD &&
                alert.getReason().contains("elevated")
        ));
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when temperature is physically invalid")
    void testInvalidTemperatureRange() {
        when(hiveRepository.findById(10L)).thenReturn(Optional.of(testHive));

        IotDtos.IngestReadingRequest req = new IotDtos.IngestReadingRequest(
                10L, "SEN-HIVE-P4-001-M01", 95.0, 55.0, 32.0, 220.0, 45.0, LocalDateTime.now()
        );

        assertThrows(IllegalArgumentException.class, () -> iotService.ingestReading(req, "test-actor"));
    }

    @Test
    @DisplayName("Should return DEMO / SIMULATED SENSOR DATA label and history in telemetry query")
    void testGetHiveTelemetry() {
        when(hiveRepository.findById(10L)).thenReturn(Optional.of(testHive));
        when(sensorRepository.findByHive(testHive)).thenReturn(List.of(testSensor));

        SensorReading r1 = SensorReading.builder()
                .sensor(testSensor)
                .recordedAt(LocalDateTime.now().minusMinutes(30))
                .temperatureCelsius(34.2)
                .relativeHumidityPercent(58.0)
                .weightKilograms(31.5)
                .acousticDominantFreqHz(225.0)
                .build();

        when(sensorReadingRepository.findRecentByHiveId(eq(10L), any(PageRequest.class)))
                .thenReturn(List.of(r1));

        IotDtos.HiveTelemetryResponse resp = iotService.getHiveTelemetry(10L);

        assertNotNull(resp);
        assertEquals("DEMO / SIMULATED SENSOR DATA", resp.getDataSourceLabel());
        assertEquals("ONLINE", resp.getSensorStatus());
        assertEquals(34.2, resp.getCurrentTemperature());
        assertEquals(1, resp.getHistory().size());
    }

    @Test
    @DisplayName("Should resolve an active alert")
    void testResolveAlert() {
        HiveAlert alert = new HiveAlert(testHive, "TEMPERATURE", 38.5, "32-36.5°C",
                "High temp", "Shade hive", HiveAlert.AlertStatus.UNREAD);
        alert.setId(77L);

        when(hiveAlertRepository.findById(77L)).thenReturn(Optional.of(alert));
        when(hiveAlertRepository.save(any(HiveAlert.class))).thenAnswer(i -> i.getArgument(0));

        HiveAlert resolved = iotService.resolveAlert(77L, "beekeeper@beeproof.org");

        assertEquals(HiveAlert.AlertStatus.RESOLVED, resolved.getStatus());
        assertNotNull(resolved.getResolvedAt());
        verify(auditService, times(1)).log(eq("RESOLVE_ALERT"), eq("HIVE_ALERT"), eq("77"), anyString(), anyString());
    }
}
