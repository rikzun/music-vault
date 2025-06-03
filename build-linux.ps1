[System.Environment]::SetEnvironmentVariable("GOOS", "linux", "Process")
[System.Environment]::SetEnvironmentVariable("GOARCH", "amd64", "Process")

cd backend
go build -o ../build/vault
cd ../