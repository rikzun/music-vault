package core

import (
	"context"
	"fmt"
	"log/slog"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func InitDatabase(config *ConfigStruct) *pgxpool.Pool {
	connString := fmt.Sprintf(
		"host=%s port=%s dbname=%s user=%s password=%s sslmode=disable TimeZone=UTC",
		config.DbHost, config.DbPort, config.DbName, config.DbUser, config.DbPass,
	)

	database, err := pgxpool.New(context.Background(), connString)
	if err != nil {
		slog.Error("wrong connection string format")
		os.Exit(1)
	}

	if err := database.Ping(context.Background()); err != nil {
		slog.Error("no response from database")
		os.Exit(1)
	}

	return database
}

func MigrateDB(database *pgxpool.Pool) {
	schema, err := os.ReadFile("db/schema.sql")
	if err != nil {
		return
	}

	ctx := context.Background()
	tx, err := database.Begin(ctx)
	if err != nil {
		slog.Warn("migration was not applied")
		return
	}

	if _, err := tx.Exec(ctx, string(schema)); err != nil {
		tx.Rollback(ctx)
		slog.Warn("migration was not applied")
		return
	}

	if err := tx.Commit(ctx); err != nil {
		slog.Info("migration was applied")
		return
	}
}
