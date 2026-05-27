$projectRoot = Split-Path -Parent $PSScriptRoot
$runtimeDir = Join-Path $projectRoot ".runtime"
$pidFile = Join-Path $runtimeDir "server.pid"

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

if (Test-Path $pidFile) {
    $savedPid = Get-Content $pidFile | Select-Object -First 1
    if ($savedPid) {
        try {
            Stop-Process -Id ([int]$savedPid) -Force -ErrorAction Stop
        } catch {
        }
    }
    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}

Stop-ListenerOnPort -TargetPort 3000
Write-Host "Serveur Awards 2026 arrete."
