param(
    [string]$arg0
)

$arg0 = $arg0.ToLower()

if ($arg0 -eq "") {
    Write-Host "b - backend"
    Write-Host "f - frontend"
    Write-Host "e - environment"
    Write-Host "a - all"
    Write-Host "! - skip build"
    Write-Host "example: be!"
    exit
}

$pwd = Get-Location
$fiveMin = New-TimeSpan -Minutes 5

$backend = $arg0.Contains('b') -or $arg0.Contains('a')
$frontend = $arg0.Contains('f') -or $arg0.Contains('a')
$environment = $arg0.Contains('e') -or $arg0.Contains('a')
$skipBuild = $arg0.Contains('!')

$backendItem = Get-Item ./build/vault -ErrorAction SilentlyContinue
$frontendItem = Get-Item ./build/frontend -ErrorAction SilentlyContinue

function Build-Backend {
    try {
        [System.Environment]::SetEnvironmentVariable("GIN_MODE", "release", "Process")
        [System.Environment]::SetEnvironmentVariable("GOOS", "linux", "Process")
        [System.Environment]::SetEnvironmentVariable("GOARCH", "amd64", "Process")
        Set-Location "./backend"
        Write-Host "backend build started"
        & go build -o ../build/vault
    } finally {
        Set-Location $pwd
    }
}

function Build-Frontend {
    try {
        Set-Location "./frontend"
        Write-Host "frontend build started"
        & npm run dev-build
    } finally {
        Set-Location $pwd
    }
}

function Build-Environment {
    try {
        Copy-Item -Path .env, docker-compose.yml, nginx.conf -Destination ./build/ -Force -ErrorAction SilentlyContinue
        Remove-Item -Recurse -Force ./build/database, ./build/uploads -ErrorAction SilentlyContinue
    } finally {
        Set-Location $pwd
    }
}

function Start-Confirmation {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Message,

        [bool]$DefaultYes = $true
    )

    while ($true) {
        $hint = if ($DefaultYes) { "[Y/n]" } else { "[y/N]" }
        $input = (Read-Host "$Message $hint").Trim().ToLower()

        switch ($input) {
            "y" { return $true }
            "n" { return $false }
            ""  { return $DefaultYes }
        }
    }
}


function Ensure-Build {
    param(
        [object]$Item,

        [Parameter(Mandatory=$true)]
        [string]$ItemName,

        [Parameter(Mandatory=$true)]
        [string]$BuildFunctionName
    )

    if ($null -eq $Item) {
        $makeNewBuild = Start-Confirmation "$ItemName was not found, make new build?"
        if (-not $makeNewBuild) { exit }

        & $BuildFunctionName
    } else {
        $lastWrite = (Get-Date) - $Item.LastWriteTime

        if ($lastWrite -gt $fiveMin) {
            $minutesAgo = [math]::Round($lastWrite.TotalMinutes, 0)

            $makeNewBuild = Start-Confirmation "$ItemName made $minutesAgo minutes ago, make new build?"
            if (-not $makeNewBuild) { return }

            & $BuildFunctionName
        }
    }
}

$deployFiles = @()

if ($backend) {
    if ($skipBuild) {
        Ensure-Build $backendItem "Backend Item" "Build-Backend"
    } else {
        Build-Backend
    }

    $deployFiles += "./build/vault"
}

if ($frontend) {
    if ($skipBuild) {
        Ensure-Build $frontendItem "Frontend Item" "Build-Frontend"
    } else {
        Build-Frontend
    }

    $deployFiles += "./build/frontend"
}

if ($environment) {
    Build-Environment

    $deployFiles += "./build/.env"
    $deployFiles += "./build/docker-compose.yml"
    $deployFiles += "./build/nginx.conf"
}

try {
    & scp -r $deployFiles root@212.108.82.125:~/vault/build
} catch {
    if ($_.Exception.Message -match "No such file or directory") {
        & ssh root@212.108.82.125 "mkdir -p ~/vault/build"
        & scp -r $deployFiles root@212.108.82.125:~/vault/build
    } else {
        throw $_
    }
}