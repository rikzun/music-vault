package ClientService

import "backend/core"

func FindByUnique(email string, login string) (*ClientSchema, bool) {
	var client ClientSchema

	result := core.Database.
		Where("email = ? OR login = ?", email, login).
		First(&client)

	if result.Error != nil {
		return nil, false
	}

	return &client, true
}

func Create(email string, login string, passwordHash string) *ClientSchema {
	client := ClientSchema{
		Email:    email,
		Login:    login,
		Password: passwordHash,
	}

	core.Database.Create(&client)
	return &client
}
