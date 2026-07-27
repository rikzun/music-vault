package db

import (
	"context"
	_ "embed"

	"github.com/gofiber/fiber/v3/log"
	"github.com/jackc/pgx/v5/pgxpool"
)

//go:embed schema.sql
var dbSchema string

func MigrateDB(database *pgxpool.Pool) {
	ctx := context.Background()
	tx, err := database.Begin(ctx)

	if err != nil {
		log.Error(err)
		return
	}

	if _, err := tx.Exec(ctx, dbSchema); err != nil {
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
