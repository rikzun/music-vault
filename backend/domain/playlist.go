package domain

type PlaylistEntity struct {
	ID        uint    `gorm:"column:id; primaryKey"`
	AuthorID  uint    `gorm:"column:author_id; not null; index; constraint:OnDelete:CASCADE"`
	ImagePath *string `gorm:"column:image_path; type:text"`

	Title   string          `gorm:"column:title;   not null; type:text"`
	Variant PlaylistVariant `gorm:"column:variant; not null; type:integer"`

	Author *ClientEntity `gorm:"foreignKey:AuthorID"`
}

type PlaylistVariant int

const (
	PlaylistVariantDefault PlaylistVariant = iota
	PlaylistVariantLinked
	PlaylistVariantDynamic
)

func (PlaylistEntity) TableName() string {
	return "playlists"
}
