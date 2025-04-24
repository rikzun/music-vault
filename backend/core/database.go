package core

import (
	"backend/core/config"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Database *gorm.DB

func InitDatabase() {
	var host string
	if config.DevMode {
		host = "localhost"
	} else {
		host = "database"
	}

	dsn := fmt.Sprintf(
		"host=%s port=%s dbname=%s user=%s password=%s sslmode=disable TimeZone=UTC",
		host, config.DbPort, config.DbName, config.DbUser, config.DbPass,
	)

	var err error
	Database, err = gorm.Open(
		postgres.Open(dsn),
		&gorm.Config{},
	)

	if err != nil {
		panic(err)
	}
}
