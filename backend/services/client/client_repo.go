package ClientService

import "backend/modules"

// returns true if client was found
func FindByLogin(login string) (*ClientSchema, bool) {
	var client ClientSchema
	result := modules.Database.Where("login = ?", login).First(&client)

	if result.Error != nil {
		return nil, false
	}

	return &client, true
}

func Create(login string, passwordHash string) *ClientSchema {
	client := ClientSchema{
		Login:    login,
		Password: passwordHash,
	}

	modules.Database.Create(&client)
	return &client
}
