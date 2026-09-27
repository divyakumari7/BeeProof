package com.beeproof.service;

import com.beeproof.domain.*;
import com.beeproof.domain.enums.BatchStatus;
import com.beeproof.dto.BatchResponse;
import com.beeproof.dto.CreateBatchRequest;
import com.beeproof.exception.BadRequestException;
import com.beeproof.exception.ResourceNotFoundException;
import com.beeproof.repository.BeekeeperRepository;
import com.beeproof.repository.HarvestEventRepository;
import com.beeproof.repository.HiveRepository;
import com.beeproof.repository.HoneyBatchRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class BatchManagementService {

    private final HoneyBatchRepository honeyBatchRepository;
    private final BeekeeperRepository beekeeperRepository;
    private final HiveRepository hiveRepository;
    private final HarvestEventRepository harvestEventRepository;
    private final BlockchainService blockchainService;
    private final QrCodeService qrCodeService;
    private final AuditService auditService;

    private static final AtomicLong BATCH_SEQ = new AtomicLong(100);

    public BatchManagementService(
            HoneyBatchRepository honeyBatchRepository,
            BeekeeperRepository beekeeperRepository,
            HiveRepository hiveRepository,
            HarvestEventRepository harvestEventRepository,
            BlockchainService blockchainService,
            QrCodeService qrCodeService,
            AuditService auditService) {
        this.honeyBatchRepository = honeyBatchRepository;
        this.beekeeperRepository = beekeeperRepository;
        this.hiveRepository = hiveRepository;
        this.harvestEventRepository = harvestEventRepository;
        this.blockchainService = blockchainService;
        this.qrCodeService = qrCodeService;
        this.auditService = auditService;
    }

    @Transactional
    public BatchResponse createHarvestBatch(String username, CreateBatchRequest request) {
        Beekeeper beekeeper = beekeeperRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Beekeeper profile not found for: " + username));

        Hive hive = hiveRepository.findById(request.getHiveId())
                .orElseThrow(() -> new ResourceNotFoundException("Hive not found with ID: " + request.getHiveId()));

        // CRITICAL RBAC & OWNERSHIP CHECK: A beekeeper must not create a batch for another beekeeper's hive!
        if (hive.getBeekeeper() == null || !hive.getBeekeeper().getId().equals(beekeeper.getId())) {
            throw new AccessDeniedException("Access Denied: Hive #" + hive.getId() + " (" + hive.getHiveCode() +
                    ") is not registered to your account.");
        }

        Cluster cluster = hive.getCluster();
        if (cluster == null) {
            cluster = beekeeper.getAssignedCluster();
        }

        // Generate unique batch number: BP-2026-SUN-101
        String prefix = cluster != null ? cluster.getClusterCode().replace("-", "").toUpperCase() : "AGR";
        if (prefix.length() > 3) prefix = prefix.substring(0, 3);
        String batchNumber = String.format("BP-2026-%s-%03d", prefix, BATCH_SEQ.incrementAndGet());

        // 1. Create and persist HoneyBatch
        HoneyBatch batch = HoneyBatch.builder()
                .batchNumber(batchNumber)
                .cluster(cluster)
                .floralSource(request.getFloralSource())
                .harvestDate(request.getHarvestDate())
                .totalQuantityKg(request.getQuantityKg())
                .status(BatchStatus.HARVESTED)
                .rawPurityIndex("HIGH_PURITY_RAW")
                .build();

        batch = honeyBatchRepository.save(batch);

        // 2. Create and persist HarvestEvent
        HarvestEvent harvestEvent = HarvestEvent.builder()
                .batch(batch)
                .hive(hive)
                .beekeeper(beekeeper)
                .quantityExtractedKg(request.getQuantityKg())
                .harvestTimestamp(LocalDateTime.now())
                .moistureContentPercentage(request.getMoistureContentPercentage() != null ? request.getMoistureContentPercentage() : 18.0)
                .extractionNotes(request.getNotes() != null ? request.getNotes() : "Apiary harvest logged")
                .build();
        harvestEventRepository.save(harvestEvent);

        // 3. Record on Blockchain (canonical hash + local Hardhat EVM / SHA-256 state Merkle root)
        BlockchainRecord blockchainRecord = blockchainService.recordBatchHarvestOnChain(batch);
        batch.setBlockchainTxHash(blockchainRecord.getTransactionHash());
        honeyBatchRepository.save(batch);

        // 4. Generate QR Code
        QrCodeEntity qrCode = qrCodeService.generateBatchQrCode(batch);

        // 5. Audit Log
        auditService.log(
                "BATCH_HARVEST_CREATED",
                "HONEY_BATCH",
                String.valueOf(batch.getId()),
                beekeeper.getUser().getUsername(),
                "Beekeeper " + beekeeper.getUser().getFullName() + " created batch " + batchNumber + " from Hive " + hive.getHiveCode()
        );

        return BatchResponse.builder()
                .id(batch.getId())
                .batchNumber(batch.getBatchNumber())
                .clusterCode(cluster != null ? cluster.getClusterCode() : "N/A")
                .clusterName(cluster != null ? cluster.getName() : "N/A")
                .floralSource(batch.getFloralSource())
                .harvestDate(batch.getHarvestDate())
                .totalQuantityKg(batch.getTotalQuantityKg())
                .status(batch.getStatus().name())
                .blockchainTxHash(blockchainRecord.getTransactionHash())
                .stateMerkleRoot(blockchainRecord.getStateMerkleRoot())
                .blockNumber(blockchainRecord.getBlockNumber())
                .qrCodeUrl(qrCode.getTargetVerificationUrl())
                .createdAt(batch.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<BatchResponse> getBatchesForBeekeeper(String username) {
        Beekeeper beekeeper = beekeeperRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Beekeeper not found: " + username));

        List<HarvestEvent> events = harvestEventRepository.findByBeekeeper(beekeeper);
        return events.stream()
                .map(HarvestEvent::getBatch)
                .distinct()
                .map(b -> {
                    QrCodeEntity qr = qrCodeService.getByBatch(b).orElse(null);
                    BlockchainRecord bc = blockchainService.getLatestRecord(b).orElse(null);
                    return BatchResponse.builder()
                            .id(b.getId())
                            .batchNumber(b.getBatchNumber())
                            .clusterCode(b.getCluster() != null ? b.getCluster().getClusterCode() : "N/A")
                            .clusterName(b.getCluster() != null ? b.getCluster().getName() : "N/A")
                            .floralSource(b.getFloralSource())
                            .harvestDate(b.getHarvestDate())
                            .totalQuantityKg(b.getTotalQuantityKg())
                            .status(b.getStatus().name())
                            .blockchainTxHash(b.getBlockchainTxHash())
                            .stateMerkleRoot(bc != null ? bc.getStateMerkleRoot() : null)
                            .blockNumber(bc != null ? bc.getBlockNumber() : null)
                            .qrCodeUrl(qr != null ? qr.getTargetVerificationUrl() : null)
                            .createdAt(b.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
