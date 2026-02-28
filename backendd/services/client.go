package services

import (
	"backend/core"
	"backend/db/sqlc"
	"context"
)

type ClientFactory struct {
	queries *sqlc.Queries
}

func NewClientFactory(queries *sqlc.Queries) *ClientFactory {
	return &ClientFactory{
		queries: queries,
	}
}

type Client struct {
	context context.Context
	queries *sqlc.Queries
}

func (self ClientFactory) New(ctx context.Context) *Client {
	return &Client{
		context: ctx,
		queries: self.queries,
	}
}

func (self ClientFactory) WithTx(ctx context.Context, tx *core.Tx) *Client {
	return &Client{
		context: ctx,
		queries: self.queries.WithTx(tx.RawTx),
	}
}
