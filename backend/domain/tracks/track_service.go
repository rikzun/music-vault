package TrackService

import (
	"backend/core"
	"backend/domain"
)

func Create(title string, author string, codec string, bitrate uint, fileName string) uint {
	record := domain.TrackEntity{
		Title:    title,
		Author:   author,
		Codec:    codec,
		Bitrate:  bitrate,
		FileName: fileName,
	}

	core.DB.Create(&record)
	return record.ID
}
