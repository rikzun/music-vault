package core

import (
	"context"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v3/log"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type DB interface {
	Query(ctx context.Context, sql string, args ...any) (pgx.Rows, error)
	QueryRow(ctx context.Context, sql string, args ...any) pgx.Row
	Exec(ctx context.Context, sql string, args ...any) (pgconn.CommandTag, error)
}

func InitDatabase(config *ConfigStruct) *pgxpool.Pool {
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

func MigrateDB(database *pgxpool.Pool) {
	schema, err := os.ReadFile("db/schema.sql")
	if err != nil {
		return
	}

	ctx := context.Background()
	tx, err := database.Begin(ctx)

	if err != nil {
		log.Error(err)
		return
	}

	if _, err := tx.Exec(ctx, string(schema)); err != nil {
		tx.Rollback(ctx)
		log.Error(err)
		log.Error("migrations was not applied")
		return
	}

	if err := tx.Commit(ctx); err != nil {
		log.Error(err)
		log.Error("migrations was not applied")
		return
	}

	log.Info("migrations was applied")
}
