package domain

type TrackEntity struct {
	ID uint `gorm:"column:id; primaryKey"`

	Title    string  `gorm:"column:title;    type:text"`
	Album    *string `gorm:"column:album;    type:text"`
	Codec    string  `gorm:"column:codec;    type:text"`
	Bitrate  uint    `gorm:"column:bitrate;  type:int"`
	Lossless bool    `gorm:"column:lossless; type:bool"`

	Artists []*ArtistEntity `gorm:"many2many:track_artists;"`
}

func (TrackEntity) TableName() string {
	return "tracks"
}
