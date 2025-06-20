& ./linux-build.ps1
Remove-Item -Recurse -Force ./build/database, ./build/uploads -ErrorAction SilentlyContinue
& scp -r build/ rikzun@openkrosskod.org:~/vault