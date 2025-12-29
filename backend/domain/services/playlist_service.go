package services

import (
	"backend/domain"
	"backend/global"
)

type playlist struct{}

var Playlist = playlist{}

func (playlist) Create(
	authorID uint,
	imagePath *string,
	title string,
	variant domain.PlaylistVariant,
) uint {
	playlistRecord := domain.PlaylistEntity{
		AuthorID:  authorID,
		ImagePath: imagePath,
		Title:     title,
		Variant:   variant,
	}

	global.Database().Create(&playlistRecord)
	ClientPlaylist.Create(playlistRecord.ID, authorID)

	return playlistRecord.ID
}

func (playlist) FindByClient(clientID uint) []*domain.PlaylistEntity {
	clientPlaylists := ClientPlaylist.
		NewQuery().
		Ordered().
		WithPlaylist().
		Build(clientID)

	if len(clientPlaylists) == 0 {
		return []*domain.PlaylistEntity{}
	}

	data := make([]*domain.PlaylistEntity, 0, len(clientPlaylists))
	for _, clientPlaylist := range clientPlaylists {
		data = append(data, clientPlaylist.Playlist)
	}

	return data
}

func (playlist) GetTracksIDByID(playlistID uint) []uint {
	var records []uint

	global.Database().
		Model(&domain.PlaylistTracksEntity{}).
		Select("track_id").
		Where("playlist_id = ?", playlistID).
		Pluck("track_id", &records)

	return records
}

func (playlist) GetPlaylistsTracksByID(playlistID uint) []*domain.PlaylistTracksEntity {
	var records []*domain.PlaylistTracksEntity

	global.Database().
		Model(&domain.PlaylistTracksEntity{}).
		Preload("Track").
		Preload("Track.Artists").
		Preload("OriginPlaylist").
		Where("playlist_id = ?", playlistID).
		Find(&records)

	return records
}
