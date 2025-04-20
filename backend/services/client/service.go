package ClientService

import (
	"backend/core"
	"backend/schema"
)

func FindByUnique(email string, login string) *schema.Client {
	var client schema.Client

	result := core.Database.
		Where("email = ? OR login = ?", email, login).
		First(&client)

	if result.Error != nil {
		return nil
	}

	return &client
}

func Create(email string, login string, passwordHash string) *schema.Client {
	client := schema.Client{
		Email:    email,
		Login:    login,
		Password: passwordHash,
	}

	core.Database.Create(&client)
	return &client
}
