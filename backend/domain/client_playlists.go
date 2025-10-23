package domain

type ClientPlaylistsEntity struct {
	PlaylistID uint `gorm:"column:playlist_id; primaryKey;        constraint:OnDelete:CASCADE"`
	ClientID   uint `gorm:"column:client_id;   primaryKey; index; constraint:OnDelete:CASCADE"`
	Position   uint `gorm:"column:position;                index"`

	Playlist *PlaylistEntity `gorm:"foreignKey:PlaylistID"`
	Client   *ClientEntity   `gorm:"foreignKey:ClientID"`
}

func (ClientPlaylistsEntity) TableName() string {
	return "client_playlists"
}
