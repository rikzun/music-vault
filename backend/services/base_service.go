package services

import (
	"backend/core"
	"context"
)

type baseService struct {
	context  context.Context
	database core.DB
}

type baseFactory[T any] struct {
	database core.DB
	create   func(baseService) *T
}

func newBaseFactory[T any](database core.DB, create func(baseService) *T) *baseFactory[T] {
	return &baseFactory[T]{
		database: database,
		create:   create,
	}
}

func (f *baseFactory[T]) New(ctx context.Context) *T {
	return f.create(baseService{
		context:  ctx,
		database: f.database,
	})
}

func (f *baseFactory[T]) WithTx(ctx context.Context, tx *core.Tx) *T {
	return f.create(baseService{
		context:  ctx,
		database: tx.RawTx,
	})
}
