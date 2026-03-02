package services

import (
	"backend/core"
	"context"
)

type AuthTokenFactory struct {
	database core.DB
}

func NewAuthTokenFactory(database core.DB) *AuthTokenFactory {
	return &AuthTokenFactory{
		database: database,
	}
}

type AuthToken struct {
	context  context.Context
	database core.DB
}

func (self AuthTokenFactory) New(ctx context.Context) *AuthToken {
	return &AuthToken{
		context:  ctx,
		database: self.database,
	}
}

func (self AuthTokenFactory) WithTx(ctx context.Context, tx *core.Tx) *AuthToken {
	return &AuthToken{
		context:  ctx,
		database: tx.RawTx,
	}
}
