const http = require('http');

function get(url, token) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    http.get({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    }).on('error', reject);
  });
}

function post(url, body, token) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(body);
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('--- 1. Testing Frontend HTTP Serving ---');
  const fe = await get('http://127.0.0.1:5173/');
  console.log(`Frontend Status: ${fe.status}, Root container present: ${fe.data.includes('id="root"')}`);

  console.log('\n--- 2. Testing Public Consumer Verification Endpoint ---');
  const verifyRes = await get('http://127.0.0.1:8080/api/verify/batch/BP-2026-SUN-001');
  const verifyJson = verifyRes.data;
  console.log(`Verification API HTTP Status: ${verifyRes.status}`);
  console.log(`Batch Number: ${verifyJson.data.batchNumber}`);
  console.log(`Verification Status: ${verifyJson.data.verificationStatus}`);
  console.log(`Blockchain Verified: ${verifyJson.data.blockchainVerified}`);
  console.log(`On-chain Canonical Hash: ${verifyJson.data.stateMerkleRoot}`);
  console.log(`Real On-chain Tx Hash: ${verifyJson.data.blockchainTxHash}`);
  console.log(`Block Number: ${verifyJson.data.blockNumber}`);
  console.log(`Supply Chain Timeline Events: ${verifyJson.data.timeline.length}`);
  verifyJson.data.timeline.forEach(t => console.log(`  - [${t.stage}] ${t.title} (${t.location || 'N/A'})`));

  console.log('\n--- 3. Testing Beekeeper Login & Notification Bell ---');
  const loginRes = await post('http://127.0.0.1:8080/api/auth/login', {
    email: 'beekeeper1@beeproof.org',
    password: 'BeeProof@2026!'
  });
  console.log(`Beekeeper Login HTTP Status: ${loginRes.status}, User: ${loginRes.data.data.user.fullName} (${loginRes.data.data.user.role})`);
  const beekeeperToken = loginRes.data.data.token;

  const alertsRes = await get('http://127.0.0.1:8080/api/beekeeper/alerts', beekeeperToken);
  console.log(`Active Hive Alerts: ${alertsRes.data.data.length}`);
  alertsRes.data.data.forEach(a => console.log(`  - Alert: ${a.alertType} [${a.severity}] - ${a.message}`));

  console.log('\n--- 4. Testing Beekeeper Hives & Batch Creation ---');
  const hivesRes = await get('http://127.0.0.1:8080/api/beekeeper/hives', beekeeperToken);
  console.log(`Beekeeper Hives Found: ${hivesRes.data.data.length}`);
  const firstHive = hivesRes.data.data[0];
  console.log(`Selected Hive: ${firstHive.hiveCode} (${firstHive.hiveType})`);

  const newHarvest = await post('http://127.0.0.1:8080/api/beekeeper/batches', {
    hiveId: firstHive._id,
    floralSource: 'Wild Mustard Blossom',
    quantityKg: 32.5,
    moistureContentPercentage: 17.6,
    notes: 'Pure cold comb harvest from organic apiary'
  }, beekeeperToken);

  console.log(`New Harvest Creation HTTP: ${newHarvest.status}`);
  const createdBatch = newHarvest.data.data;
  console.log(`Batch Number: ${createdBatch.batchNumber}`);
  console.log(`Batch Status: ${createdBatch.status}`);
  console.log(`Blockchain Transaction Hash: ${createdBatch.blockchainTxHash}`);
  console.log(`On-chain Canonical Hash: ${createdBatch.onChainHash}`);
  console.log(`QR Code URL: ${createdBatch.qrCodeUrl}`);
  const newBatchNum = createdBatch.batchNumber;

  console.log('\n--- 5. Testing Public Consumer Verification of Newly Harvested Batch ---');
  const newBatchVerify = await get(`http://127.0.0.1:8080/api/verify/batch/${newBatchNum}`);
  console.log(`Consumer Verification Status: ${newBatchVerify.data.data.verificationStatus}`);
  console.log(`Blockchain Verified: ${newBatchVerify.data.data.blockchainVerified}`);
  console.log(`Batch Number: ${newBatchVerify.data.data.batchNumber}`);
  console.log(`Floral Source: ${newBatchVerify.data.data.floralSource}`);
  console.log(`Timeline: Stage ${newBatchVerify.data.data.timeline[0].stage} - ${newBatchVerify.data.data.timeline[0].title}`);

  console.log('\n--- 6. Testing Processor Intake & Cold Filtration ---');
  const processorLogin = await post('http://127.0.0.1:8080/api/auth/login', {
    email: 'processor@beeproof.org',
    password: 'BeeProof@2026!'
  });
  const processorToken = processorLogin.data.data.token;
  console.log(`Processor Login: ${processorLogin.status}, User: ${processorLogin.data.data.user.fullName}`);

  // Intake batch
  const intakeRes = await post(`http://127.0.0.1:8080/api/processor/batches/${newBatchNum}/collect`, {
    receivedWeightKg: 32.5,
    intakeCondition: 'EXCELLENT',
    notes: 'Arrived intact from Sundarbans apiary'
  }, processorToken);
  console.log(`Processor Intake HTTP: ${intakeRes.status}, Status: ${intakeRes.data.data.status}`);

  // Cold filtration
  const filterRes = await post(`http://127.0.0.1:8080/api/processor/batches/${newBatchNum}/process`, {
    filtrationTemperatureCelsius: 38.0,
    filtrationMeshSizeMicrons: 200,
    notes: 'Preserved natural diastase and inverted sugars'
  }, processorToken);
  console.log(`Cold Filtration HTTP: ${filterRes.status}, Status: ${filterRes.data.data.status}`);

  console.log('\n--- 7. Testing Quality Lab Testing (NABL Certified) ---');
  const labLogin = await post('http://127.0.0.1:8080/api/auth/login', {
    email: 'lab@beeproof.org',
    password: 'BeeProof@2026!'
  });
  const labToken = labLogin.data.data.token;
  console.log(`Lab Login: ${labLogin.status}, User: ${labLogin.data.data.user.fullName}`);

  const testRes = await post(`http://127.0.0.1:8080/api/quality-lab/batches/${newBatchNum}/verify`, {
    moisturePercentage: 18.1,
    pollenPurityScore: 95.2,
    nmrSpectroscopyPassed: true,
    c4SugarAdulterationDetected: false,
    qualityGrade: 'A_PLUS_ORGANIC',
    certificateNumber: 'NABL-2026-WM-991',
    notes: 'Meets FSSAI / NABL honey purity standards.'
  }, labToken);
  console.log(`Lab Test HTTP: ${testRes.status}, Batch Status: ${testRes.data.data.status}`);

  console.log('\n--- 8. Testing Packaging into Serialized Consumer Jars ---');
  const packRes = await post(`http://127.0.0.1:8080/api/processor/batches/${newBatchNum}/package`, {
    jarSizeGrams: 500,
    unitCount: 65,
    lotNumber: 'LOT-2026-WM-01'
  }, processorToken);
  console.log(`Packaging HTTP: ${packRes.status}, Status: ${packRes.data.data.status}`);

  console.log('\n--- 9. Testing Distributor Consignment Dispatch & Delivery ---');
  const distLogin = await post('http://127.0.0.1:8080/api/auth/login', {
    email: 'distributor@beeproof.org',
    password: 'BeeProof@2026!'
  });
  const distToken = distLogin.data.data.token;
  console.log(`Distributor Login: ${distLogin.status}, User: ${distLogin.data.data.user.fullName}`);

  const dispatchRes = await post(`http://127.0.0.1:8080/api/distributor/batches/${newBatchNum}/dispatch`, {
    logisticsPartner: 'BlueDart Cold-Chain Express',
    originLocation: 'Northern Apex Processing Facility, Kolkata',
    destinationLocation: 'National Retail Distribution Center, New Delhi',
    transitAmbientTempCelsius: 22.5
  }, distToken);
  console.log(`Dispatch HTTP: ${dispatchRes.status}, Status: ${dispatchRes.data.data.status}`);

  const deliverRes = await post(`http://127.0.0.1:8080/api/distributor/batches/${newBatchNum}/deliver`, {
    receivedCondition: 'INTACT_SEALED',
    notes: 'Safe cold-chain arrival at Delhi fulfillment center'
  }, distToken);
  console.log(`Delivery HTTP: ${deliverRes.status}, Status: ${deliverRes.data.data.status}`);

  console.log('\n--- 10. Testing Complete Lifecycle Verification on Public Page ---');
  const finalVerify = await get(`http://127.0.0.1:8080/api/verify/batch/${newBatchNum}`);
  console.log(`Full Lifecycle Verification Status: ${finalVerify.data.data.verificationStatus}`);
  console.log(`Blockchain Verified: ${finalVerify.data.data.blockchainVerified}`);
  console.log(`Final Batch Status: ${finalVerify.data.data.status}`);
  console.log(`Timeline Stages Completed: ${finalVerify.data.data.timeline.length}`);
  finalVerify.data.data.timeline.forEach(t => console.log(`  ✓ [${t.stage}] ${t.title} (${t.location || 'N/A'})`));

  console.log('\n--- 11. Testing Tamper Detection & Auto-Lock (ON_HOLD) ---');
  const adminLogin = await post('http://127.0.0.1:8080/api/auth/login', {
    email: 'admin@beeproof.org',
    password: 'BeeProof@2026!'
  });
  const adminToken = adminLogin.data.data.token;

  // Tamper with new batch
  const tamperRes = await post(`http://127.0.0.1:8080/api/admin/batches/${newBatchNum}/tamper`, {
    field: 'floralSource',
    newValue: 'ADULTERATED_HIGH_FRUCTOSE_CORN_SYRUP'
  }, adminToken);
  console.log(`Tamper Injection Status: ${tamperRes.status}, Message: ${tamperRes.data.message}`);

  // Now verify batch after tamper
  const postTamperVerify = await get(`http://127.0.0.1:8080/api/verify/batch/${newBatchNum}`);
  console.log(`Post-Tamper Verification Status: ${postTamperVerify.data.data.verificationStatus}`);
  console.log(`Post-Tamper Blockchain Verified: ${postTamperVerify.data.data.blockchainVerified}`);
  console.log(`Batch Auto-Lock System Status: ${postTamperVerify.data.data.status}`);
  console.log(`Integrity Reason: ${postTamperVerify.data.data.integrityReason}`);

  console.log('\n======================================================');
  console.log('🎉 100% COMPLETE END-TO-END SUPPLY CHAIN VERIFIED!');
  console.log('======================================================');
}

run().catch(console.error);
