package services

import (
	"backend/core"
	"backend/db/sqlc"
	"context"
)

type AuthTokenFactory struct {
	queries *sqlc.Queries
}

func NewAuthTokenFactory(queries *sqlc.Queries) *AuthTokenFactory {
	return &AuthTokenFactory{
		queries: queries,
	}
}

type AuthToken struct {
	context context.Context
	queries *sqlc.Queries
}

func (self AuthTokenFactory) New(ctx context.Context) *AuthToken {
	return &AuthToken{
		context: ctx,
		queries: self.queries,
	}
}

func (self AuthTokenFactory) WithTx(ctx context.Context, tx *core.Tx) *AuthToken {
	return &AuthToken{
		context: ctx,
		queries: self.queries.WithTx(tx.RawTx),
	}
}
