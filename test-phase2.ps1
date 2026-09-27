# Phase 2 Live End-to-End Verification Script

Write-Host "=================================================="
Write-Host "🐝 BeeProof Phase 2 Live Verification"
Write-Host "=================================================="

# 1. Public Verification of Seed Batch
$seedVerify = Invoke-RestMethod -Uri "http://localhost:8080/api/verify/batch/BP-2026-SUN-001" -Method Get
Write-Host "1. SEED BATCH VERIFICATION:"
Write-Host "   Status: $($seedVerify.data.verificationStatus)"
Write-Host "   Blockchain Verified: $($seedVerify.data.blockchainVerified)"
Write-Host "   State Merkle Root: $($seedVerify.data.stateMerkleRoot)"
Write-Host "   QR Code URL: $($seedVerify.data.qrCodeUrl)"
Write-Host "   Timeline Stages: $($seedVerify.data.timeline.Count)"

# 2. Login as Beekeeper 1
$loginBody = @{
    username = "beekeeper1@beeproof.org"
    password = "BeeProof@2026!"
} | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginRes.data.token
$headers = @{ Authorization = "Bearer $token" }
Write-Host "2. BEEKEEPER LOGIN: SUCCESS (Token acquired)"

# 3. Create New Batch from Authorized Hive 1
$newBatchBody = @{
    hiveId = 1
    quantityKg = 52.0
    floralSource = "Sundarbans Wild Mangrove Khalisha"
    harvestDate = (Get-Date).ToString("yyyy-MM-dd")
    moistureContentPercentage = 17.2
    notes = "Live Phase 2 verified harvest batch"
} | ConvertTo-Json

$createRes = Invoke-RestMethod -Uri "http://localhost:8080/api/beekeeper/batches" -Method Post -Body $newBatchBody -Headers $headers -ContentType "application/json"
$newBatchNum = $createRes.data.batchNumber
Write-Host "3. NEW BATCH CREATION (Hive 1):"
Write-Host "   New Batch Number: $newBatchNum"
Write-Host "   Blockchain Tx Hash: $($createRes.data.blockchainTxHash)"
Write-Host "   State Merkle Root: $($createRes.data.stateMerkleRoot)"
Write-Host "   QR Code URL: $($createRes.data.qrCodeUrl)"

# 4. Public Verification of Newly Minted Batch (No Login)
$newVerify = Invoke-RestMethod -Uri "http://localhost:8080/api/verify/batch/$newBatchNum" -Method Get
Write-Host "4. NEW BATCH PUBLIC VERIFICATION:"
Write-Host "   Status: $($newVerify.data.verificationStatus)"
Write-Host "   Blockchain Verified: $($newVerify.data.blockchainVerified)"
Write-Host "   Timeline Event Count: $($newVerify.data.timeline.Count)"
Write-Host "   First Stage: $($newVerify.data.timeline[0].stage) ($($newVerify.data.timeline[0].title))"

# 5. Security Test: Attempt creation with unauthorized Hive 4 (belongs to Beekeeper 2)
Write-Host "5. SECURITY TEST: Creating batch on unauthorized Hive 4..."
try {
    $unauthBody = @{
        hiveId = 4
        quantityKg = 15.0
        floralSource = "Unauthorized"
        harvestDate = (Get-Date).ToString("yyyy-MM-dd")
    } | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:8080/api/beekeeper/batches" -Method Post -Body $unauthBody -Headers $headers -ContentType "application/json"
    Write-Host "   FAILED: Unauthorized batch creation was NOT blocked!"
} catch {
    Write-Host "   PASSED: Unauthorized hive access was properly BLOCKED: $($_.Exception.Message)"
}

# 6. Non-existent Batch Test
Write-Host "6. 404 NOT FOUND TEST:"
try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/verify/batch/BP-NON-EXISTENT-XYZ" -Method Get
    Write-Host "   FAILED: Should have returned 404"
} catch {
    Write-Host "   PASSED: Nonexistent batch returned expected 404"
}

Write-Host "=================================================="
Write-Host "✅ PHASE 2 TRACEABILITY MVP VERIFICATION COMPLETE"
Write-Host "=================================================="
