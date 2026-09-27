package com.beeproof.data;

import com.beeproof.domain.*;
import com.beeproof.domain.enums.BatchStatus;
import com.beeproof.domain.enums.HiveStatus;
import com.beeproof.domain.enums.UserRole;
import com.beeproof.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ClusterRepository clusterRepository;
    private final BeekeeperRepository beekeeperRepository;
    private final HiveRepository hiveRepository;
    private final HoneyBatchRepository batchRepository;
    private final HarvestEventRepository harvestEventRepository;
    private final QualityReportRepository qualityReportRepository;
    private final ProcessingEventRepository processingEventRepository;
    private final DistributionEventRepository distributionEventRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.beeproof.service.BlockchainService blockchainService;
    private final com.beeproof.service.QrCodeService qrCodeService;

    private final SensorRepository sensorRepository;
    private final SensorReadingRepository sensorReadingRepository;
    private final HiveAlertRepository hiveAlertRepository;

    public DataSeeder(RoleRepository roleRepository,
                      UserRepository userRepository,
                      ClusterRepository clusterRepository,
                      BeekeeperRepository beekeeperRepository,
                      HiveRepository hiveRepository,
                      HoneyBatchRepository batchRepository,
                      HarvestEventRepository harvestEventRepository,
                      QualityReportRepository qualityReportRepository,
                      ProcessingEventRepository processingEventRepository,
                      DistributionEventRepository distributionEventRepository,
                      AuditLogRepository auditLogRepository,
                      PasswordEncoder passwordEncoder,
                      com.beeproof.service.BlockchainService blockchainService,
                      com.beeproof.service.QrCodeService qrCodeService,
                      SensorRepository sensorRepository,
                      SensorReadingRepository sensorReadingRepository,
                      HiveAlertRepository hiveAlertRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.clusterRepository = clusterRepository;
        this.beekeeperRepository = beekeeperRepository;
        this.hiveRepository = hiveRepository;
        this.batchRepository = batchRepository;
        this.harvestEventRepository = harvestEventRepository;
        this.qualityReportRepository = qualityReportRepository;
        this.processingEventRepository = processingEventRepository;
        this.distributionEventRepository = distributionEventRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.blockchainService = blockchainService;
        this.qrCodeService = qrCodeService;
        this.sensorRepository = sensorRepository;
        this.sensorReadingRepository = sensorReadingRepository;
        this.hiveAlertRepository = hiveAlertRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() > 0 && userRepository.count() > 0) {
            logger.info("Database already seeded. Skipping initial seeding.");
            return;
        }

        logger.info("Initializing BeeProof Foundation Seed Data...");

        // 1. Seed Roles
        Map<UserRole, Role> roles = new HashMap<>();
        for (UserRole userRole : UserRole.values()) {
            Role role = roleRepository.save(
                    Role.builder()
                            .name(userRole)
                            .description("System role for " + userRole.name())
                            .build()
            );
            roles.put(userRole, role);
        }

        String encodedPassword = passwordEncoder.encode("BeeProof@2026!");

        // 2. Seed Admin / KVIC
        User adminUser = userRepository.save(
                User.builder()
                        .username("admin@beeproof.org")
                        .email("admin@beeproof.org")
                        .password(encodedPassword)
                        .fullName("Dr. Rameshwar Sharma (KVIC Director)")
                        .phoneNumber("+91 98110 02026")
                        .enabled(true)
                        .roles(Set.of(roles.get(UserRole.ADMIN_KVIC)))
                        .build()
        );

        // 3. Seed Processor
        User processorUser = userRepository.save(
                User.builder()
                        .username("processor@beeproof.org")
                        .email("processor@beeproof.org")
                        .password(encodedPassword)
                        .fullName("Vikram Sethi (Apex Processing)")
                        .phoneNumber("+91 98220 03031")
                        .enabled(true)
                        .roles(Set.of(roles.get(UserRole.PROCESSOR)))
                        .build()
        );

        // 4. Seed Quality Lab Technician
        User labUser = userRepository.save(
                User.builder()
                        .username("lab@beeproof.org")
                        .email("lab@beeproof.org")
                        .password(encodedPassword)
                        .fullName("Dr. Meera Nambiar (NABL Lead Chemist)")
                        .phoneNumber("+91 98330 04042")
                        .enabled(true)
                        .roles(Set.of(roles.get(UserRole.QUALITY_LAB)))
                        .build()
        );

        // 5. Seed Distributor
        User distributorUser = userRepository.save(
                User.builder()
                        .username("distributor@beeproof.org")
                        .email("distributor@beeproof.org")
                        .password(encodedPassword)
                        .fullName("Amit Deshmukh (EcoLogistics)")
                        .phoneNumber("+91 98440 05053")
                        .enabled(true)
                        .roles(Set.of(roles.get(UserRole.DISTRIBUTOR)))
                        .build()
        );

        // 6. Seed 3 Geographic Clusters
        Cluster clusterSundarbans = clusterRepository.save(
                Cluster.builder()
                        .clusterCode("SUN-MNG-01")
                        .name("Sundarbans Mangrove Reserve Cluster")
                        .region("Eastern Coastal Biosphere")
                        .state("West Bengal")
                        .district("South 24 Parganas")
                        .predominantFlora("Wild Mangrove (Khalisha & Goran)")
                        .latitude(21.9497)
                        .longitude(88.9007)
                        .description("Bio-diverse tidal wetland producing enzyme-rich amber mangrove honey.")
                        .build()
        );

        Cluster clusterNilgiri = clusterRepository.save(
                Cluster.builder()
                        .clusterCode("NIL-HGH-02")
                        .name("Nilgiri Highlands Mountain Cluster")
                        .region("Western Ghats Mountain Belt")
                        .state("Tamil Nadu")
                        .district("Nilgiris")
                        .predominantFlora("Mountain Wildflower & Eucalyptus")
                        .latitude(11.4102)
                        .longitude(76.6950)
                        .description("High altitude tribal beekeeping cooperative with endemic floral nectar.")
                        .build()
        );

        Cluster clusterKashmir = clusterRepository.save(
                Cluster.builder()
                        .clusterCode("KAS-VAL-03")
                        .name("Kashmir Valley Acacia Cluster")
                        .region("Himalayan Foothills")
                        .state("Jammu & Kashmir")
                        .district("Pulwama")
                        .predominantFlora("Robinia Pseudoacacia (White Acacia)")
                        .latitude(33.8744)
                        .longitude(74.8968)
                        .description("Alpine valley producing crystal clear acacia blossom mono-floral honey.")
                        .build()
        );

        // 7. Seed 5 Beekeepers
        String[][] beekeeperData = {
                {"beekeeper1@beeproof.org", "Rajesh Mandal", "+91 97110 11001", "KVIC-WB-2026-001", "Sundarbans Honey Self Help Group", "Gosaba", "South 24 Parganas", "West Bengal"},
                {"beekeeper2@beeproof.org", "Ananya Mondal", "+91 97110 11002", "KVIC-WB-2026-002", "Mangrove Apiary Cooperative", "Canning", "South 24 Parganas", "West Bengal"},
                {"beekeeper3@beeproof.org", "Sivakumar Raman", "+91 97110 11003", "KVIC-TN-2026-003", "Nilgiri Indigenous Apiary Trust", "Kotagiri", "Nilgiris", "Tamil Nadu"},
                {"beekeeper4@beeproof.org", "Priya Nair", "+91 97110 11004", "KVIC-TN-2026-004", "Western Ghats Organic Beekeepers", "Coonoor", "Nilgiris", "Tamil Nadu"},
                {"beekeeper5@beeproof.org", "Ghulam Ahmad Bhat", "+91 97110 11005", "KVIC-JK-2026-005", "Kashmir Valley Apiaries Union", "Tral", "Pulwama", "Jammu & Kashmir"}
        };

        Cluster[] assignedClusters = {
                clusterSundarbans,
                clusterSundarbans,
                clusterNilgiri,
                clusterNilgiri,
                clusterKashmir
        };

        Beekeeper[] beekeepers = new Beekeeper[5];

        for (int i = 0; i < beekeeperData.length; i++) {
            String[] data = beekeeperData[i];
            User beekeeperUser = userRepository.save(
                    User.builder()
                            .username(data[0])
                            .email(data[0])
                            .password(encodedPassword)
                            .fullName(data[1])
                            .phoneNumber(data[2])
                            .enabled(true)
                            .roles(Set.of(roles.get(UserRole.BEEKEEPER)))
                            .build()
            );

            beekeepers[i] = beekeeperRepository.save(
                    Beekeeper.builder()
                            .user(beekeeperUser)
                            .kvicRegistrationNumber(data[3])
                            .cooperativeName(data[4])
                            .address(data[5])
                            .district(data[6])
                            .state(data[7])
                            .assignedCluster(assignedClusters[i])
                            .build()
            );
        }

        // 8. Seed 15 Hives (5 per cluster)
        // Sundarbans (Hives 1 to 5)
        for (int h = 1; h <= 5; h++) {
            Beekeeper owner = (h <= 3) ? beekeepers[0] : beekeepers[1];
            hiveRepository.save(
                    Hive.builder()
                            .hiveCode(String.format("BP-SUN-H%02d", h))
                            .cluster(clusterSundarbans)
                            .beekeeper(owner)
                            .status(h == 5 ? HiveStatus.INSPECTION_REQUIRED : HiveStatus.ACTIVE)
                            .beeSpecies("Apis cerana indica")
                            .installationDate(LocalDate.now().minusMonths(6).plusWeeks(h))
                            .latitude(21.9497 + (h * 0.003))
                            .longitude(88.9007 + (h * 0.002))
                            .notes("Langstroth hive located on elevated tidal platform")
                            .build()
            );
        }

        // Nilgiris (Hives 6 to 10)
        for (int h = 1; h <= 5; h++) {
            Beekeeper owner = (h <= 3) ? beekeepers[2] : beekeepers[3];
            hiveRepository.save(
                    Hive.builder()
                            .hiveCode(String.format("BP-NIL-H%02d", h))
                            .cluster(clusterNilgiri)
                            .beekeeper(owner)
                            .status(HiveStatus.ACTIVE)
                            .beeSpecies("Apis mellifera")
                            .installationDate(LocalDate.now().minusMonths(8).plusWeeks(h))
                            .latitude(11.4102 + (h * 0.002))
                            .longitude(76.6950 + (h * 0.003))
                            .notes("Shaded mountain slope apiary with natural spring source")
                            .build()
            );
        }

        // Kashmir (Hives 11 to 15)
        for (int h = 1; h <= 5; h++) {
            hiveRepository.save(
                    Hive.builder()
                            .hiveCode(String.format("BP-KAS-H%02d", h))
                            .cluster(clusterKashmir)
                            .beekeeper(beekeepers[4])
                            .status(h == 4 ? HiveStatus.DORMANT : HiveStatus.ACTIVE)
                            .beeSpecies("Apis mellifera ligustica")
                            .installationDate(LocalDate.now().minusMonths(10).plusWeeks(h))
                            .latitude(33.8744 + (h * 0.002))
                            .longitude(74.8968 + (h * 0.004))
                            .notes("Valley floor acacia orchard orientation")
                            .build()
            );
        }

        // 8b. Seed Sensors and Telemetry for all 15 Hives
        var allHives = hiveRepository.findAll();
        for (Hive hive : allHives) {
            Sensor sensor = sensorRepository.save(
                    Sensor.builder()
                            .sensorIdentifier("SEN-" + hive.getHiveCode() + "-M01")
                            .hive(hive)
                            .sensorType(com.beeproof.domain.enums.SensorType.MULTISENSOR_CORE)
                            .firmwareVersion("v2.4-firmware")
                            .active(true)
                            .batteryPercentage(94)
                            .installedAt(LocalDateTime.now().minusMonths(3))
                            .build()
            );

            // Generate 12 historical hourly readings
            for (int hr = 12; hr >= 0; hr--) {
                LocalDateTime readingTime = LocalDateTime.now().minusHours(hr);
                double baseTemp = 34.2 + (Math.sin(hr) * 0.8);
                double baseHum = 58.0 + (Math.cos(hr) * 4.0);
                double baseWeight = 33.5 + (12 - hr) * 0.05; // Gradual honey accumulation
                double baseFreq = 225.0 + (Math.sin(hr) * 10.0);

                sensorReadingRepository.save(
                        SensorReading.builder()
                                .sensor(sensor)
                                .recordedAt(readingTime)
                                .temperatureCelsius(Math.round(baseTemp * 10.0) / 10.0)
                                .relativeHumidityPercent(Math.round(baseHum * 10.0) / 10.0)
                                .weightKilograms(Math.round(baseWeight * 10.0) / 10.0)
                                .acousticDominantFreqHz(Math.round(baseFreq * 10.0) / 10.0)
                                .acousticAmplitudeDb(46.0)
                                .rawDataPayload("{\"simulated\":true,\"source\":\"DATA_SEEDER\"}")
                                .build()
                );
            }
        }

        // Seed an initial abnormal alert for Hive 5 (BP-SUN-H05)
        Hive hive5 = hiveRepository.findByHiveCode("BP-SUN-H05").orElse(null);
        if (hive5 != null) {
            hiveAlertRepository.save(new HiveAlert(
                    hive5,
                    "TEMPERATURE",
                    38.6,
                    "32.0°C - 36.5°C",
                    "Hive internal temperature elevated (38.6°C). Possible overheating, solar exposure, or poor ventilation.",
                    "Ensure adequate hive shading and verify top ventilation screen. Note: Thermal stress indicator, not confirmed disease.",
                    HiveAlert.AlertStatus.UNREAD
            ));
        }

        // 9. Seed Demo Provenance Verified Honey Batch for Public Consumer Verification
        HoneyBatch demoBatch = batchRepository.save(
                HoneyBatch.builder()
                        .batchNumber("BP-2026-SUN-001")
                        .cluster(clusterSundarbans)
                        .floralSource("Wild Mangrove Khalisha & Goran")
                        .harvestDate(LocalDate.now().minusDays(14))
                        .totalQuantityKg(485.5)
                        .status(BatchStatus.CERTIFIED)
                        .rawPurityIndex("98.4%")
                        .blockchainTxHash("0x8f4d92a81b37ec89f1d072a39c0993efb87612c7714856ea45239a5c889f012b")
                        .build()
        );

        // Record initial harvest event for the demo batch
        Hive demoHive = hiveRepository.findByBeekeeper(beekeepers[0]).get(0);
        harvestEventRepository.save(
                HarvestEvent.builder()
                        .batch(demoBatch)
                        .hive(demoHive)
                        .beekeeper(beekeepers[0])
                        .quantityExtractedKg(485.5)
                        .harvestTimestamp(LocalDateTime.now().minusDays(14).withHour(8).withMinute(30))
                        .moistureContentPercentage(17.8)
                        .extractionNotes("Apiary harvest logged from Sundarbans mangrove preserve")
                        .build()
        );

        // Record on blockchain
        BlockchainRecord bcRecord = blockchainService.recordBatchHarvestOnChain(demoBatch);
        demoBatch.setBlockchainTxHash(bcRecord.getTransactionHash());
        batchRepository.save(demoBatch);

        // Generate QR code
        qrCodeService.generateBatchQrCode(demoBatch);

        // Quality Report for the demo batch
        qualityReportRepository.save(
                QualityReport.builder()
                        .batch(demoBatch)
                        .labTechnician(labUser)
                        .laboratoryName("National Agro-Food Quality Testing & NMR Centre")
                        .certificateNumber("BP-NABL-2026-00492")
                        .moisturePercentage(17.8)
                        .fructosePercentage(38.4)
                        .glucosePercentage(31.2)
                        .sucrosePercentage(1.4)
                        .hmfMgPerKg(12.5)
                        .pollenPurityScore(96.2)
                        .nmrSpectroscopyPassed(true)
                        .c4SugarAdulterationDetected(false)
                        .overallVerdict("PASSED")
                        .remarks("All physicochemical and NMR spectral markers confirm genuine raw wild mangrove blossom provenance.")
                        .certifiedAt(LocalDateTime.now().minusDays(8))
                        .build()
        );

        // Processing Event for demo batch
        processingEventRepository.save(
                ProcessingEvent.builder()
                        .batch(demoBatch)
                        .processor(processorUser)
                        .facilityName("Northern Apex Honey Processing Facility")
                        .operationType("COLD_FILTRATION")
                        .processedQuantityKg(485.5)
                        .finalMoisturePercent(17.8)
                        .processingTemperatureCelsius(37.5)
                        .processedAt(LocalDateTime.now().minusDays(10))
                        .notes("Micro-filtered under 38°C maintaining active raw pollen and invertase enzymes.")
                        .build()
        );

        // Distribution Event for demo batch
        distributionEventRepository.save(
                DistributionEvent.builder()
                        .batch(demoBatch)
                        .distributor(distributorUser)
                        .originLocation("Apex Processing Hub, Kolkata")
                        .destinationLocation("National Cold-Chain Distribution Depot, Delhi")
                        .status("DELIVERED_TO_RETAIL")
                        .ambientTemperatureCelsius(21.4)
                        .quantityDispatchedKg(485.5)
                        .eventTimestamp(LocalDateTime.now().minusDays(4))
                        .trackingReference("TRK-ECO-2026-8812")
                        .build()
        );

        // 10. Seed Initial Audit Log
        auditLogRepository.save(
                AuditLog.builder()
                        .action("SYSTEM_INITIALIZED")
                        .entityName("BeeProofPlatform")
                        .entityId("PHASE-1")
                        .performedBy("SYSTEM_SEEDER")
                        .details("Seeded 1 Admin, 5 Beekeepers, 3 Clusters, 15 Hives, and 1 Provenance Verified Honey Batch.")
                        .timestamp(LocalDateTime.now())
                        .build()
        );

        logger.info("BeeProof Foundation Seed Data initialized successfully!");
    }
}
