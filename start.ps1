Get-Content ".env" | ForEach-Object {
    if ($_ -match '^\s*#') { return }
    if ($_ -match '^\s*$') { return }
    if ($_ -match '^\s*([^=]+?)\s*=\s*(.*)\s*$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim('"')
        [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

try {
    Push-Location "backend"
    go run main.go
} finally {
    Pop-Location
}