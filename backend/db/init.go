package db

import (
	"backend/core"
	"context"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v3/log"
	"github.com/jackc/pgx/v5/pgxpool"
)

func InitDatabase(config *core.ConfigStruct) *pgxpool.Pool {
	connString := fmt.Sprintf(
		"host=%s port=%s dbname=%s user=%s password=%s sslmode=disable TimeZone=UTC",
		config.DbHost, config.DbPort, config.DbName, config.DbUser, config.DbPass,
	)

	database, err := pgxpool.New(context.Background(), connString)
	if err != nil {
		log.Error("wrong connection string format")
		os.Exit(1)
	}

	if err := database.Ping(context.Background()); err != nil {
		log.Error("no response from database")
		os.Exit(1)
	}

	return database
}
