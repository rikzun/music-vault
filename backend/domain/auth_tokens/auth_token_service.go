package AuthTokensService

import (
	"backend/core"
	"backend/domain"

	"github.com/google/uuid"
)

func Create(clientID uint, ip *string, ua *string) string {
	uuidToken := uuid.NewString()

	record := domain.AuthTokenEntity{
		ClientID:  clientID,
		Token:     uuidToken,
		IP:        ip,
		UserAgent: ua,
	}

	core.DB.Create(&record)

	return uuidToken
}

func FindOrCreate(clientID uint, ip *string, ua *string) string {
	if ip == nil {
		return Create(clientID, ip, ua)
	}

	var record domain.AuthTokenEntity

	result := core.DB.
		Where("client_id = ? AND ip = ?", clientID, *ip).
		First(&record)

	if result.Error != nil {
		return Create(clientID, ip, ua)
	}

	return record.Token
}

func ValidateAndGetID(uuidToken string) uint {
	var record domain.AuthTokenEntity

	result := core.DB.
		Where("token = ?", uuidToken).
		First(&record)

	if result.Error != nil {
		return 0
	}

	return record.ID
}
