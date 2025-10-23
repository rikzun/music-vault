package domain

type PlaylistTracksEntity struct {
	PlaylistID uint  `gorm:"column:playlist_id; primaryKey"`
	TrackID    uint  `gorm:"column:track_id;    primaryKey"`
	OriginID   *uint `gorm:"column:origin_id;   primaryKey"`

	Playlist *PlaylistEntity `gorm:"foreignKey:PlaylistID"`
	Track    *TrackEntity    `gorm:"foreignKey:TrackID"`
	Origin   *PlaylistEntity `gorm:"foreignKey:OriginID"`
}

func (PlaylistTracksEntity) TableName() string {
	return "playlist_tracks"
}
