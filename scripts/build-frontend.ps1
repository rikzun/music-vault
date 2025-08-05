cd ../frontend
npm run dev-build
cd ../

Copy-Item -Path .env, docker-compose.yml, nginx.conf -Destination ./build/ -Force

cd ./scripts