package core

import "os"

type ConfigStruct struct {
	DevMode bool
	Secret  string
	DbPort  string
	DbName  string
	DbUser  string
	DbPass  string
}

var Config = ConfigStruct{
	DevMode: get("DEV_MODE") == "true",
	Secret:  getOrPanic("SECRET"),
	DbPort:  "5432",
	DbName:  getOrPanic("POSTGRES_NAME"),
	DbUser:  getOrPanic("POSTGRES_USER"),
	DbPass:  getOrPanic("POSTGRES_PASS"),
}

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
