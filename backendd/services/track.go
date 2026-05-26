package services

import (
	"backend/core"
	"errors"

	"github.com/jackc/pgx/v5"
)

type Track struct{ baseService }
type TrackFactory = baseFactory[Track]

func NewTrackFactory(db core.DB) *TrackFactory {
	return newBaseFactory(db, func(b baseService) *Track {
		return &Track{b}
	})
}

//queries

type GetCoverIdByPHashResponse struct {
	ImageID int32
	Found   bool
}

func (self *Track) GetCoverIdByPHash(pHash uint64) (GetCoverIdByPHashResponse, error) {
	query := `
		SELECT id 
		FROM track_covers 
		WHERE bit_count((p_hash # $1)::bit(64)) <= 4 
		LIMIT 1
	`

	var id int32

	err := self.database.QueryRow(self.context, query,
		int64(pHash),
	).Scan(&id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return GetCoverIdByPHashResponse{}, nil
		}

		return GetCoverIdByPHashResponse{}, err
	}

	return GetCoverIdByPHashResponse{
		ImageID: id,
		Found:   true,
	}, nil
}

func (self *Track) CreateCover(path string, pHash uint64) (int32, error) {
	query := `
		INSERT INTO track_covers (path, p_hash)
		VALUES ($1, $2)
		RETURNING id
	`

	var id int32

	err := self.database.QueryRow(self.context, query,
		path, int64(pHash),
	).Scan(&id)

	return id, err
}
