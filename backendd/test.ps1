$ErrorActionPreference = "Stop"

$env:SECRET = "kekw"
$env:POSTGRES_HOST = "127.0.0.1"
$env:POSTGRES_NAME = "postgres"
$env:POSTGRES_USER = "dev"
$env:POSTGRES_PASS = "dev"

go run .
