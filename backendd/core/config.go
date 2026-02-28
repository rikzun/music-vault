package core

import (
	"log/slog"
	"os"
)

type ConfigStruct struct {
	Secret string
	DbHost string
	DbPort string
	DbName string
	DbUser string
	DbPass string
}

func InitConfig() *ConfigStruct {
	return &ConfigStruct{
		Secret: get("SECRET"),
		DbHost: get("POSTGRES_HOST", "database"),
		DbPort: get("POSTGRES_PORT", "5432"),
		DbName: get("POSTGRES_NAME"),
		DbUser: get("POSTGRES_USER"),
		DbPass: get("POSTGRES_PASS"),
	}
}

func get(values ...string) string {
	if len(values) == 1 {
		value, exists := os.LookupEnv(values[0])

		if !exists {
			slog.Error("env parameter " + values[0] + " not found")
			os.Exit(1)
		}

		return value
	}

	value, exists := os.LookupEnv(values[0])

	if !exists {
		return values[1]
	}

	return value
}
