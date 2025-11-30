package domain

type PlaylistTracksEntity struct {
	PlaylistID       uint  `gorm:"column:playlist_id; primaryKey"`
	TrackID          uint  `gorm:"column:track_id;    not null"`
	OriginPlaylistID *uint `gorm:"column:origin_playlist_id"`

	Playlist       *PlaylistEntity `gorm:"foreignKey:PlaylistID"`
	Track          *TrackEntity    `gorm:"foreignKey:TrackID"`
	OriginPlaylist *PlaylistEntity `gorm:"foreignKey:OriginPlaylistID"`
}

func (PlaylistTracksEntity) TableName() string {
	return "playlist_tracks"
}
