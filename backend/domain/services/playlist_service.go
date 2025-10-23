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
	var records []*domain.PlaylistTracksEntity

	global.Database().
		Model(&domain.PlaylistTracksEntity{}).
		Where("playlist_id = ?", playlistID).
		Find(&records)

	if len(records) == 0 {
		return []uint{}
	}

	data := make([]uint, 0, len(records))
	for _, record := range records {
		data = append(data, record.TrackID)
	}

	return data
}
