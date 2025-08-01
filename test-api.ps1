Param(
  [string]$BaseUrl = "http://localhost:3000",
  [string]$Token,                         # Token Clerk (Bearer)
  [switch]$RunAll                         # Ejecuta toda la batería de pruebas
)

function Write-Title($t) {
  Write-Host ""
  Write-Host "==== $t ====" -ForegroundColor Cyan
}

function Invoke-Api {
  Param(
    [Parameter(Mandatory)][ValidateSet('GET','POST','PATCH','DELETE')] [string]$Method,
    [Parameter(Mandatory)][string]$Path,   # Ej: /api/users/sync
    [object]$Body = $null,
    [switch]$Auth
  )

  $url = "$BaseUrl$Path"

  $headers = @{}
  if ($Auth -and $Token) {
    $headers["Authorization"] = "Bearer $Token"
  }

  if ($Body -ne $null) {
    $json = ($Body | ConvertTo-Json -Depth 10)
    $resp = Invoke-RestMethod -Uri $url -Method $Method -Headers $headers -ContentType "application/json" -Body $json -ErrorAction Stop
  } else {
    $resp = Invoke-RestMethod -Uri $url -Method $Method -Headers $headers -ErrorAction Stop
  }
  return $resp
}

if (-not $Token) {
  Write-Warning "No proporcionaste -Token. Algunas llamadas (sync, createWord...) fallarán. Puedes seguir para probar endpoints públicos."
}

# --- Pruebas individuales -------------------------------------------------
function Test-Health {
  Write-Title "Health"
  $r = Invoke-Api -Method GET -Path "/"
  $r | ConvertTo-Json -Depth 5
}

function Test-SyncUser {
  Write-Title "Sync Clerk User"
  $r = Invoke-Api -Method POST -Path "/api/users/sync" -Auth
  $script:LastUser = $r
  $r | ConvertTo-Json -Depth 5
}

function Test-CreateUserManual {
  Write-Title "Create User Manual (debug)"
  # ¡Cambia clerkId/email/name!
  $body = @{
    clerkId = "user_debug_$(Get-Random)"
    email   = "debug$(Get-Random)@example.com"
    name    = "Debug User"
    score   = 7
  }
  $r = Invoke-Api -Method POST -Path "/api/users" -Body $body -Auth
  $script:LastManualUser = $r
  $r | ConvertTo-Json -Depth 5
}

function Test-ListUsers {
  Write-Title "List Users"
  $r = Invoke-Api -Method GET -Path "/api/users"
  $r | ConvertTo-Json -Depth 5
}

function Test-CreateWordA {
  Write-Title "Create Word A"
  $body = @{
    text        = "amanecer"
    definition  = "Momento en que aparece la luz del día"
    origin      = "es"
    latin       = "MANERE?"
  }
  $r = Invoke-Api -Method POST -Path "/api/words" -Body $body -Auth
  $script:WordA = $r
  $r | ConvertTo-Json -Depth 5
}

function Test-CreateWordB {
  Write-Title "Create Word B"
  $body = @{
    text        = "alba"
    definition  = "Primeras luces del día"
    origin      = "es"
    latin       = "ALBA"
  }
  $r = Invoke-Api -Method POST -Path "/api/words" -Body $body -Auth
  $script:WordB = $r
  $r | ConvertTo-Json -Depth 5
}

function Test-ListWords {
  Write-Title "List Words"
  $r = Invoke-Api -Method GET -Path "/api/words"
  $r | ConvertTo-Json -Depth 5
}

function Test-AddRelationSynonym {
  Write-Title "Add Synonym Relation (WordA -> WordB)"
  if (-not $script:WordA -or -not $script:WordB) {
    Write-Warning "Necesitas crear WordA y WordB primero."
    return
  }
  $body = @{
    fromWordId   = [int]$script:WordA.id
    toWordId     = [int]$script:WordB.id
    relationType = "SYNONYM"
  }
  $r = Invoke-Api -Method POST -Path "/api/relations" -Body $body -Auth
  $r | ConvertTo-Json -Depth 5
}

function Test-GetWordA {
  Write-Title "Get WordA With Relations"
  if (-not $script:WordA) {
    Write-Warning "WordA no creado todavía."
    return
  }
  $r = Invoke-Api -Method GET -Path "/api/words/$($script:WordA.id)"
  $r | ConvertTo-Json -Depth 5
}

# --- Suite -------------------------------------------------
if ($RunAll) {
  Test-Health
  if ($Token) { Test-SyncUser }
  if ($Token) { Test-CreateUserManual }
  Test-ListUsers
  if ($Token) { Test-CreateWordA }
  if ($Token) { Test-CreateWordB }
  Test-ListWords
  if ($Token) { Test-AddRelationSynonym }
  Test-GetWordA
} else {
  Write-Host ""
  Write-Host "Carga interactiva lista. Ejecuta las funciones manualmente, por ejemplo:" -ForegroundColor Yellow
  Write-Host "  Test-Health" -ForegroundColor Yellow
  Write-Host "  Test-SyncUser" -ForegroundColor Yellow
  Write-Host "  Test-CreateWordA" -ForegroundColor Yellow
  Write-Host ""
}
