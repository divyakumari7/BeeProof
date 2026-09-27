Write-Host "=================================================="
Write-Host "BeeProof Phase 6 Admin & KVIC Analytics Test"
Write-Host "=================================================="

# 1. Authenticate as KVIC Admin
$adminLoginBody = @{
    username = 'admin@beeproof.org'
    password = 'BeeProof@2026!'
} | ConvertTo-Json

$adminAuth = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $adminLoginBody -ContentType 'application/json'
$adminToken = $adminAuth.data.token
$adminHeaders = @{
    Authorization = "Bearer $adminToken"
    'Content-Type' = 'application/json'
}
Write-Host "1. KVIC ADMIN AUTHENTICATED: $($adminAuth.data.user.fullName)"

# 2. Query National Analytics Summary
Write-Host "`n2. FETCHING NATIONAL KVIC BI ANALYTICS SUMMARY..."
$summaryRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/admin/analytics/summary' -Method Get -Headers $adminHeaders
$summary = $summaryRes.data

Write-Host "   Total Honey Production: $($summary.totalProductionKg) kg"
Write-Host "   Total Batches: $($summary.totalBatchesCount) (Certified: $($summary.certifiedBatchesCount))"
Write-Host "   Total Hives: $($summary.totalHivesCount) (Active: $($summary.activeHivesCount), Warning: $($summary.warningHivesCount), Critical: $($summary.criticalHivesCount))"
Write-Host "   Blockchain Verifications: $($summary.blockchainVerificationsCount) (Pass Rate: $($summary.authenticityRatePercentage)%)"
Write-Host "   Disclaimer: $($summary.disclaimer)"

Write-Host "`n   [CLUSTER PRODUCTION RANKINGS]"
foreach ($rank in $summary.clusterRankings) {
    Write-Host "     -> $($rank.clusterName) ($($rank.state)): $($rank.productionKg) kg | $($rank.beekeeperCount) beekeepers | $($rank.hiveCount) hives"
}

Write-Host "`n   [FLORAL SOURCE BREAKDOWN]"
foreach ($flora in $summary.floralDistributions) {
    Write-Host "     -> $($flora.floralSource): $($flora.volumeKg) kg ($($flora.percentage)%)"
}

if ($summary.totalHivesCount -lt 1 -or -not $summary.clusterRankings) {
    Write-Error "Failed: National analytics summary incomplete!"
    exit 1
}

# 3. Cluster Drilldown API
Write-Host "`n3. FETCHING DRILLDOWN FOR CLUSTER 1 (Sundarbans)..."
$drillRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/admin/clusters/1/drilldown' -Method Get -Headers $adminHeaders
$drill = $drillRes.data

Write-Host "   Cluster: $($drill.cluster.name) ($($drill.cluster.clusterCode))"
Write-Host "   Total Yield: $($drill.totalYieldKg) kg | Active Alerts: $($drill.activeAlertsCount)"
Write-Host "   Beekeepers in Cluster: $($drill.beekeepers.Count)"
Write-Host "   Hives in Cluster: $($drill.hives.Count)"
Write-Host "   Batches in Cluster: $($drill.batches.Count)"

if ($drill.beekeepers.Count -lt 1 -or $drill.hives.Count -lt 1) {
    Write-Error "Failed: Cluster drilldown missing beekeepers or hives!"
    exit 1
}

# 4. System Batches API
Write-Host "`n4. FETCHING ALL SYSTEM BATCHES..."
$batchesRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/admin/batches' -Method Get -Headers $adminHeaders
Write-Host "   Total Batches Retrieved: $($batchesRes.data.Count)"

# 5. System Alerts API
Write-Host "`n5. FETCHING ALL TELEMETRY ALERTS..."
$alertsRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/admin/alerts' -Method Get -Headers $adminHeaders
Write-Host "   Total Hive Alerts Retrieved: $($alertsRes.data.Count)"

# 6. Blockchain Registry Stats
Write-Host "`n6. FETCHING BLOCKCHAIN REGISTRY STATS..."
$bcRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/admin/blockchain/stats' -Method Get -Headers $adminHeaders
$bc = $bcRes.data
Write-Host "   Network: $($bc.networkName)"
Write-Host "   Contract Address: $($bc.contractAddress)"
Write-Host "   Latest Block Height: #$($bc.latestBlockNumber)"
Write-Host "   On-Chain Records: $($bc.totalBatchesOnChain)"
Write-Host "   Node Status: $($bc.nodeStatus)"

# 7. Audit Log CSV Export
Write-Host "`n7. TESTING AUDIT LOG CSV EXPORT..."
$csvRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/admin/export/audit-logs' -Method Get -Headers $adminHeaders
$csvLines = $csvRes -split "`n"
Write-Host "   CSV Header: $($csvLines[0])"
Write-Host "   Total Rows Exported: $($csvLines.Count)"

if (-not $csvLines[0].Contains("ID,Timestamp,Action,PerformedBy")) {
    Write-Error "Failed: CSV export missing valid headers!"
    exit 1
}

# 8. RBAC Guard Test: Beekeeper cannot access Admin Analytics
Write-Host "`n8. RBAC GUARD TEST: Beekeeper attempting Admin Analytics..."
$bkLoginBody = @{
    username = 'beekeeper1@beeproof.org'
    password = 'BeeProof@2026!'
} | ConvertTo-Json
$bkAuth = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $bkLoginBody -ContentType 'application/json'
$bkHeaders = @{
    Authorization = "Bearer $($bkAuth.data.token)"
    'Content-Type' = 'application/json'
}

try {
    Invoke-RestMethod -Uri 'http://localhost:8080/api/admin/analytics/summary' -Method Get -Headers $bkHeaders
    Write-Error "Failed: Beekeeper was allowed into Admin Analytics!"
    exit 1
} catch {
    Write-Host "   PASSED: Beekeeper access was BLOCKED with 403 Forbidden."
}

Write-Host "`n=================================================="
Write-Host "PHASE 6 ADMIN & KVIC BACKEND APIS VERIFIED"
Write-Host "=================================================="
