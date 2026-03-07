$ErrorActionPreference = "Stop"

$backendRunning = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue

if (-not $backendRunning) {
    $env:SECRET = "kekw"
    $env:POSTGRES_HOST = "127.0.0.1"
    $env:POSTGRES_NAME = "postgres"
    $env:POSTGRES_USER = "dev"
    $env:POSTGRES_PASS = "dev"

    Push-Location ./backendd/
    try {
        go run .
    } finally {
        Pop-Location
    }
} else {
    Push-Location ./frontend/
    
    try {
        npm run local
    } finally {
        Pop-Location
    }
}