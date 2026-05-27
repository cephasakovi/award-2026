$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

$port = 3000
$runtimeDir = Join-Path $projectRoot ".runtime"
New-Item -ItemType Directory -Path $runtimeDir -Force | Out-Null

$pidFile = Join-Path $runtimeDir "server.pid"
$launcher = Join-Path $PSScriptRoot "serve-production.ps1"

function Stop-ListenerOnPort {
    param([int]$TargetPort)

    $listeners = netstat -ano | Select-String ":$TargetPort"
    foreach ($line in $listeners) {
        if ($line.Line -match "LISTENING\s+(\d+)$") {
            $processId = [int]$Matches[1]
            if ($processId -gt 0) {
                try {
                    Stop-Process -Id $processId -Force -ErrorAction Stop
                } catch {
                }
            }
        }
    }
}

function Wait-ForSite {
    param([string]$Url, [int]$TimeoutSeconds = 45)

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                return $true
            }
        } catch {
        }
        Start-Sleep -Seconds 2
    }

    return $false
}

Write-Host "Preparation du lancement stable..."
Stop-ListenerOnPort -TargetPort $port

if (-not (Test-Path (Join-Path $projectRoot "node_modules"))) {
    Write-Host "Installation des dependances..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Echec de npm install"
        exit 1
    }
}

Write-Host "Build de production..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Echec du build"
    exit 1
}

Write-Host "Demarrage du serveur..."
$process = Start-Process powershell `
    -ArgumentList @(
        "-NoProfile",
        "-ExecutionPolicy", "Bypass",
        "-File", "`"$launcher`""
    ) `
    -WorkingDirectory $projectRoot `
    -WindowStyle Minimized `
    -PassThru

Set-Content -Path $pidFile -Value $process.Id

if (Wait-ForSite -Url "http://localhost:$port") {
    Start-Process "http://localhost:$port"
    Write-Host "Site lance sur http://localhost:$port"
    exit 0
}

Write-Host "Le serveur n'a pas repondu a temps."
exit 1
