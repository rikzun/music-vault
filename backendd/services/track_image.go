package services

import (
	"backend/core"
	"backend/db/sqlc"
	"context"
)

type TrackImageFactory struct {
	queries *sqlc.Queries
}

func NewTrackImageFactory(queries *sqlc.Queries) *TrackImageFactory {
	return &TrackImageFactory{
		queries: queries,
	}
}

type TrackImage struct {
	context context.Context
	queries *sqlc.Queries
}

func (self TrackImageFactory) New(ctx context.Context) *TrackImage {
	return &TrackImage{
		context: ctx,
		queries: self.queries,
	}
}

func (self TrackImageFactory) WithTx(ctx context.Context, tx *core.Tx) *TrackImage {
	return &TrackImage{
		context: ctx,
		queries: self.queries.WithTx(tx.RawTx),
	}
}
