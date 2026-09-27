const http = require('http');
const { app, startServer } = require('../src/server');

// Helper to make HTTP requests
function request(port, method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('==================================================');
  console.log('🧪 Starting BeeProof Automated Backend Test Suite');
  console.log('==================================================\n');

  const testPort = 8080;
  let server = null;
  try {
    const existing = await request(testPort, 'GET', '/api/health');
    if (existing.status === 200) {
      console.log('✅ Connected to running BeeProof server on port ' + testPort);
    } else {
      server = await startServer();
      const seedDatabase = require('../src/data/seed');
      await seedDatabase();
    }
  } catch (err) {
    server = await startServer();
    const seedDatabase = require('../src/data/seed');
    await seedDatabase();
  }

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    console.log('[Test 1] Health Endpoint');
    const health = await request(testPort, 'GET', '/api/health');
    assert(health.status === 200 && health.body.status === 'UP', 'API returns status UP');

    // 2. Public Verification Check
    console.log('\n[Test 2] Public Batch Verification (No Auth Required)');
    const genesisVerify = await request(testPort, 'GET', '/api/verify/batch/BP-2026-SUN-001');
    assert(genesisVerify.status === 200, 'Batch BP-2026-SUN-001 found');
    assert(genesisVerify.body.data.verificationStatus === 'VERIFIED', 'Genesis batch status is VERIFIED');
    assert(genesisVerify.body.data.blockchainVerified === true, 'Genesis batch blockchainVerified is true');
    assert(genesisVerify.body.data.timeline.length >= 4, 'Complete timeline contains 4+ genuine recorded stages');

    // 3. User Authentication for All Roles
    console.log('\n[Test 3] User Authentication & Role Token Generation');
    const roles = [
      { role: 'ADMIN_KVIC', email: 'admin@beeproof.org' },
      { role: 'BEEKEEPER', email: 'beekeeper1@beeproof.org' },
      { role: 'PROCESSOR', email: 'processor@beeproof.org' },
      { role: 'QUALITY_LAB', email: 'lab@beeproof.org' },
      { role: 'DISTRIBUTOR', email: 'distributor@beeproof.org' }
    ];

    const tokens = {};
    for (const r of roles) {
      const loginRes = await request(testPort, 'POST', '/api/auth/login', {
        username: r.email,
        password: 'BeeProof@2026!'
      });
      assert(loginRes.status === 200 && loginRes.body.data.token, `Logged in successfully as ${r.role}`);
      tokens[r.role] = loginRes.body.data.token;
    }

    // 4. Role Authorization Guards (RBAC)
    console.log('\n[Test 4] Role-Based Access Control (RBAC) Enforcement');
    // Processor attempting to verify quality (forbidden)
    const procTryVerify = await request(testPort, 'POST', '/api/quality-lab/batches/BP-2026-SUN-001/verify', {
      moisturePercentage: 18.0
    }, tokens['PROCESSOR']);
    assert(procTryVerify.status === 403, 'Processor is blocked from verifying quality (403 Forbidden)');

    // Quality Lab attempting to dispatch batch (forbidden)
    const labTryDispatch = await request(testPort, 'POST', '/api/distributor/batches/BP-2026-SUN-001/dispatch', {
      trackingReference: 'TRK-INVALID'
    }, tokens['QUALITY_LAB']);
    assert(labTryDispatch.status === 403, 'Quality Lab is blocked from dispatching batch (403 Forbidden)');

    // Distributor attempting to process honey (forbidden)
    const distTryProcess = await request(testPort, 'POST', '/api/processor/batches/BP-2026-SUN-001/process', {
      filtrationTemperatureCelsius: 38.0
    }, tokens['DISTRIBUTOR']);
    assert(distTryProcess.status === 403, 'Distributor is blocked from processing honey (403 Forbidden)');

    // 5. End-to-End Supply Chain State Transition Flow
    console.log('\n[Test 5] Complete Supply Chain Lifecycle & State Machine Transitions');
    // Step A: Beekeeper logs harvest & creates new batch
    const createBatchRes = await request(testPort, 'POST', '/api/beekeeper/batches', {
      quantityKg: 50.0,
      floralSource: 'Wild Mangrove Khalisha',
      harvestDate: '2026-09-06',
      notes: 'Freshly extracted raw comb honey'
    }, tokens['BEEKEEPER']);
    assert(createBatchRes.status === 201, 'Beekeeper created new batch successfully');
    const newBatch = createBatchRes.body.data;
    const testBatchNumber = newBatch.batchNumber;
    assert(newBatch.status === 'HARVESTED', `New batch status is HARVESTED (${testBatchNumber})`);
    assert(newBatch.blockchainTxHash, 'Batch recorded with real transaction hash');

    // Step B: Invalid state transition jump (HARVESTED -> DELIVERED rejected)
    const invalidJumpRes = await request(testPort, 'POST', `/api/distributor/batches/${testBatchNumber}/deliver`, {
      deliverySignoff: 'Invalid'
    }, tokens['DISTRIBUTOR']);
    assert(invalidJumpRes.status === 400 || invalidJumpRes.status === 500, 'Invalid jump HARVESTED → DELIVERED is rejected');

    // Step C: Invalid state transition jump (HARVESTED -> PACKAGED rejected before lab quality verification)
    const prematurePackaging = await request(testPort, 'POST', `/api/processor/batches/${testBatchNumber}/package`, {
      unitSizeGrams: 500
    }, tokens['PROCESSOR']);
    assert(prematurePackaging.status === 400 || prematurePackaging.status === 500, 'Packaging blocked before quality certification');

    // Step D: Processor receives batch: HARVESTED -> COLLECTED
    const collectRes = await request(testPort, 'POST', `/api/processor/batches/${testBatchNumber}/collect`, {}, tokens['PROCESSOR']);
    assert(collectRes.status === 200 && collectRes.body.data.status === 'COLLECTED', 'Batch transitioned to COLLECTED');

    // Step E: Processor starts cold filtration: COLLECTED -> PROCESSING
    const processRes = await request(testPort, 'POST', `/api/processor/batches/${testBatchNumber}/process`, {
      filtrationTemperatureCelsius: 38.5,
      filtrationMeshSizeMicrons: 200,
      notes: 'Standard unpasteurized cold filtration below 40C'
    }, tokens['PROCESSOR']);
    assert(processRes.status === 200, 'Cold filtration logged. Batch transitioned to PROCESSING');

    // Step F: Quality Lab runs NABL tests: PROCESSING -> QUALITY_VERIFIED
    const labVerifyRes = await request(testPort, 'POST', `/api/quality-lab/batches/${testBatchNumber}/verify`, {
      moisturePercentage: 17.5,
      pollenPurityScore: 97.1,
      nmrSpectroscopyPassed: true,
      c4SugarAdulterationDetected: false
    }, tokens['QUALITY_LAB']);
    assert(labVerifyRes.status === 200 && labVerifyRes.body.data.overallVerdict === 'PASS', 'Lab assay passed. Batch transitioned to QUALITY_VERIFIED');

    // Step G: Processor packages batch: QUALITY_VERIFIED -> PACKAGED
    const packageRes = await request(testPort, 'POST', `/api/processor/batches/${testBatchNumber}/package`, {
      unitSizeGrams: 500
    }, tokens['PROCESSOR']);
    assert(packageRes.status === 200, 'Batch successfully packaged into serialized jars (status PACKAGED)');

    // Step H: Distributor dispatches consignment: PACKAGED -> DISPATCHED
    const dispatchRes = await request(testPort, 'POST', `/api/distributor/batches/${testBatchNumber}/dispatch`, {
      originLocation: 'Kolkata Facility',
      destinationLocation: 'Delhi Cold Depot',
      transitAmbientTempCelsius: 21.0
    }, tokens['DISTRIBUTOR']);
    assert(dispatchRes.status === 200 && dispatchRes.body.data.status === 'DISPATCHED', 'Batch dispatched under active temperature tracking');

    // Step I: Distributor confirms delivery: DISPATCHED -> DELIVERED
    const deliverRes = await request(testPort, 'POST', `/api/distributor/batches/${testBatchNumber}/deliver`, {
      deliverySignoff: 'Depot Manager Electronic Signature'
    }, tokens['DISTRIBUTOR']);
    assert(deliverRes.status === 200 && deliverRes.body.data.status === 'DELIVERED', 'Consignment handover confirmed (status DELIVERED)');

    // 6. Cryptographic Tamper Detection & Integrity Verification
    console.log('\n[Test 6] Cryptographic Tamper Detection & Hold State Verification');
    // First, verify the batch is intact
    const preTamperVerify = await request(testPort, 'GET', `/api/verify/batch/${testBatchNumber}`);
    assert(preTamperVerify.body.data.verificationStatus === 'VERIFIED', 'Pre-tamper verification status is VERIFIED');
    assert(preTamperVerify.body.data.blockchainVerified === true, 'Pre-tamper cryptographic check passes');

    // Simulate intentional out-of-band tampering in database
    const tamperRes = await request(testPort, 'POST', `/api/admin/batches/${testBatchNumber}/tamper`, {}, tokens['ADMIN_KVIC']);
    assert(tamperRes.status === 200, 'Batch data intentionally tampered in database');

    // Now query public verification endpoint
    const postTamperVerify = await request(testPort, 'GET', `/api/verify/batch/${testBatchNumber}`);
    assert(postTamperVerify.body.data.verificationStatus === 'NOT VERIFIED', 'Post-tamper status is NOT VERIFIED');
    assert(postTamperVerify.body.data.blockchainVerified === false, 'Cryptographic record check detected mismatch');
    assert(postTamperVerify.body.data.status === 'ON_HOLD', 'Batch automatically placed ON_HOLD');

    // Restore original authentic data
    const restoreRes = await request(testPort, 'POST', `/api/admin/batches/${testBatchNumber}/restore`, {}, tokens['ADMIN_KVIC']);
    assert(restoreRes.status === 200, 'Authentic batch data restored in database');

    const restoredVerify = await request(testPort, 'GET', `/api/verify/batch/${testBatchNumber}`);
    assert(restoredVerify.body.data.verificationStatus === 'VERIFIED', 'Restored batch verification status is VERIFIED again');
    assert(restoredVerify.body.data.blockchainVerified === true, 'Restored batch cryptographic check passes');

    // 7. IoT Hive Monitoring & Anomaly Triggers
    console.log('\n[Test 7] Biological IoT Telemetry & Anomaly Triggering');
    const beekeeperDash = await request(testPort, 'GET', '/api/beekeeper/dashboard', null, tokens['BEEKEEPER']);
    const testHive = beekeeperDash.body.data.hives[0];
    assert(testHive, 'Found assigned beekeeper hive');

    // Simulate temperature anomaly trigger (>36.5°C)
    const simRes = await request(testPort, 'POST', `/api/iot/hives/${testHive._id}/simulate?scenario=OVERHEAT`);
    assert(simRes.status === 200 && simRes.body.data.latestMetrics.temperature > 36.5, 'Overheat condition simulated');

    // Check alerts in notification bell
    const alertsRes = await request(testPort, 'GET', '/api/beekeeper/alerts', null, tokens['BEEKEEPER']);
    assert(alertsRes.body.data.length > 0, 'Notification bell contains real biological alert data');

  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  } finally {
    if (server) server.close();
    console.log('\n==================================================');
    console.log(`Test Results: ${passed} PASSED, ${failed} FAILED`);
    console.log('==================================================');
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
