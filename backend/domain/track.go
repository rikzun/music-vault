package domain

type TrackEntity struct {
	ID uint `gorm:"column:id; primaryKey"`

	Title    string `gorm:"column:title;    not null; type:text"`
	Author   string `gorm:"column:author;   not null; type:text"`
	Codec    string `gorm:"column:codec;    not null; type:text"`
	Bitrate  uint   `gorm:"column:bitrate;  not null; type:int"`
	FileName string `gorm:"column:fileName; not null; type:text"`
}

func (TrackEntity) TableName() string {
	return "tracks"
}
