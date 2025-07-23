package TrackService

import (
	"backend/core"
	"backend/domain"
	"errors"

	"gorm.io/gorm"
)

func Create(title string, artists []string, album *string, codec string, bitrate uint, lossless bool) uint {
	var artistEntities []*domain.ArtistEntity

	for _, name := range artists {
		var artist domain.ArtistEntity
		result := core.DB.Where("name = ?", name).First(&artist)
		if result.Error != nil {
			if errors.Is(result.Error, gorm.ErrRecordNotFound) {
				artist = domain.ArtistEntity{Name: name}
				core.DB.Create(&artist)
			} else {
				panic(result.Error)
			}
		}
		artistEntities = append(artistEntities, &artist)
	}

	record := domain.TrackEntity{
		Title:    title,
		Album:    album,
		Codec:    codec,
		Bitrate:  bitrate,
		Lossless: lossless,
		Artists:  artistEntities,
	}

	core.DB.Create(&record)
	return record.ID
}
