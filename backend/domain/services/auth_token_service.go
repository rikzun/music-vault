package services

import (
	"backend/domain"
	"backend/global"

	"github.com/google/uuid"
)

type authToken struct{}

var AuthToken = authToken{}

func (authToken) Create(clientID uint, ip *string, ua *string) string {
	token := uuid.NewString()

	record := domain.AuthTokenEntity{
		ClientID:  clientID,
		Token:     token,
		IP:        ip,
		UserAgent: ua,
	}

	global.Database().Create(&record)
	return token
}

func (authToken) FindByID(id uint) *domain.AuthTokenEntity {
	var record domain.AuthTokenEntity

	result := global.Database().
		Where("id = ?", id).
		First(&record)

	if result.Error != nil {
		return nil
	}

	return &record
}

func (authToken) FindOneOrCreate(clientID uint, ip *string, ua *string) string {
	if ip == nil {
		return AuthToken.Create(clientID, ip, ua)
	}

	var record domain.AuthTokenEntity

	result := global.Database().
		Where("client_id = ? AND ip = ?", clientID, *ip).
		First(&record)

	if result.Error != nil {
		return AuthToken.Create(clientID, ip, ua)
	}

	return record.Token
}

func (authToken) ValidateAndGetClientID(uuidToken string) uint {
	var record domain.AuthTokenEntity

	result := global.Database().
		Where("token = ?", uuidToken).
		First(&record)

	if result.Error != nil {
		return 0
	}

	return record.ClientID
}
