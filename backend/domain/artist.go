package domain

type ArtistEntity struct {
	ID   uint   `gorm:"column:id; primaryKey"`
	Name string `gorm:"column:name; type:text"`

	Tracks []*TrackEntity `gorm:"many2many:track_artists;"`
}

func (ArtistEntity) TableName() string {
	return "artists"
}
