package config

import "os"

var DevMode = get("DEV_MODE") == "true"
var Secret = getOrPanic("SECRET")
var DbPort = getOrPanic("POSTGRES_PORT")
var DbName = getOrPanic("POSTGRES_NAME")
var DbUser = getOrPanic("POSTGRES_USER")
var DbPass = getOrPanic("POSTGRES_PASS")

func get(key string) string {
	value, _ := os.LookupEnv(key)
	return value
}

func getOrPanic(key string) string {
	value, exists := os.LookupEnv(key)

	if !exists {
		panic(key + "doesn't exists")
	}

	return value
}
