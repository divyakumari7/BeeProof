$loginBody = @{
    username = 'admin@beeproof.org'
    password = 'BeeProof@2026!'
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $loginBody -ContentType 'application/json'
Write-Host "LOGIN STATUS: $($loginRes.success)"
Write-Host "USER PRIMARY ROLE: $($loginRes.data.user.primaryRole)"
Write-Host "EMAIL: $($loginRes.data.user.email)"

$token = $loginRes.data.token
$headers = @{
    Authorization = "Bearer $token"
}

$overview = Invoke-RestMethod -Uri 'http://localhost:8080/api/admin/overview' -Method Get -Headers $headers
Write-Host "ADMIN OVERVIEW: Total Beekeepers = $($overview.data.totalBeekeepers), Clusters = $($overview.data.totalClusters), Hives = $($overview.data.totalHives), Batches = $($overview.data.totalHoneyBatches)"

$beekeeperBody = @{
    username = 'beekeeper1@beeproof.org'
    password = 'BeeProof@2026!'
} | ConvertTo-Json
$bkRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $beekeeperBody -ContentType 'application/json'
$bkToken = $bkRes.data.token
$bkHeaders = @{ Authorization = "Bearer $bkToken" }
$bkDash = Invoke-RestMethod -Uri 'http://localhost:8080/api/beekeeper/dashboard' -Method Get -Headers $bkHeaders
Write-Host "BEEKEEPER DASHBOARD: Cluster = $($bkDash.data.clusterName), Total Hives = $($bkDash.data.totalHives)"
