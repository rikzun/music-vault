package core

import "os"

type ConfigStruct struct {
	Secret string
	DbPort string
	DbName string
	DbUser string
	DbPass string
}

var Config = ConfigStruct{
	Secret: getOrPanic("SECRET"),
	DbPort: "5432",
	DbName: getOrPanic("POSTGRES_NAME"),
	DbUser: getOrPanic("POSTGRES_USER"),
	DbPass: getOrPanic("POSTGRES_PASS"),
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
