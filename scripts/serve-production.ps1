$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

$logDir = Join-Path $projectRoot ".runtime"
New-Item -ItemType Directory -Path $logDir -Force | Out-Null

$stdout = Join-Path $logDir "server.out.log"
$stderr = Join-Path $logDir "server.err.log"

cmd /c "npm run start:stable 1>> ""$stdout"" 2>> ""$stderr"""
