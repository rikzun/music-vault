package services

import (
	"backend/domain"
	"backend/global"

	"gorm.io/gorm/clause"
)

type clientPlaylist struct{}

var ClientPlaylist = clientPlaylist{}

func (clientPlaylist) Create(playlistID uint, authorID uint) {
	var maxPosition uint

	global.Database().
		Model(&domain.ClientPlaylistsEntity{}).
		Where("client_id = ?", authorID).
		Select("COALESCE(MAX(position), 0)").
		Scan(maxPosition)

	clientPlaylist := domain.ClientPlaylistsEntity{
		ClientID:   authorID,
		PlaylistID: playlistID,
		Position:   maxPosition + 1,
	}

	global.Database().Create(&clientPlaylist)
}

type ClientPlaylistQuery struct {
	ordered      bool
	withPlaylist bool
	withClient   bool
}

func (q *ClientPlaylistQuery) Ordered() *ClientPlaylistQuery {
	q.ordered = true
	return q
}

func (q *ClientPlaylistQuery) WithPlaylist() *ClientPlaylistQuery {
	q.withPlaylist = true
	return q
}

func (q *ClientPlaylistQuery) WithClient() *ClientPlaylistQuery {
	q.withClient = true
	return q
}

func (clientPlaylist) NewQuery() *ClientPlaylistQuery {
	return &ClientPlaylistQuery{}
}

func (q *ClientPlaylistQuery) Build(clientID uint) []*domain.ClientPlaylistsEntity {
	var records []*domain.ClientPlaylistsEntity
	db := global.Database().Where("client_id = ?", clientID)

	if q.withPlaylist {
		db = db.Order(clause.OrderByColumn{Column: clause.Column{Name: "Position"}, Desc: true})
	}
	if q.withPlaylist {
		db = db.Preload("Playlist")
	}
	if q.withClient {
		db = db.Preload("Client")
	}

	db.Find(&records)
	return records
}
