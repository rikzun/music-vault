package global

import "os"

type configStruct struct {
	Secret string
	DbPort string
	DbName string
	DbUser string
	DbPass string
}

var config = configStruct{
	Secret: getOrPanic("SECRET"),
	DbPort: "5432",
	DbName: getOrPanic("POSTGRES_NAME"),
	DbUser: getOrPanic("POSTGRES_USER"),
	DbPass: getOrPanic("POSTGRES_PASS"),
}

func Config() configStruct {
	return config
}

func get(key string, orElse string) string {
	value, exists := os.LookupEnv(key)

	if !exists {
		return orElse
	}

	return value
}

func getOrPanic(key string) string {
	value, exists := os.LookupEnv(key)

	if !exists {
		panic("env parameter " + key + " not found")
	}

	return value
}
