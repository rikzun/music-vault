package core

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDatabase() {
	var host string
	if Config.DevMode {
		host = "localhost"
	} else {
		host = "database"
	}

	dsn := fmt.Sprintf(
		"host=%s port=%s dbname=%s user=%s password=%s sslmode=disable TimeZone=UTC",
		host, Config.DbPort, Config.DbName, Config.DbUser, Config.DbPass,
	)

	var err error
	DB, err = gorm.Open(
		postgres.Open(dsn),
		&gorm.Config{},
	)

	if err != nil {
		panic(err)
	}
}
