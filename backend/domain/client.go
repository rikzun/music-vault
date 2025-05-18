package domain

import "backend/core"

type ClientEntity struct {
	ID uint `gorm:"column:id; primaryKey"`

	Email    string `gorm:"column:email;    not null; type:text; uniqueIndex"`
	Login    string `gorm:"column:login;    not null; type:text; uniqueIndex"`
	Password string `gorm:"column:password; not null; type:text"`

	AuthTokens []AuthTokenEntity `gorm:"foreignKey:ClientID;references:ID"`
}

func (client *ClientEntity) Delete() error {
	return core.DB.Delete(client).Error
}
