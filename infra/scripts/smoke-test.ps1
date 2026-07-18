param(
  [string]$ApiBaseUrl = "http://localhost:4000",
  [string]$AdminApiKey = "replace-with-a-strong-secret"
)

$headers = @{ "Content-Type" = "application/json"; "x-admin-key" = $AdminApiKey }

Write-Host "Checking health..."
Invoke-RestMethod -Uri "$ApiBaseUrl/health" -Method Get | Out-Null

Write-Host "Checking public routes..."
Invoke-RestMethod -Uri "$ApiBaseUrl/api/services" -Method Get | Out-Null
Invoke-RestMethod -Uri "$ApiBaseUrl/api/reviews" -Method Get | Out-Null

Write-Host "Submitting AI assessment..."
$aiBody = @{
  name = "Smoke Test"
  email = "smoke@example.com"
  visaType = "Visit Visa"
  details = "I want to visit the UK for a short family visit and need guidance on documents."
} | ConvertTo-Json
Invoke-RestMethod -Uri "$ApiBaseUrl/api/ai/assess" -Method Post -Headers @{ "Content-Type" = "application/json" } -Body $aiBody | Out-Null

Write-Host "Submitting contact enquiry..."
$contactBody = @{
  name = "Smoke Test"
  email = "smoke@example.com"
  visaType = "Visit Visa"
  message = "Please contact me about my visa options."
  acceptedTerms = $true
  acceptedPrivacy = $true
} | ConvertTo-Json
Invoke-RestMethod -Uri "$ApiBaseUrl/api/contact" -Method Post -Headers @{ "Content-Type" = "application/json" } -Body $contactBody | Out-Null

Write-Host "Checking admin analytics..."
Invoke-RestMethod -Uri "$ApiBaseUrl/api/admin/analytics" -Method Get -Headers $headers | Out-Null
Invoke-RestMethod -Uri "$ApiBaseUrl/api/admin/automation-logs" -Method Get -Headers $headers | Out-Null
Invoke-RestMethod -Uri "$ApiBaseUrl/api/admin/audit-logs" -Method Get -Headers $headers | Out-Null

Write-Host "Smoke test completed."
