Write-Host "=================================================="
Write-Host "BeeProof Phase 5 AI Analytics Live Integration Test"
Write-Host "=================================================="

# 1. Authenticate as Beekeeper
$bkLoginBody = @{
    username = 'beekeeper1@beeproof.org'
    password = 'BeeProof@2026!'
} | ConvertTo-Json

$bkAuth = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $bkLoginBody -ContentType 'application/json'
$bkToken = $bkAuth.data.token
$bkHeaders = @{
    Authorization = "Bearer $bkToken"
    'Content-Type' = 'application/json'
}
Write-Host "1. BEEKEEPER AUTHENTICATED: $($bkAuth.data.user.fullName)"

# 2. Query AI Insights for Hive 1
Write-Host "`n2. FETCHING AI INSIGHTS FOR HIVE 1 (Spring Boot <-> FastAPI AI Microservice)..."
$aiRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/ai/hives/1/insights' -Method Get -Headers $bkHeaders
$insights = $aiRes.data

Write-Host "   Hive Code: $($insights.hiveCode)"
Write-Host "   Disclaimer: $($insights.disclaimer)"
Write-Host "   Generated At: $($insights.generatedAt)"

# 2a. Health Prediction Check
$health = $insights.health
Write-Host "`n   [HIVE HEALTH AI PREDICTION]"
Write-Host "   Score: $($health.healthScore)/100 | Status: $($health.healthStatus) | Risk: $($health.riskLevel)"
Write-Host "   Swarming Risk: $($health.swarmingRiskProbability * 100)% | Queen Loss Risk: $($health.queenLossProbability * 100)%"
Write-Host "   Model Version: $($health.modelVersion)"
Write-Host "   Recommendation: $($health.recommendation)"
Write-Host "   Contributing Factors ($($health.contributingFactors.Count)):"
foreach ($factor in $health.contributingFactors) {
    Write-Host "     -> $factor"
}

if (-not $health.healthScore -or -not $health.contributingFactors) {
    Write-Error "Failed: Health score or contributing factors missing!"
    exit 1
}

# 2b. Productivity Yield Prediction Check
$prod = $insights.productivity
Write-Host "`n   [PRODUCTIVITY YIELD AI PREDICTION]"
Write-Host "   Status: $($prod.status) | Confidence: $($prod.confidenceIndicator)"
Write-Host "   Predicted Surplus: $($prod.predictedProductionKg) kg (Range: $($prod.expectedRangeMinKg) - $($prod.expectedRangeMaxKg) kg)"
Write-Host "   Contributing Factors ($($prod.contributingFactors.Count)):"
foreach ($factor in $prod.contributingFactors) {
    Write-Host "     -> $factor"
}

# 2c. Disease Risk Module Check
$disease = $insights.diseaseRisk
Write-Host "`n   [DISEASE RISK MODULE PREDICTION]"
Write-Host "   Category: $($disease.riskCategory) | Severity: $($disease.riskSeverity)"
Write-Host "   Pathogen/Pest: $($disease.pathogenOrPestName)"
Write-Host "   Detection Probability: $($disease.detectionProbability * 100)%"
Write-Host "   Label: $($disease.label)"
Write-Host "   Recommended Action: $($disease.recommendedAction)"
Write-Host "   Disclaimer: $($disease.disclaimer)"

if ($disease.label -ne 'Disease Risk (Demo Inference)') {
    Write-Error "Failed: Disease risk label missing required disclaimer!"
    exit 1
}

# 3. Refresh AI Predictions via POST endpoint
Write-Host "`n3. TRIGGERING ON-DEMAND PREDICTION REFRESH..."
$refreshRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/ai/hives/1/refresh-predictions' -Method Post -Headers $bkHeaders
Write-Host "   Refreshed Health Score: $($refreshRes.data.health.healthScore)"
Write-Host "   Refreshed Status: $($refreshRes.data.health.healthStatus)"

# 4. Guard Test: Unauthenticated Access to AI Insights
Write-Host "`n4. GUARD TEST: Unauthenticated call to AI insights..."
try {
    Invoke-RestMethod -Uri 'http://localhost:8080/api/ai/hives/1/insights' -Method Get
    Write-Error "Failed: Unauthenticated call was accepted!"
} catch {
    Write-Host "   PASSED: Unauthenticated access was BLOCKED with 401 Unauthorized."
}

Write-Host "`n=================================================="
Write-Host "PHASE 5 AI ANALYTICS VERIFICATION COMPLETE"
Write-Host "=================================================="
