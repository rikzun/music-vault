package services

import "backend/db/sqlc"

func (self *TrackImage) Create(path string, hash string) (int32, error) {
	return self.queries.CreateTrackImage(self.context, sqlc.CreateTrackImageParams{
		Path: path,
		Hash: hash,
	})
}
