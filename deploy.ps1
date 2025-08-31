param(
    [string]$arg0
)

$arg0 = $arg0.ToLower()

if ($arg0 -eq "") {
    Write-Host "b - backend"
    Write-Host "f - frontend"
    Write-Host "a - all"
    Write-Host "! - skip build"
    Write-Host "example: a!"
    return
}

$pwd = Get-Location
$now = Get-Date
$5min = New-TimeSpan -Minutes 5

$skipBuild = $arg0.Contains('!')
$backend = $arg0.Contains('b') -or $arg0.Contains('a')
$frontend = $arg0.Contains('f') -or $arg0.Contains('a')

$backendItem = Get-Item ./build/vault -ErrorAction SilentlyContinue
$frontendItem = Get-Item ./build/frontend -ErrorAction SilentlyContinue

function Prepare-Files {
    try {
        Copy-Item -Path .env, docker-compose.yml, nginx.conf -Destination ./build/ -Force -ErrorAction SilentlyContinue
        Remove-Item -Recurse -Force ./build/database, ./build/uploads -ErrorAction SilentlyContinue
    } finally {
        Set-Location $pwd
    }
}

function Build-Backend {
    try {
        [System.Environment]::SetEnvironmentVariable("GIN_MODE", "release", "Process")
        [System.Environment]::SetEnvironmentVariable("GOOS", "linux", "Process")
        [System.Environment]::SetEnvironmentVariable("GOARCH", "amd64", "Process")
        Set-Location "./backend"
        go build -o ./build/vault
    } finally {
        Set-Location $pwd
    }
}

function Build-Frontend {
    try {
        Set-Location "./frontend"
        npm run dev-build
    } finally {
        Set-Location $pwd
    }
}

function Ensure-Build {
    param(
        [object]$item,

        [Parameter(Mandatory=$true)]
        [string]$itemName,

        [Parameter(Mandatory=$true)]
        [string]$buildFunctionName
    )

    if ($null -eq $item) {
        $makeNewBuild = while ($true) {
            $input = (Read-Host "$itemName was not found, make new build? [Y/n]").ToLower()

            switch ($input) {
                "y" { $true }
                "" { $true }
                "n" { $false }
            }

            break
        }

        if (-not $makeNewBuild) { exit }
        & $buildFunctionName
    } else {
        $lastWrite = $now - $item.LastWriteTime

        if ($lastWrite -gt $5min) {
            $minutesAgo = [math]::Round($lastWrite.TotalMinutes, 0)

            $makeNewBuild = while ($true) {
                $input = (Read-Host "$itemName made $minutesAgo minutes ago, make new build? [Y/n]").ToLower()

                switch ($input) {
                    "y" { $true }
                    "" { $true }
                    "n" { $false }
                }

                break
            }

            if (-not $makeNewBuild) { return }
            & $buildFunctionName
        }
    }
}

if ($backend) {
    if ($skipBuild) {
        Ensure-Build $backendItem "Backend Item" "Build-Backend"
    } else {
        Build-Backend
    }
}

if ($frontend) {
    if ($skipBuild) {
        Ensure-Build $frontendItem "Frontend Item" "Build-Frontend"
    } else {
        Build-Frontend
    }
}

scp -r ./build/ root@212.108.82.125:~/vault/