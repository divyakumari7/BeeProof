package com.beeproof.service;

import com.beeproof.domain.*;
import com.beeproof.domain.enums.BatchStatus;
import com.beeproof.dto.SupplyChainDtos.*;
import com.beeproof.exception.BadRequestException;
import com.beeproof.exception.ResourceNotFoundException;
import com.beeproof.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SupplyChainService {

    private static final Logger logger = LoggerFactory.getLogger(SupplyChainService.class);

    private final HoneyBatchRepository batchRepository;
    private final ProcessingEventRepository processingEventRepository;
    private final QualityReportRepository qualityReportRepository;
    private final PackageRepository packageRepository;
    private final DistributionEventRepository distributionEventRepository;
    private final UserRepository userRepository;
    private final BlockchainService blockchainService;
    private final AuditService auditService;

    public SupplyChainService(
            HoneyBatchRepository batchRepository,
            ProcessingEventRepository processingEventRepository,
            QualityReportRepository qualityReportRepository,
            PackageRepository packageRepository,
            DistributionEventRepository distributionEventRepository,
            UserRepository userRepository,
            BlockchainService blockchainService,
            AuditService auditService) {
        this.batchRepository = batchRepository;
        this.processingEventRepository = processingEventRepository;
        this.qualityReportRepository = qualityReportRepository;
        this.packageRepository = packageRepository;
        this.distributionEventRepository = distributionEventRepository;
        this.userRepository = userRepository;
        this.blockchainService = blockchainService;
        this.auditService = auditService;
    }

    private HoneyBatch findBatch(String batchNumber) {
        return batchRepository.findByBatchNumber(batchNumber.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Honey batch not found: " + batchNumber));
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    // 1. COLLECT: HARVESTED -> COLLECTED
    @Transactional
    public HoneyBatch collectBatch(String batchNumber, String username, CollectBatchRequest request) {
        HoneyBatch batch = findBatch(batchNumber);
        User user = findUser(username);

        if (batch.getStatus() != BatchStatus.HARVESTED) {
            throw new BadRequestException("Invalid state transition: Cannot collect batch with status " + batch.getStatus());
        }

        batch.setStatus(BatchStatus.COLLECTED);
        batch = batchRepository.save(batch);

        blockchainService.recordBatchHarvestOnChain(batch);
        auditService.log("BATCH_COLLECTED", "HoneyBatch", String.valueOf(batch.getId()), user.getUsername(),
                "Batch collected from apiary: " + request.getCollectionLocation());

        return batch;
    }

    // 2. PROCESS: COLLECTED/HARVESTED -> IN_PROCESSING
    @Transactional
    public ProcessingEvent processBatch(String batchNumber, String username, ProcessBatchRequest request) {
        HoneyBatch batch = findBatch(batchNumber);
        User user = findUser(username);

        if (batch.getStatus() != BatchStatus.HARVESTED && batch.getStatus() != BatchStatus.COLLECTED) {
            throw new BadRequestException("Invalid state transition: Cannot process batch in status " + batch.getStatus() +
                    ". Batch must be HARVESTED or COLLECTED.");
        }

        batch.setStatus(BatchStatus.IN_PROCESSING);
        batch = batchRepository.save(batch);

        ProcessingEvent event = ProcessingEvent.builder()
                .batch(batch)
                .processor(user)
                .facilityName(request.getFacilityName())
                .operationType(request.getOperationType())
                .processedQuantityKg(request.getProcessedQuantityKg())
                .finalMoisturePercent(request.getFinalMoisturePercent() != null ? request.getFinalMoisturePercent() : 17.5)
                .processingTemperatureCelsius(request.getProcessingTemperatureCelsius() != null ? request.getProcessingTemperatureCelsius() : 38.0)
                .processedAt(LocalDateTime.now())
                .notes(request.getNotes() != null ? request.getNotes() : "Cold filtered and standardized")
                .build();

        event = processingEventRepository.save(event);

        blockchainService.recordBatchHarvestOnChain(batch);
        auditService.log("BATCH_PROCESSED", "HoneyBatch", String.valueOf(batch.getId()), user.getUsername(),
                "Batch processed at " + request.getFacilityName());

        return event;
    }

    // 3. QUALITY ASSAY: IN_PROCESSING -> QUALITY_VERIFIED or REJECTED
    @Transactional
    public QualityReport verifyQuality(String batchNumber, String username, QualityVerificationRequest request) {
        HoneyBatch batch = findBatch(batchNumber);
        User user = findUser(username);

        if (batch.getStatus() != BatchStatus.IN_PROCESSING && batch.getStatus() != BatchStatus.PROCESSING && batch.getStatus() != BatchStatus.COLLECTED) {
            throw new BadRequestException("Invalid state transition: Cannot verify quality for batch in status " + batch.getStatus() +
                    ". Batch must be in processing state.");
        }

        boolean passed = "PASSED".equalsIgnoreCase(request.getOverallVerdict()) &&
                Boolean.TRUE.equals(request.getNmrSpectroscopyPassed()) &&
                Boolean.FALSE.equals(request.getC4SugarAdulterationDetected());

        batch.setStatus(passed ? BatchStatus.QUALITY_VERIFIED : BatchStatus.REJECTED);
        batch = batchRepository.save(batch);

        QualityReport report = QualityReport.builder()
                .batch(batch)
                .labTechnician(user)
                .certificateNumber(request.getCertificateNumber())
                .laboratoryName(request.getLaboratoryName())
                .moisturePercentage(request.getMoisturePercentage())
                .fructosePercentage(request.getFructosePercentage() != null ? request.getFructosePercentage() : 38.2)
                .glucosePercentage(request.getGlucosePercentage() != null ? request.getGlucosePercentage() : 31.5)
                .sucrosePercentage(request.getSucrosePercentage() != null ? request.getSucrosePercentage() : 1.2)
                .hmfMgPerKg(10.5)
                .pollenPurityScore(request.getPollenPurityScore())
                .nmrSpectroscopyPassed(request.getNmrSpectroscopyPassed())
                .c4SugarAdulterationDetected(request.getC4SugarAdulterationDetected())
                .overallVerdict(passed ? "PASSED" : "REJECTED")
                .remarks(request.getRemarks() != null ? request.getRemarks() : "NABL certified analysis")
                .certifiedAt(LocalDateTime.now())
                .build();

        report = qualityReportRepository.save(report);

        blockchainService.recordBatchHarvestOnChain(batch);
        auditService.log("BATCH_QUALITY_VERIFIED", "HoneyBatch", String.valueOf(batch.getId()), user.getUsername(),
                "Quality verification completed: " + report.getOverallVerdict());

        return report;
    }

    // 4. PACKAGE: QUALITY_VERIFIED/CERTIFIED -> PACKAGED
    @Transactional
    public List<PackageEntity> packageBatch(String batchNumber, String username, PackageBatchRequest request) {
        HoneyBatch batch = findBatch(batchNumber);
        User user = findUser(username);

        // STRICT REQUIREMENT: A batch may become PACKAGED only after QUALITY_VERIFIED!
        if (batch.getStatus() != BatchStatus.QUALITY_VERIFIED && batch.getStatus() != BatchStatus.CERTIFIED) {
            throw new BadRequestException("Invalid state transition: Cannot package batch with status " + batch.getStatus() +
                    ". Batch MUST be QUALITY_VERIFIED before packaging.");
        }

        batch.setStatus(BatchStatus.PACKAGED);
        batch = batchRepository.save(batch);

        List<PackageEntity> packages = new ArrayList<>();
        int count = request.getUnitCount() != null && request.getUnitCount() > 0 ? request.getUnitCount() : 10;
        int bestBefore = request.getBestBeforeMonths() != null ? request.getBestBeforeMonths() : 24;

        for (int i = 1; i <= count; i++) {
            String serial = String.format("%s-PKG-%04d", batch.getBatchNumber(), i);
            PackageEntity pkg = PackageEntity.builder()
                    .batch(batch)
                    .serialNumber(serial)
                    .netWeightGrams(request.getNetWeightGrams())
                    .packagingType(request.getPackagingType())
                    .packagingDate(LocalDate.now())
                    .bestBeforeDate(LocalDate.now().plusMonths(bestBefore))
                    .build();
            packages.add(packageRepository.save(pkg));
        }

        blockchainService.recordBatchHarvestOnChain(batch);
        auditService.log("BATCH_PACKAGED", "HoneyBatch", String.valueOf(batch.getId()), user.getUsername(),
                "Batch packaged into " + count + " units of " + request.getPackagingType());

        return packages;
    }

    // 5. DISPATCH: PACKAGED -> DISPATCHED
    @Transactional
    public DistributionEvent dispatchBatch(String batchNumber, String username, DispatchBatchRequest request) {
        HoneyBatch batch = findBatch(batchNumber);
        User user = findUser(username);

        // STRICT REQUIREMENT: Enforce PACKAGED -> DISPATCHED
        if (batch.getStatus() != BatchStatus.PACKAGED) {
            throw new BadRequestException("Invalid state transition: Cannot dispatch batch with status " + batch.getStatus() +
                    ". Batch MUST be PACKAGED before dispatch.");
        }

        batch.setStatus(BatchStatus.DISPATCHED);
        batch = batchRepository.save(batch);

        DistributionEvent event = DistributionEvent.builder()
                .batch(batch)
                .distributor(user)
                .originLocation(request.getOriginLocation())
                .destinationLocation(request.getDestinationLocation())
                .status("DISPATCHED_IN_TRANSIT")
                .quantityDispatchedKg(request.getQuantityDispatchedKg())
                .ambientTemperatureCelsius(request.getAmbientTemperatureCelsius() != null ? request.getAmbientTemperatureCelsius() : 22.0)
                .eventTimestamp(LocalDateTime.now())
                .trackingReference(request.getTrackingReference() != null ? request.getTrackingReference() : "TRK-" + System.currentTimeMillis())
                .build();

        event = distributionEventRepository.save(event);

        blockchainService.recordBatchHarvestOnChain(batch);
        auditService.log("BATCH_DISPATCHED", "HoneyBatch", String.valueOf(batch.getId()), user.getUsername(),
                "Dispatched to " + request.getDestinationLocation() + " with tracking " + event.getTrackingReference());

        return event;
    }

    // 6. DELIVER: DISPATCHED -> DELIVERED
    @Transactional
    public DistributionEvent deliverBatch(String batchNumber, String username, DeliverBatchRequest request) {
        HoneyBatch batch = findBatch(batchNumber);
        User user = findUser(username);

        // STRICT REQUIREMENT: A batch cannot become DELIVERED before DISPATCHED!
        if (batch.getStatus() != BatchStatus.DISPATCHED && batch.getStatus() != BatchStatus.IN_TRANSIT) {
            throw new BadRequestException("Invalid state transition: Cannot deliver batch with status " + batch.getStatus() +
                    ". A batch CANNOT become DELIVERED before being DISPATCHED.");
        }

        batch.setStatus(BatchStatus.DELIVERED);
        batch = batchRepository.save(batch);

        List<DistributionEvent> existingEvents = distributionEventRepository.findByBatch(batch);
        DistributionEvent event;
        if (!existingEvents.isEmpty()) {
            event = existingEvents.get(existingEvents.size() - 1);
            event.setStatus("DELIVERED_TO_DESTINATION");
            event.setDestinationLocation(request.getDestinationDepot());
            event = distributionEventRepository.save(event);
        } else {
            event = DistributionEvent.builder()
                    .batch(batch)
                    .distributor(user)
                    .originLocation("Regional Packaging Facility")
                    .destinationLocation(request.getDestinationDepot())
                    .status("DELIVERED_TO_DESTINATION")
                    .quantityDispatchedKg(batch.getTotalQuantityKg())
                    .ambientTemperatureCelsius(20.5)
                    .eventTimestamp(LocalDateTime.now())
                    .trackingReference("DLV-" + System.currentTimeMillis())
                    .build();
            event = distributionEventRepository.save(event);
        }

        blockchainService.recordBatchHarvestOnChain(batch);
        auditService.log("BATCH_DELIVERED", "HoneyBatch", String.valueOf(batch.getId()), user.getUsername(),
                "Delivered and accepted at depot: " + request.getDestinationDepot());

        return event;
    }

    @Transactional(readOnly = true)
    public List<HoneyBatch> getBatchesForProcessor() {
        return batchRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<HoneyBatch> getPendingQualityBatches() {
        return batchRepository.findAll().stream()
                .filter(b -> b.getStatus() == BatchStatus.IN_PROCESSING || b.getStatus() == BatchStatus.PROCESSING || b.getStatus() == BatchStatus.COLLECTED)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HoneyBatch> getPackagedBatches() {
        return batchRepository.findAll().stream()
                .filter(b -> b.getStatus() == BatchStatus.PACKAGED || b.getStatus() == BatchStatus.DISPATCHED)
                .toList();
    }
}
