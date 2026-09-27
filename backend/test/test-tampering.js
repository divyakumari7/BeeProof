const mongoose = require('mongoose');
const { connectDB, closeDB } = require('../src/config/db');
const HoneyBatch = require('../src/models/HoneyBatch');
const QualityReport = require('../src/models/QualityReport');
const blockchainService = require('../src/services/blockchainService');

async function runTamperingTests() {
  console.log('🧪 Starting 8 Critical Hashing Integrity Tests for BP-2026-SUN-001...\n');
  await connectDB();

  const batchNumber = 'BP-2026-SUN-001';
  const batch = await HoneyBatch.findOne({ batchNumber });
  const qualityReport = await QualityReport.findOne({ batch: batch._id });

  if (!batch || !qualityReport) {
    console.error('❌ Batch or QualityReport not found. Ensure seeding is completed.');
    process.exit(1);
  }

  // Backup original values
  const origQty = batch.totalQuantityKg;
  const origMoisture = qualityReport.moisturePercentage;
  const origCert = qualityReport.certificateNumber;
  const origPurity = qualityReport.pollenPurityScore;
  const origNmr = qualityReport.nmrSpectroscopyPassed;
  const origC4 = qualityReport.c4SugarAdulterationDetected;

  let passedCount = 0;

  // TEST 1: Original MongoDB values
  console.log('--- TEST 1: Original MongoDB values ---');
  let result = await blockchainService.verifyIntegrity(batch);
  console.log(`Computed Hash: ${result.computedHash}`);
  console.log(`On-Chain Hash: ${result.onChainHash}`);
  console.log(`Result: ${result.verified ? '✅ VERIFIED' : '❌ FAILED'}`);
  if (result.verified) passedCount++;

  // TEST 2: Change ONLY Quantity
  console.log('\n--- TEST 2: Change ONLY Quantity (485.50kg -> 999.00kg) ---');
  batch.totalQuantityKg = 999.00;
  await batch.save();
  result = await blockchainService.verifyIntegrity(batch);
  console.log(`Computed Hash: ${result.computedHash}`);
  console.log(`Result: ${!result.verified ? '✅ MISMATCH DETECTED (NOT VERIFIED)' : '❌ FAILED (Should have detected mismatch)'}`);
  if (!result.verified) passedCount++;

  // TEST 3: Restore Quantity
  console.log('\n--- TEST 3: Restore Quantity (999.00kg -> 485.50kg) ---');
  batch.totalQuantityKg = origQty;
  await batch.save();
  result = await blockchainService.verifyIntegrity(batch);
  console.log(`Computed Hash: ${result.computedHash}`);
  console.log(`Result: ${result.verified ? '✅ VERIFIED AGAIN' : '❌ FAILED'}`);
  if (result.verified) passedCount++;

  // TEST 4: Change ONLY Moisture %
  console.log('\n--- TEST 4: Change ONLY Moisture % (17.8% -> 25.0%) ---');
  qualityReport.moisturePercentage = 25.0;
  await qualityReport.save();
  result = await blockchainService.verifyIntegrity(batch);
  console.log(`Computed Hash: ${result.computedHash}`);
  console.log(`Result: ${!result.verified ? '✅ MISMATCH DETECTED (NOT VERIFIED)' : '❌ FAILED'}`);
  if (!result.verified) passedCount++;
  qualityReport.moisturePercentage = origMoisture;
  await qualityReport.save();

  // TEST 5: Change ONLY Certification Number
  console.log('\n--- TEST 5: Change ONLY Certification Number (BP-NABL-2026-00492 -> FAKE-CERT-999) ---');
  qualityReport.certificateNumber = 'FAKE-CERT-999';
  await qualityReport.save();
  result = await blockchainService.verifyIntegrity(batch);
  console.log(`Computed Hash: ${result.computedHash}`);
  console.log(`Result: ${!result.verified ? '✅ MISMATCH DETECTED (NOT VERIFIED)' : '❌ FAILED'}`);
  if (!result.verified) passedCount++;
  qualityReport.certificateNumber = origCert;
  await qualityReport.save();

  // TEST 6: Change ONLY Purity Score
  console.log('\n--- TEST 6: Change ONLY Purity Score (96.2% -> 50.0%) ---');
  qualityReport.pollenPurityScore = 50.0;
  await qualityReport.save();
  result = await blockchainService.verifyIntegrity(batch);
  console.log(`Computed Hash: ${result.computedHash}`);
  console.log(`Result: ${!result.verified ? '✅ MISMATCH DETECTED (NOT VERIFIED)' : '❌ FAILED'}`);
  if (!result.verified) passedCount++;
  qualityReport.pollenPurityScore = origPurity;
  await qualityReport.save();

  // TEST 7: Change ONLY Lab Test Data (NMR Result)
  console.log('\n--- TEST 7: Change ONLY Lab Test Data (NMR PASS -> NMR FAIL) ---');
  qualityReport.nmrSpectroscopyPassed = false;
  await qualityReport.save();
  result = await blockchainService.verifyIntegrity(batch);
  console.log(`Computed Hash: ${result.computedHash}`);
  console.log(`Result: ${!result.verified ? '✅ MISMATCH DETECTED (NOT VERIFIED)' : '❌ FAILED'}`);
  if (!result.verified) passedCount++;
  qualityReport.nmrSpectroscopyPassed = origNmr;
  await qualityReport.save();

  // TEST 8: Change ONLY C4 Sugar Result
  console.log('\n--- TEST 8: Change ONLY C4 Sugar Result (C4 CLEAN -> C4 DETECTED) ---');
  qualityReport.c4SugarAdulterationDetected = true;
  await qualityReport.save();
  result = await blockchainService.verifyIntegrity(batch);
  console.log(`Computed Hash: ${result.computedHash}`);
  console.log(`Result: ${!result.verified ? '✅ MISMATCH DETECTED (NOT VERIFIED)' : '❌ FAILED'}`);
  if (!result.verified) passedCount++;
  qualityReport.c4SugarAdulterationDetected = origC4;
  await qualityReport.save();

  console.log(`\n==================================================`);
  console.log(`🏆 TEST RESULT: ${passedCount}/8 TESTS PASSED SUCCESSFULLY!`);
  console.log(`==================================================`);

  await closeDB();
  process.exit(passedCount === 8 ? 0 : 1);
}

runTamperingTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
