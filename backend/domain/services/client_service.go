package services

import (
	"backend/domain"
	"backend/global"
)

type client struct{}

var Client = client{}

func (client) Create(email string, login string, passwordHash string) *domain.ClientEntity {
	client := domain.ClientEntity{
		Email:    email,
		Login:    login,
		Password: passwordHash,
	}

	global.Database().
		Create(&client)

	return &client
}

func (client) FindByID(id uint) *domain.ClientEntity {
	var record domain.ClientEntity

	result := global.Database().
		Where("id = ?", id).
		First(&record)

	if result.Error != nil {
		return nil
	}

	return &record
}

func (client) FindOneByUnique(emailOrLogin string) *domain.ClientEntity {
	var client domain.ClientEntity

	result := global.Database().
		Where("email = ? OR login = ?", emailOrLogin, emailOrLogin).
		First(&client)

	if result.Error != nil {
		return nil
	}

	return &client
}

func (client) ExistsByUnique(email string, login string) bool {
	var count int64

	global.Database().
		Model(&domain.ClientEntity{}).
		Where("email = ? OR login = ?", email, login).
		Limit(1).
		Count(&count)

	return count > 0
}
