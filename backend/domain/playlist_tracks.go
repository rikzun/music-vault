package domain

type PlaylistTracksEntity struct {
	PlaylistID       uint  `gorm:"column:playlist_id;        primaryKey"`
	TrackID          uint  `gorm:"column:track_id;           primaryKey"`
	OriginPlaylistID *uint `gorm:"column:origin_playlist_id; primaryKey"`

	Playlist       *PlaylistEntity `gorm:"foreignKey:PlaylistID"`
	Track          *TrackEntity    `gorm:"foreignKey:TrackID"`
	OriginPlaylist *PlaylistEntity `gorm:"foreignKey:OriginPlaylistID"`
}

func (PlaylistTracksEntity) TableName() string {
	return "playlist_tracks"
}
