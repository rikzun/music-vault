package services

import (
	"backend/domain"
	"backend/global"
	"errors"

	"gorm.io/gorm"
)

type track struct{}

var Track = track{}

func (track) Create(
	uploaderID uint,
	audioPath string,
	imagePath *string,
	title string,
	artists []string,
	album *string,
	codec string,
	bitrate uint,
	lossless bool,
) uint {
	var artistEntities []*domain.ArtistEntity

	for _, name := range artists {
		var artist domain.ArtistEntity
		result := global.Database().Where("name = ?", name).First(&artist)
		if result.Error != nil {
			if errors.Is(result.Error, gorm.ErrRecordNotFound) {
				artist = domain.ArtistEntity{Name: name}
				global.Database().Create(&artist)
			} else {
				panic(result.Error)
			}
		}
		artistEntities = append(artistEntities, &artist)
	}

	record := domain.TrackEntity{
		UploaderID: uploaderID,
		AudioPath:  audioPath,
		ImagePath:  imagePath,
		Title:      title,
		Album:      album,
		Codec:      codec,
		Bitrate:    bitrate,
		Lossless:   lossless,
		Artists:    artistEntities,
	}

	global.Database().Create(&record)
	return record.ID
}

func (track) FindByID(id uint) *domain.TrackEntity {
	var record domain.TrackEntity

	result := global.Database().
		Where("id = ?", id).
		First(&record)

	if result.Error != nil {
		return nil
	}

	return &record
}

func (track) FindByClient(clientID uint) []*domain.TrackEntity {
	var records []*domain.TrackEntity

	result := global.Database().
		Where("uploader_id = ?", clientID).
		Find(&records)

	if result.Error != nil {
		return nil
	}

	return records
}
