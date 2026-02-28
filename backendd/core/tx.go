package core

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type TxFactory struct {
	database *pgxpool.Pool
}

func NewTxFactory(database *pgxpool.Pool) *TxFactory {
	return &TxFactory{
		database: database,
	}
}

type Tx struct {
	RawTx pgx.Tx
	ctx   context.Context
}

func (self TxFactory) Begin(ctx context.Context) (*Tx, error) {
	tx, err := self.database.Begin(ctx)
	if err != nil {
		return nil, err
	}

	txwrapper := Tx{
		RawTx: tx,
		ctx:   ctx,
	}

	return &txwrapper, nil
}

func (self Tx) Commit() error {
	return self.RawTx.Commit(self.ctx)
}

func (self Tx) Rollback() error {
	return self.RawTx.Rollback(self.ctx)
}
