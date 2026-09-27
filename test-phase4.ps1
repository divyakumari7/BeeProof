Write-Host "=================================================="
Write-Host "BeeProof Phase 4 IoT Telemetry & Anomaly Live Test"
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

# 2. Query Initial Hive Telemetry (Check DEMO / SIMULATED SENSOR DATA label and history)
$telemetryRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/iot/hives/1/telemetry' -Method Get -Headers $bkHeaders
Write-Host "2. INITIAL TELEMETRY RETRIEVED:"
Write-Host "   Hive: $($telemetryRes.data.hiveCode)"
Write-Host "   Data Source Label: $($telemetryRes.data.dataSourceLabel)"
Write-Host "   Sensor Core: $($telemetryRes.data.sensorIdentifier) | Status: $($telemetryRes.data.sensorStatus)"
Write-Host "   Current Temp: $($telemetryRes.data.currentTemperature)°C | Humidity: $($telemetryRes.data.currentHumidity)% | Weight: $($telemetryRes.data.currentWeight)kg"
Write-Host "   Historical Points: $($telemetryRes.data.history.Count) readings"

if ($telemetryRes.data.dataSourceLabel -ne 'DEMO / SIMULATED SENSOR DATA') {
    Write-Error "Data source label missing required disclaimer!"
    exit 1
}

# 3. Simulate Abnormal Condition 1: HIGH TEMPERATURE (38.8°C)
Write-Host "`n3. SIMULATING ABNORMAL THERMAL SPIKE (> 36.5°C)..."
$simHighTemp = Invoke-RestMethod -Uri 'http://localhost:8080/api/iot/hives/1/simulate?scenario=HIGH_TEMP' -Method Post -Headers $bkHeaders
Write-Host "   Simulated reading ingested: $($simHighTemp.data.temperatureCelsius)°C"

# Verify that alert was generated
$alertsRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/iot/hives/1/alerts' -Method Get -Headers $bkHeaders
$unreadHighTemp = $alertsRes.data | Where-Object { $_.metric -eq 'TEMPERATURE' -and $_.status -eq 'UNREAD' } | Select-Object -First 1

if ($unreadHighTemp) {
    Write-Host "   ALERT GENERATED: Metric=$($unreadHighTemp.metric) | Observed=$($unreadHighTemp.observedValue)°C | Status=$($unreadHighTemp.status)"
    Write-Host "   Reason: $($unreadHighTemp.reason)"
    Write-Host "   Action: $($unreadHighTemp.recommendedAction)"
} else {
    Write-Error "Failed: High temp alert was not generated!"
    exit 1
}

# 4. Resolve Alert
Write-Host "`n4. RESOLVING ANOMALY ALERT (ID: $($unreadHighTemp.id))..."
$resolveRes = Invoke-RestMethod -Uri "http://localhost:8080/api/iot/alerts/$($unreadHighTemp.id)/resolve" -Method Put -Headers $bkHeaders
Write-Host "   Alert Status: $($resolveRes.data.status) (Resolved at: $($resolveRes.data.resolvedAt))"

# 5. Simulate Sensor Offline Condition
Write-Host "`n5. SIMULATING SENSOR OFFLINE BEHAVIOR..."
$sensorId = $telemetryRes.data.sensorIdentifier
$offlineRes = Invoke-RestMethod -Uri "http://localhost:8080/api/iot/sensors/$sensorId/status?active=false" -Method Put -Headers $bkHeaders
Write-Host "   Sensor $sensorId active state: $($offlineRes.data.active)"

$telemetryAfterOffline = Invoke-RestMethod -Uri 'http://localhost:8080/api/iot/hives/1/telemetry' -Method Get -Headers $bkHeaders
Write-Host "   Telemetry sensor status now: $($telemetryAfterOffline.data.sensorStatus)"

# Restore Sensor Online
$onlineRes = Invoke-RestMethod -Uri "http://localhost:8080/api/iot/sensors/$sensorId/status?active=true" -Method Put -Headers $bkHeaders
Write-Host "   Sensor restored to: $($onlineRes.data.active)"

# 6. Physical Validation Guard Test
Write-Host "`n6. GUARD TEST: Ingesting physically impossible telemetry (95°C)..."
try {
    $badReq = @{
        hiveId = 1
        temperatureCelsius = 95.0
        relativeHumidityPercent = 55.0
        weightKilograms = 30.0
    } | ConvertTo-Json
    Invoke-RestMethod -Uri 'http://localhost:8080/api/iot/readings' -Method Post -Body $badReq -Headers $bkHeaders
    Write-Error "Failed: Bad telemetry was accepted!"
} catch {
    Write-Host "   PASSED: Out-of-bounds telemetry was BLOCKED with HTTP 400/500 ($($_.Exception.Message))"
}

Write-Host "`n=================================================="
Write-Host "PHASE 4 IoT HIVE MONITORING VERIFICATION COMPLETE"
Write-Host "=================================================="
