arg="${1,,}"

if [[ "$arg" == "" ]]; then
    echo "b - backend"
    echo "f - frontend"
    echo "e - environment"
    echo "a - all"
    echo "! - preserve data"
    echo "example: be!"
    exit 1
fi

[[ "$arg" == *[ba]* ]]; backend=$?
[[ "$arg" == *[fa]* ]]; frontend=$?
[[ "$arg" == *[ea]* ]]; environment=$?
[[ "$arg" == *!* ]]; preserveData=$?

if [ $backend == 0 ]; then
    sudo mv -f ./build/vault ./
fi

if [ $frontend == 0 ]; then
    sudo rm -rf ./frontend
    sudo mv -f ./build/frontend ./
fi

if [ $environment == 0 ]; then
    sudo mv -f ./build/.env ./
    sudo mv -f ./build/docker-compose.yml ./
    sudo mv -f ./build/nginx.conf ./
fi

if [ $preserveData != 0 ]; then
    sudo rm -rf ./database ./uploads
fi

sudo rm -rf ./build
sudo docker compose up -V -d
sudo docker compose logs -f