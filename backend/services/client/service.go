package ClientService

import "backend/core"

// returns true if client was found
func FindByUnique(email string, login string) (rtClient *ClientSchema, rtFound bool) {
	var client ClientSchema

	result := core.Database.
		Where("email = ? OR login = ?", email, login).
		First(&client)

	if result.Error != nil {
		rtClient = nil
		rtFound = false
		return
	}

	rtClient = &client
	rtFound = true
	return
}

func Create(email string, login string, passwordHash string) (rtClient *ClientSchema) {
	client := ClientSchema{
		Email:    email,
		Login:    login,
		Password: passwordHash,
	}

	core.Database.Create(&client)
	rtClient = &client
	return
}
