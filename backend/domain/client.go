package domain

import "backend/global"

type ClientEntity struct {
	ID uint `gorm:"column:id; primaryKey"`

	Email    string `gorm:"column:email;    not null; type:text; uniqueIndex"`
	Login    string `gorm:"column:login;    not null; type:text; uniqueIndex"`
	Password string `gorm:"column:password; not null; type:text"`

	AuthTokens []AuthTokenEntity `gorm:"foreignKey:ClientID; references:ID"`
}

func (ClientEntity) TableName() string {
	return "clients"
}

func (client *ClientEntity) Delete() error {
	return global.Database().Delete(client).Error
}
