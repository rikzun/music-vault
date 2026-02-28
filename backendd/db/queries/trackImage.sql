-- name: CreateTrackImage :one
INSERT INTO track_images (path, hash, tracks_count)
VALUES ($1, $2, 0)
RETURNING id;