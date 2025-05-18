Get-Content ".env" | ForEach-Object {
    if ($_ -match '^\s*#') { return }
    if ($_ -match '^\s*$') { return }
    if ($_ -match '^\s*([^=]+?)\s*=\s*(.*)\s*$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim('"')
        [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

cd backend
go build -o ../vault.exe
cd ../
& ./vault.exe