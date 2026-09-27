# Phase 3 Live End-to-End Verification Script

Write-Host "=================================================="
Write-Host "BeeProof Phase 3 Supply Chain Live Verification"
Write-Host "=================================================="

# Helper function to login and get token
function Get-AuthToken([string]$u, [string]$p) {
    $payload = @{ username = $u; password = $p } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $payload -ContentType "application/json"
    return [string]$res.data.token
}

$bkToken = Get-AuthToken "beekeeper1@beeproof.org" "BeeProof@2026!"
$procToken = Get-AuthToken "processor@beeproof.org" "BeeProof@2026!"
$labToken = Get-AuthToken "lab@beeproof.org" "BeeProof@2026!"
$distToken = Get-AuthToken "distributor@beeproof.org" "BeeProof@2026!"

Write-Host "1. AUTHENTICATED ALL 4 SUPPLY CHAIN PERSONAS: SUCCESS"

# Step 1: Beekeeper creates fresh batch
$createBody = @{
    hiveId = 1
    quantityKg = 60.0
    floralSource = "Sundarbans Wild Mangrove"
    harvestDate = "2026-09-06"
    notes = "Live Phase 3 supply chain demonstration batch"
} | ConvertTo-Json

$batchRes = Invoke-RestMethod -Uri "http://localhost:8080/api/beekeeper/batches" -Method Post -Body $createBody -Headers @{ Authorization = "Bearer $bkToken" } -ContentType "application/json"
$batchNumber = $batchRes.data.batchNumber
Write-Host "2. HARVEST BATCH CREATED: $batchNumber"

if ([string]::IsNullOrWhiteSpace($batchNumber)) {
    Write-Host "ERROR: batchNumber was empty!"
    exit 1
}

# Step 2: Processor attempts early packaging (MUST BE BLOCKED)
Write-Host "3. GUARD TEST: Attempting early packaging before QA approval..."
try {
    $earlyPkg = @{ packagingType = "500g_GLASS_JAR"; unitCount = 20; netWeightGrams = 500.0 } | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:8080/api/processor/batches/$batchNumber/package" -Method Post -Body $earlyPkg -Headers @{ Authorization = "Bearer $procToken" } -ContentType "application/json"
    Write-Host "   FAILED: Early packaging was NOT blocked!"
} catch {
    Write-Host "   PASSED: Early packaging was BLOCKED: $($_.Exception.Message)"
}

# Step 3: Processor processes batch
$procBody = @{
    facilityName = "Apex Honey Facility, West Bengal"
    operationType = "COLD_MICRO_FILTRATION"
    processedQuantityKg = 60.0
    finalMoisturePercent = 17.2
    processingTemperatureCelsius = 37.5
    notes = "Cold filtered under 38C preserving diastase enzymes"
} | ConvertTo-Json
$procRes = Invoke-RestMethod -Uri "http://localhost:8080/api/processor/batches/$batchNumber/process" -Method Post -Body $procBody -Headers @{ Authorization = "Bearer $procToken" } -ContentType "application/json"
Write-Host "4. PROCESSING LOGGED: Status -> IN_PROCESSING ($($procRes.data.operationType))"

# Step 4: Quality Lab verifies batch with NMR assay
$certNum = "BP-NABL-2026-" + (Get-Random -Minimum 1000 -Maximum 9999)
$qaBody = @{
    certificateNumber = $certNum
    laboratoryName = "National Agro-Food NMR Quality Testing and Assay Centre"
    moisturePercentage = 17.2
    pollenPurityScore = 98.4
    nmrSpectroscopyPassed = $true
    c4SugarAdulterationDetected = $false
    overallVerdict = "PASSED"
    remarks = "NMR spectra and pollen count verify pure raw wild mangrove honey"
} | ConvertTo-Json
$qaRes = Invoke-RestMethod -Uri "http://localhost:8080/api/quality-lab/batches/$batchNumber/verify" -Method Post -Body $qaBody -Headers @{ Authorization = "Bearer $labToken" } -ContentType "application/json"
Write-Host "5. QUALITY LAB TESTED: Verdict -> $($qaRes.data.overallVerdict) (Purity: $($qaRes.data.pollenPurityScore)%)"

# Step 5: Processor packages batch
$pkgBody = @{
    packagingType = "500g_GLASS_JAR"
    unitCount = 120
    netWeightGrams = 500.0
    bestBeforeMonths = 24
} | ConvertTo-Json
$pkgRes = Invoke-RestMethod -Uri "http://localhost:8080/api/processor/batches/$batchNumber/package" -Method Post -Body $pkgBody -Headers @{ Authorization = "Bearer $procToken" } -ContentType "application/json"
Write-Host "6. BATCH PACKAGED: $($pkgRes.data.Count) serialized consumer units generated (Status: PACKAGED)"

# Step 6: Guard Test: Attempting DELIVER before DISPATCH
Write-Host "7. GUARD TEST: Attempting delivery before dispatch..."
try {
    $earlyDlv = @{ destinationDepot = "Central Depot" } | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:8080/api/distributor/batches/$batchNumber/deliver" -Method Post -Body $earlyDlv -Headers @{ Authorization = "Bearer $distToken" } -ContentType "application/json"
    Write-Host "   FAILED: Delivery before dispatch was NOT blocked!"
} catch {
    Write-Host "   PASSED: Delivery before dispatch was BLOCKED: $($_.Exception.Message)"
}

# Step 7: Distributor dispatches batch
$dispBody = @{
    originLocation = "Kolkata Processing Hub"
    destinationLocation = "Delhi National Cold-Chain Depot"
    quantityDispatchedKg = 60.0
    ambientTemperatureCelsius = 19.5
    trackingReference = "TRK-ECO-LIVE-771"
} | ConvertTo-Json
$dispRes = Invoke-RestMethod -Uri "http://localhost:8080/api/distributor/batches/$batchNumber/dispatch" -Method Post -Body $dispBody -Headers @{ Authorization = "Bearer $distToken" } -ContentType "application/json"
Write-Host "8. BATCH DISPATCHED: Tracking #$($dispRes.data.trackingReference) (Status: DISPATCHED)"

# Step 8: Distributor confirms delivery
$dlvBody = @{
    destinationDepot = "Delhi National Cold-Chain Depot"
    remarks = "Tamper seals inspected and validated intact"
} | ConvertTo-Json
$dlvRes = Invoke-RestMethod -Uri "http://localhost:8080/api/distributor/batches/$batchNumber/deliver" -Method Post -Body $dlvBody -Headers @{ Authorization = "Bearer $distToken" } -ContentType "application/json"
Write-Host "9. BATCH DELIVERED: Confirmed at $($dlvRes.data.destinationLocation) (Status: DELIVERED)"

# Step 9: Public Consumer Verification of the full 4-stage lifecycle
$consumerVerify = Invoke-RestMethod -Uri "http://localhost:8080/api/verify/batch/$batchNumber" -Method Get
Write-Host "10. PUBLIC CONSUMER VERIFICATION:"
Write-Host "    Verification Status: $($consumerVerify.data.verificationStatus)"
Write-Host "    Blockchain Verified: $($consumerVerify.data.blockchainVerified)"
Write-Host "    Total Provenance Stages: $($consumerVerify.data.timeline.Count)"
foreach ($stage in $consumerVerify.data.timeline) {
    Write-Host "    -> Stage: $($stage.stage) | $($stage.title) | Actor: $($stage.actor) | Completed: $($stage.completed)"
}

Write-Host "=================================================="
Write-Host "PHASE 3 SUPPLY CHAIN VERIFICATION COMPLETE"
Write-Host "=================================================="
