& ./build-backend.ps1
& ./build-frontend.ps1
Remove-Item -Recurse -Force ../build/database, ../build/uploads -ErrorAction SilentlyContinue
& scp -r ../build/ root@212.108.82.125:~/vault/