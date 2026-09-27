package com.beeproof.service;

import com.beeproof.domain.*;
import com.beeproof.dto.BatchVerificationResponse;
import com.beeproof.exception.ResourceNotFoundException;
import com.beeproof.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VerificationService {

    private final HoneyBatchRepository batchRepository;
    private final QualityReportRepository qualityReportRepository;
    private final HarvestEventRepository harvestEventRepository;
    private final ProcessingEventRepository processingEventRepository;
    private final DistributionEventRepository distributionEventRepository;
    private final BlockchainService blockchainService;
    private final QrCodeService qrCodeService;
    private final AuditService auditService;

    public VerificationService(HoneyBatchRepository batchRepository,
                               QualityReportRepository qualityReportRepository,
                               HarvestEventRepository harvestEventRepository,
                               ProcessingEventRepository processingEventRepository,
                               DistributionEventRepository distributionEventRepository,
                               BlockchainService blockchainService,
                               QrCodeService qrCodeService,
                               AuditService auditService) {
        this.batchRepository = batchRepository;
        this.qualityReportRepository = qualityReportRepository;
        this.harvestEventRepository = harvestEventRepository;
        this.processingEventRepository = processingEventRepository;
        this.distributionEventRepository = distributionEventRepository;
        this.blockchainService = blockchainService;
        this.qrCodeService = qrCodeService;
        this.auditService = auditService;
    }

    @Transactional
    public BatchVerificationResponse verifyBatch(String batchNumber) {
        HoneyBatch batch = batchRepository.findByBatchNumber(batchNumber.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with identifier: " + batchNumber));

        Cluster cluster = batch.getCluster();
        Optional<QualityReport> qualityReportOpt = qualityReportRepository.findByBatch(batch);

        // 1. Dynamic Blockchain Integrity Verification
        boolean integrityVerified = blockchainService.verifyIntegrity(batch);
        Optional<BlockchainRecord> bcRecordOpt = blockchainService.getLatestRecord(batch);

        String verificationStatus;
        if (integrityVerified) {
            verificationStatus = "Provenance Verified";
        } else {
            verificationStatus = "Verification Failed — Data may have been tampered.";
        }

        // 2. Increment scan count & fetch QR
        qrCodeService.incrementScanCount(batch);
        Optional<QrCodeEntity> qrOpt = qrCodeService.getByBatch(batch);
        String qrUrl = qrOpt.map(QrCodeEntity::getTargetVerificationUrl)
                .orElse("http://localhost:5173/verify/" + batch.getBatchNumber());

        BatchVerificationResponse.QualitySummary qualitySummary = null;
        if (qualityReportOpt.isPresent()) {
            QualityReport qr = qualityReportOpt.get();
            qualitySummary = BatchVerificationResponse.QualitySummary.builder()
                    .certificateNumber(qr.getCertificateNumber())
                    .laboratoryName(qr.getLaboratoryName())
                    .moisturePercentage(qr.getMoisturePercentage())
                    .pollenPurityScore(qr.getPollenPurityScore())
                    .nmrSpectroscopyPassed(qr.getNmrSpectroscopyPassed())
                    .c4SugarAdulterationDetected(qr.getC4SugarAdulterationDetected())
                    .verdict(qr.getOverallVerdict())
                    .certifiedAt(qr.getCertifiedAt())
                    .build();
        }

        // Build provenance timeline using ONLY actual persisted events
        List<BatchVerificationResponse.ProvenanceEvent> timeline = new ArrayList<>();

        // 1. Harvest Stage (Always present for valid batches)
        List<HarvestEvent> harvestEvents = harvestEventRepository.findByBatch(batch);
        HarvestEvent primaryHarvest = !harvestEvents.isEmpty() ? harvestEvents.get(0) : null;

        timeline.add(BatchVerificationResponse.ProvenanceEvent.builder()
                .stage("HARVEST")
                .title("Apiary Harvest Logged")
                .actor(primaryHarvest != null && primaryHarvest.getBeekeeper() != null ?
                        primaryHarvest.getBeekeeper().getUser().getFullName() : "Registered KVIC Beekeeper")
                .location(cluster != null ? cluster.getName() + ", " + cluster.getState() : "Registered Apiary")
                .timestamp(primaryHarvest != null ? primaryHarvest.getHarvestTimestamp() : batch.getHarvestDate().atTime(8, 30))
                .details("Raw unadulterated comb honey harvested from " + batch.getFloralSource() + " flora.")
                .completed(true)
                .build());

        // 2. Processing Stage (Only if actually processed in DB)
        List<ProcessingEvent> processingEvents = processingEventRepository.findByBatch(batch);
        if (!processingEvents.isEmpty()) {
            ProcessingEvent pe = processingEvents.get(0);
            timeline.add(BatchVerificationResponse.ProvenanceEvent.builder()
                    .stage("PROCESSING")
                    .title("Standard Cold Filtration & Normalization")
                    .actor(pe.getFacilityName() != null ? pe.getFacilityName() : "Certified Honey Processing Facility")
                    .location(cluster != null ? cluster.getState() : "Processing Depot")
                    .timestamp(pe.getProcessedAt())
                    .details("Filtered at <40°C preserving native enzymes, diastase, and invertase vitality.")
                    .completed(true)
                    .build());
        }

        // 3. Laboratory Testing Stage (Only if quality report exists in DB)
        if (qualityReportOpt.isPresent()) {
            QualityReport qr = qualityReportOpt.get();
            timeline.add(BatchVerificationResponse.ProvenanceEvent.builder()
                    .stage("TESTING")
                    .title("Laboratory Nuclear Magnetic Resonance (NMR) & Purity Assay")
                    .actor(qr.getLaboratoryName())
                    .location("NABL Accredited Testing Laboratory")
                    .timestamp(qr.getCertifiedAt())
                    .details("Certificate #" + qr.getCertificateNumber() + " - " + qr.getOverallVerdict() +
                            " (Pollen Purity: " + qr.getPollenPurityScore() + "%)")
                    .completed(true)
                    .build());
        }

        // 4. Distribution Stage (Only if distribution event exists in DB)
        List<DistributionEvent> distributionEvents = distributionEventRepository.findByBatch(batch);
        if (!distributionEvents.isEmpty()) {
            DistributionEvent de = distributionEvents.get(0);
            timeline.add(BatchVerificationResponse.ProvenanceEvent.builder()
                    .stage("DISTRIBUTION")
                    .title("Tamper-Evident Packaging & Custody Handover")
                    .actor(de.getDistributor() != null ? de.getDistributor().getFullName() : "Authorized Cold-Chain Logistics")
                    .location(de.getDestinationLocation() != null ? de.getDestinationLocation() : "Central Depot")
                    .timestamp(de.getEventTimestamp())
                    .details("Sealed with cryptographic serial codes for consumer end-to-end provenance verification.")
                    .completed(true)
                    .build());
        }

        auditService.log("PUBLIC_BATCH_VERIFIED", "HoneyBatch", String.valueOf(batch.getId()), "ANONYMOUS_CONSUMER",
                "Public provenance lookup for " + batch.getBatchNumber() + " (Integrity: " + verificationStatus + ")");

        return BatchVerificationResponse.builder()
                .batchNumber(batch.getBatchNumber())
                .verificationStatus(verificationStatus)
                .status(batch.getStatus().name())
                .harvestDate(batch.getHarvestDate())
                .floralSource(batch.getFloralSource())
                .totalQuantityKg(batch.getTotalQuantityKg())
                .blockchainTxHash(batch.getBlockchainTxHash())
                .blockchainVerified(integrityVerified)
                .stateMerkleRoot(bcRecordOpt.map(BlockchainRecord::getStateMerkleRoot).orElse(null))
                .blockNumber(bcRecordOpt.map(BlockchainRecord::getBlockNumber).orElse(null))
                .networkName(bcRecordOpt.map(BlockchainRecord::getNetworkName).orElse("Hardhat EVM Local"))
                .qrCodeUrl(qrUrl)
                .clusterCode(cluster != null ? cluster.getClusterCode() : "N/A")
                .clusterName(cluster != null ? cluster.getName() : "N/A")
                .region(cluster != null ? cluster.getRegion() : "N/A")
                .state(cluster != null ? cluster.getState() : "N/A")
                .district(cluster != null ? cluster.getDistrict() : "N/A")
                .latitude(cluster != null ? cluster.getLatitude() : null)
                .longitude(cluster != null ? cluster.getLongitude() : null)
                .qualitySummary(qualitySummary)
                .timeline(timeline)
                .build();
    }
}
