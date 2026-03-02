package services

import (
	"backend/core"
	"context"
)

type ClientFactory struct {
	database core.DB
}

func NewClientFactory(database core.DB) *ClientFactory {
	return &ClientFactory{
		database: database,
	}
}

type Client struct {
	context  context.Context
	database core.DB
}

func (self ClientFactory) New(ctx context.Context) *Client {
	return &Client{
		context:  ctx,
		database: self.database,
	}
}

func (self ClientFactory) WithTx(ctx context.Context, tx *core.Tx) *Client {
	return &Client{
		context:  ctx,
		database: tx.RawTx,
	}
}
