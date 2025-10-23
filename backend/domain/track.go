package domain

type TrackEntity struct {
	ID         uint    `gorm:"column:id; primaryKey"`
	UploaderID uint    `gorm:"column:uploader_id; not null;"`
	AudioPath  string  `gorm:"column:audio_path;  not null; type:string"`
	ImagePath  *string `gorm:"column:image_path;            type:string"`

	Title    string  `gorm:"column:title;    not null; type:text"`
	Album    *string `gorm:"column:album;              type:text"`
	Codec    string  `gorm:"column:codec;              type:text"`
	Bitrate  uint    `gorm:"column:bitrate;            type:int"`
	Lossless bool    `gorm:"column:lossless; not null; type:bool"`

	Duration float64 `gorm:"column:duration; not null; type:decimal(10,3)"`

	Artists  []*ArtistEntity `gorm:"many2many:track_artists"`
	Uploader *ClientEntity   `gorm:"foreignKey:UploaderID"`
}

func (TrackEntity) TableName() string {
	return "tracks"
}
