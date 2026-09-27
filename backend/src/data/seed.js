const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Cluster = require('../models/Cluster');
const Beekeeper = require('../models/Beekeeper');
const Hive = require('../models/Hive');
const SensorReading = require('../models/SensorReading');
const HiveAlert = require('../models/HiveAlert');
const HoneyBatch = require('../models/HoneyBatch');
const HarvestEvent = require('../models/HarvestEvent');
const ProcessingEvent = require('../models/ProcessingEvent');
const QualityReport = require('../models/QualityReport');
const PackageEntity = require('../models/PackageEntity');
const DistributionEvent = require('../models/DistributionEvent');
const BlockchainRecord = require('../models/BlockchainRecord');
const { getBlockchainInstance } = require('../config/blockchain');


async function seedDatabase() {
  console.log('🌱 Starting BeeProof database seeding...');

  // 1. Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Cluster.deleteMany({}),
    Beekeeper.deleteMany({}),
    Hive.deleteMany({}),
    SensorReading.deleteMany({}),
    HiveAlert.deleteMany({}),
    HoneyBatch.deleteMany({}),
    HarvestEvent.deleteMany({}),
    ProcessingEvent.deleteMany({}),
    QualityReport.deleteMany({}),
    PackageEntity.deleteMany({}),
    DistributionEvent.deleteMany({}),
    BlockchainRecord.deleteMany({})
  ]);

  const passwordHash = await bcrypt.hash('BeeProof@2026!', 10);

  // 2. Create Users
  const users = await User.insertMany([
    {
      username: 'admin@beeproof.org',
      email: 'admin@beeproof.org',
      passwordHash,
      fullName: 'Dr. Rameshwar Sharma',
      role: 'ADMIN_KVIC',
      organization: 'Khadi & Village Industries Commission (KVIC)',
      phone: '+91 98111 00223'
    },
    {
      username: 'beekeeper1@beeproof.org',
      email: 'beekeeper1@beeproof.org',
      passwordHash,
      fullName: 'Rajesh Mandal',
      role: 'BEEKEEPER',
      organization: 'Sundarbans Forest Honey Cooperative',
      phone: '+91 94332 11094'
    },
    {
      username: 'beekeeper2@beeproof.org',
      email: 'beekeeper2@beeproof.org',
      passwordHash,
      fullName: 'Ananya Das',
      role: 'BEEKEEPER',
      organization: 'Sundarbans Forest Honey Cooperative',
      phone: '+91 94332 11095'
    },
    {
      username: 'processor@beeproof.org',
      email: 'processor@beeproof.org',
      passwordHash,
      fullName: 'Vikram Sethi',
      role: 'PROCESSOR',
      organization: 'Northern Apex Honey Processing Facility',
      phone: '+91 97200 44882'
    },
    {
      username: 'lab@beeproof.org',
      email: 'lab@beeproof.org',
      passwordHash,
      fullName: 'Dr. Meera Nambiar',
      role: 'QUALITY_LAB',
      organization: 'National Agro-Food Quality & NMR Research Laboratory',
      phone: '+91 98840 77123'
    },
    {
      username: 'distributor@beeproof.org',
      email: 'distributor@beeproof.org',
      passwordHash,
      fullName: 'Amit Deshmukh',
      role: 'DISTRIBUTOR',
      organization: 'EcoLogistics Distribution Network Ltd.',
      phone: '+91 99300 66219'
    }
  ]);

  const [adminUser, beekeeper1User, beekeeper2User, processorUser, labUser, distributorUser] = users;

  // 3. Create Clusters
  const clusters = await Cluster.insertMany([
    {
      clusterCode: 'SUN-MNG-01',
      name: 'Sundarbans Mangrove Reserve Cluster',
      state: 'West Bengal',
      district: 'South 24 Parganas',
      region: 'Eastern',
      predominantFlora: 'Wild Mangrove Khalisha & Goran',
      latitude: 21.9497,
      longitude: 89.1833,
      totalHives: 10,
      annualProductionKg: 4200
    },
    {
      clusterCode: 'NIL-FRG-02',
      name: 'Nilgiri Biosphere Shola Cluster',
      state: 'Tamil Nadu',
      district: 'The Nilgiris',
      region: 'Southern',
      predominantFlora: 'Mountain Multifloral & Eucalyptus',
      latitude: 11.4916,
      longitude: 76.7337,
      totalHives: 8,
      annualProductionKg: 3100
    },
    {
      clusterCode: 'KSH-AC-03',
      name: 'Kashmir Valley Apiary Cluster',
      state: 'Jammu & Kashmir',
      district: 'Pulwama',
      region: 'Northern',
      predominantFlora: 'White Acacia Blossom & Saffron Flora',
      latitude: 33.8718,
      longitude: 74.8955,
      totalHives: 6,
      annualProductionKg: 2800
    }
  ]);

  const [sundarbansCluster, nilgiriCluster, kashmirCluster] = clusters;

  // 4. Create Beekeepers
  const beekeepers = await Beekeeper.insertMany([
    {
      user: beekeeper1User._id,
      cluster: sundarbansCluster._id,
      kvicRegistrationNumber: 'KVIC-WB-2026-0811',
      cooperativeName: 'Sundarbans Forest Honey Cooperative',
      experienceYears: 12,
      state: 'West Bengal',
      district: 'South 24 Parganas'
    },
    {
      user: beekeeper2User._id,
      cluster: sundarbansCluster._id,
      kvicRegistrationNumber: 'KVIC-WB-2026-0812',
      cooperativeName: 'Sundarbans Forest Honey Cooperative',
      experienceYears: 9,
      state: 'West Bengal',
      district: 'South 24 Parganas'
    }
  ]);

  const [bk1, bk2] = beekeepers;

  // 5. Create Hives & Telemetry
  const hiveDocs = [
    { hiveCode: 'SUN-HIVE-001', cluster: sundarbansCluster._id, beekeeper: bk1._id, beeSpecies: 'Apis dorsata', installationDate: '2024-02-10', latitude: 21.9482, longitude: 89.1821, status: 'ACTIVE', sensorId: 'SENS-SUN-001', hasSensor: true, notes: 'Vigorous Khalisha blossom forage' },
    { hiveCode: 'SUN-HIVE-002', cluster: sundarbansCluster._id, beekeeper: bk1._id, beeSpecies: 'Apis dorsata', installationDate: '2024-02-12', latitude: 21.9495, longitude: 89.1845, status: 'CRITICAL', sensorId: 'SENS-SUN-002', hasSensor: true, notes: 'Brood thermal spike detected' },
    { hiveCode: 'SUN-HIVE-003', cluster: sundarbansCluster._id, beekeeper: bk1._id, beeSpecies: 'Apis cerana', installationDate: '2024-03-01', latitude: 21.9510, longitude: 89.1802, status: 'ACTIVE', sensorId: 'SENS-SUN-003', hasSensor: true, notes: 'Healthy queen and comb' },
    { hiveCode: 'SUN-HIVE-004', cluster: sundarbansCluster._id, beekeeper: bk1._id, beeSpecies: 'Apis cerana', installationDate: '2024-03-05', latitude: 21.9460, longitude: 89.1850, status: 'ACTIVE', sensorId: 'SENS-SUN-004', hasSensor: true, notes: 'Steady weight gain' },
    { hiveCode: 'SUN-HIVE-005', cluster: sundarbansCluster._id, beekeeper: bk1._id, beeSpecies: 'Apis dorsata', installationDate: '2024-03-08', latitude: 21.9525, longitude: 89.1870, status: 'ACTIVE', sensorId: 'SENS-SUN-005', hasSensor: true, notes: 'High pollen storage' },
    { hiveCode: 'SUN-HIVE-006', cluster: sundarbansCluster._id, beekeeper: bk2._id, beeSpecies: 'Apis dorsata', installationDate: '2024-02-15', latitude: 21.9440, longitude: 89.1890, status: 'ACTIVE', sensorId: 'SENS-SUN-006', hasSensor: true, notes: 'Healthy colony' }
  ];

  const hives = await Hive.insertMany(hiveDocs);

  // 6. Create Sensor Readings
  const sensorReadings = [];
  for (const h of hives) {
    const isCritical = h.status === 'CRITICAL';
    const temp = isCritical ? 37.8 : 34.8;
    const hum = isCritical ? 73.2 : 58.0;

    sensorReadings.push(
      { hive: h._id, hiveCode: h.hiveCode, sensorIdentifier: `TEMP-${h.hiveCode}`, type: 'TEMPERATURE', value: temp, unit: '°C' },
      { hive: h._id, hiveCode: h.hiveCode, sensorIdentifier: `HUM-${h.hiveCode}`, type: 'HUMIDITY', value: hum, unit: '%' },
      { hive: h._id, hiveCode: h.hiveCode, sensorIdentifier: `SCALE-${h.hiveCode}`, type: 'SCALE_WEIGHT', value: 42.5, unit: 'kg' },
      { hive: h._id, hiveCode: h.hiveCode, sensorIdentifier: `MIC-${h.hiveCode}`, type: 'ACOUSTIC', value: isCritical ? 265.0 : 185.0, unit: 'Hz' }
    );
  }
  await SensorReading.insertMany(sensorReadings);

  // 7. Create Hive Alerts (Real data for notification bell!)
  await HiveAlert.insertMany([
    {
      hive: hives[1]._id, // SUN-HIVE-002
      hiveCode: hives[1].hiveCode,
      beekeeper: bk1._id,
      severity: 'CRITICAL',
      alertType: 'BROOD_HYPERTHERMIA_RISK',
      message: 'Internal temperature reached 37.8°C (safe ceiling 36.5°C). Immediate shaded ventilation recommended.',
      valueRecorded: 37.8,
      status: 'UNREAD'
    },
    {
      hive: hives[1]._id,
      hiveCode: hives[1].hiveCode,
      beekeeper: bk1._id,
      severity: 'HIGH',
      alertType: 'COLONY_SWARMING_RISK',
      message: 'Acoustic frequency elevated to 265 Hz indicating queen cell piping and prime swarm emergence.',
      valueRecorded: 265.0,
      status: 'UNREAD'
    }
  ]);

  // 8. Seed Genesis Honey Batch BP-2026-SUN-001 (Fully verified across the entire chain)
  const config = getBlockchainInstance() || {};
  const sampleTx = config.sampleTxHash || '5Jz84x9qYkP2vM7N3bW5cR8dL1eF4gH6jK9mN2pQ5rS8tV1uW4xY7zA0bC3dE6fG';

  const genesisBatch = new HoneyBatch({
    batchNumber: 'BP-2026-SUN-001',
    cluster: sundarbansCluster._id,
    clusterCode: 'SUN-MNG-01',
    clusterName: 'Sundarbans Mangrove Reserve Cluster',
    beekeeper: bk1._id,
    beekeeperName: 'Rajesh Mandal',
    hive: hives[0]._id,
    hiveCode: 'SUN-HIVE-001',
    floralSource: 'Wild Mangrove Khalisha & Goran',
    totalQuantityKg: 485.50,
    harvestDate: '2026-08-23',
    moisturePercentage: 17.8,
    status: 'DELIVERED',
    statusHistory: [
      { status: 'HARVESTED', timestamp: new Date('2026-08-23T08:30:00Z'), updatedBy: 'Rajesh Mandal', notes: 'Harvested from wild mangrove comb' },
      { status: 'COLLECTED', timestamp: new Date('2026-08-24T10:15:00Z'), updatedBy: 'Vikram Sethi', notes: 'Collected at Northern Apex intake hub' },
      { status: 'PROCESSING', timestamp: new Date('2026-08-24T14:30:00Z'), updatedBy: 'Vikram Sethi', notes: 'Cold micro-filtered at 38.5°C' },
      { status: 'QUALITY_VERIFIED', timestamp: new Date('2026-08-25T11:00:00Z'), updatedBy: 'Dr. Meera Nambiar', notes: 'NABL NMR & C4 sugar test passed' },
      { status: 'PACKAGED', timestamp: new Date('2026-08-26T09:45:00Z'), updatedBy: 'Vikram Sethi', notes: 'Packaged into 971 500g serialized jars' },
      { status: 'DISPATCHED', timestamp: new Date('2026-08-27T08:00:00Z'), updatedBy: 'Amit Deshmukh', notes: 'Consignment TRK-ECO-2026-8812 dispatched' },
      { status: 'DELIVERED', timestamp: new Date('2026-08-28T16:30:00Z'), updatedBy: 'Amit Deshmukh', notes: 'Handover complete at Delhi National Cold-Chain Depot' }
    ],
    blockchainTxHash: sampleTx,
    blockNumber: 1,
    isTampered: false,
    qrCodeUrl: 'http://localhost:5173/verify/BP-2026-SUN-001',
    notes: 'National flagship traceability pilot batch verified on EVM blockchain'
  });

  const qualityReportDoc = new QualityReport({
    batch: genesisBatch._id,
    batchNumber: 'BP-2026-SUN-001',
    chemist: labUser._id,
    chemistName: 'Dr. Meera Nambiar',
    labName: 'National Agro-Food Quality & NMR Research Laboratory',
    accreditationNumber: 'NABL-TC-8891-2026',
    certificateNumber: 'BP-NABL-2026-00492',
    moisturePercentage: 17.8,
    pollenPurityScore: 96.2,
    nmrSpectroscopyPassed: true,
    c4SugarAdulterationDetected: false,
    overallVerdict: 'PASS',
    qualityGrade: 'A+ Export Grade (Quality Verified)',
    notes: 'NMR spectral profile matches authentic Apis dorsata floral spectrum. Free of adulterants.',
    certifiedAt: new Date('2026-08-25T11:00:00Z'),
    blockchainTxHash: sampleTx
  });

  const blockchainService = require('../services/blockchainService');
  const genesisHash = await blockchainService.computeCanonicalHash(genesisBatch, qualityReportDoc);

  genesisBatch.onChainHash = genesisHash;
  await genesisBatch.save();
  await qualityReportDoc.save();

  // Seed Genesis Events
  await HarvestEvent.create({
    batch: genesisBatch._id,
    batchNumber: 'BP-2026-SUN-001',
    beekeeper: bk1._id,
    beekeeperName: 'Rajesh Mandal',
    quantityKg: 485.50,
    harvestTimestamp: new Date('2026-08-23T08:30:00Z'),
    location: 'Sundarbans Mangrove Reserve Cluster, West Bengal',
    floralSource: 'Wild Mangrove Khalisha & Goran',
    notes: 'Cold extracted comb honey harvested under KVIC cooperative governance'
  });

  await ProcessingEvent.create({
    batch: genesisBatch._id,
    batchNumber: 'BP-2026-SUN-001',
    processor: processorUser._id,
    processorName: 'Vikram Sethi',
    facilityName: 'Northern Apex Honey Processing Facility',
    facilityRegistration: 'FSSAI-PROC-2026-981',
    filtrationTemperatureCelsius: 38.5,
    filtrationMeshSizeMicrons: 200,
    processingDurationMinutes: 45,
    moistureContentAfterProcessing: 17.6,
    notes: 'Cold micro-filtered preserving native diastase enzymes',
    timestamp: new Date('2026-08-24T14:30:00Z'),
    blockchainTxHash: sampleTx
  });

  await PackageEntity.create({
    batch: genesisBatch._id,
    batchNumber: 'BP-2026-SUN-001',
    packageCode: 'PKG-BP-2026-SUN-001-001',
    unitSizeGrams: 500,
    lotNumber: 'LOT-SUN2026-01',
    packagingDate: new Date('2026-08-26T09:45:00Z'),
    packagedBy: 'Northern Apex Packaging Facility',
    qrCodeUrl: 'http://localhost:5173/verify/BP-2026-SUN-001'
  });

  await DistributionEvent.create({
    batch: genesisBatch._id,
    batchNumber: 'BP-2026-SUN-001',
    distributor: distributorUser._id,
    distributorName: 'Amit Deshmukh',
    logisticsPartner: 'EcoLogistics Distribution Network Ltd.',
    licenseNumber: 'DIST-KVIC-DL-2026',
    trackingReference: 'TRK-ECO-2026-8812',
    originLocation: 'Northern Apex Processing Hub, Kolkata',
    destinationLocation: 'National Cold-Chain Depot, Delhi',
    vehicleNumber: 'WB-04-TR-9182',
    transitAmbientTempCelsius: 21.4,
    quantityKg: 485.50,
    dispatchDate: new Date('2026-08-27T08:00:00Z'),
    deliveryDate: new Date('2026-08-28T16:30:00Z'),
    status: 'DELIVERED',
    deliverySignoff: 'Depot Manager Ramesh K.',
    notes: 'Cold-chain compliant transit unpasteurized honey handover complete',
    blockchainTxHash: sampleTx
  });

  // Seed Blockchain Records for Genesis Batch with 7-field canonical hash
  await BlockchainRecord.insertMany([
    {
      batch: genesisBatch._id,
      batchNumber: 'BP-2026-SUN-001',
      eventType: 'BATCH_REGISTERED',
      transactionHash: sampleTx,
      blockNumber: 1,
      stateMerkleRoot: genesisHash,
      network: 'Solana Devnet',
      gasUsed: 145020,
      actor: 'Rajesh Mandal (Beekeeper)',
      details: 'Registered batch BP-2026-SUN-001 on Solana Devnet (Batch ID + 7-Field SHA-256 Hash stored on-chain)',
      confirmedAt: new Date('2026-08-23T08:31:00Z')
    },
    {
      batch: genesisBatch._id,
      batchNumber: 'BP-2026-SUN-001',
      eventType: 'STAGE_PROCESSING',
      transactionHash: sampleTx,
      blockNumber: 2,
      stateMerkleRoot: genesisHash,
      network: 'Solana Devnet',
      gasUsed: 68100,
      actor: 'Northern Apex Honey Facility',
      details: 'Cold filtration logged',
      confirmedAt: new Date('2026-08-24T14:32:00Z')
    },
    {
      batch: genesisBatch._id,
      batchNumber: 'BP-2026-SUN-001',
      eventType: 'QUALITY_CERTIFIED',
      transactionHash: sampleTx,
      blockNumber: 3,
      stateMerkleRoot: genesisHash,
      network: 'Solana Devnet',
      gasUsed: 78900,
      actor: 'National Agro-Food Quality Lab',
      details: 'Certificate BP-NABL-2026-00492 recorded on-chain',
      confirmedAt: new Date('2026-08-25T11:02:00Z')
    },
    {
      batch: genesisBatch._id,
      batchNumber: 'BP-2026-SUN-001',
      eventType: 'STAGE_DELIVERED',
      transactionHash: sampleTx,
      blockNumber: 4,
      stateMerkleRoot: genesisHash,
      network: 'Solana Devnet',
      gasUsed: 54300,
      actor: 'EcoLogistics Cold-Chain',
      details: 'Depot delivery confirmed',
      confirmedAt: new Date('2026-08-28T16:32:00Z')
    }
  ]);

  console.log('✅ BeeProof database seeding completed successfully!');
}

module.exports = seedDatabase;

if (require.main === module) {
  const { connectDB, closeDB } = require('../config/db');
  connectDB().then(() => seedDatabase()).then(() => {
    console.log('Seed done.');
    process.exit(0);
  }).catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}
