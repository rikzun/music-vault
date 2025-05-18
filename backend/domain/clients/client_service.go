package ClientService

import (
	"backend/core"
	"backend/domain"
)

func FindByUnique(email string, login string) *domain.ClientEntity {
	var client domain.ClientEntity

	result := core.DB.
		Where("email = ? OR login = ?", email, login).
		First(&client)

	if result.Error != nil {
		return nil
	}

	return &client
}

func Create(email string, login string, passwordHash string) *domain.ClientEntity {
	client := domain.ClientEntity{
		Email:    email,
		Login:    login,
		Password: passwordHash,
	}

	core.DB.Create(&client)
	return &client
}
