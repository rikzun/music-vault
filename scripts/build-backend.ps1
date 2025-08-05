[System.Environment]::SetEnvironmentVariable("GIN_MODE", "release", "Process")
[System.Environment]::SetEnvironmentVariable("GOOS", "linux", "Process")
[System.Environment]::SetEnvironmentVariable("GOARCH", "amd64", "Process")

cd ../backend
go build -o ../build/vault
cd ../

Copy-Item -Path .env, docker-compose.yml, nginx.conf -Destination ./build/ -Force

cd ./scripts