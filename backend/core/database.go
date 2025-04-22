package core

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Database *gorm.DB

func InitDatabase() {
	var err error
	dsn := "host=go_postgres user=dev password=dev dbname=go_db port=5432 sslmode=disable TimeZone=UTC"

	Database, err = gorm.Open(
		postgres.Open(dsn),
		&gorm.Config{},
	)

	if err != nil {
		panic(err)
	}
}
