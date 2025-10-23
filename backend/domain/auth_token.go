package domain

import "time"

type AuthTokenEntity struct {
	ID uint `gorm:"column:id; primaryKey"`

	ClientID  uint      `gorm:"column:client_id; not null; index; constraint:OnDelete:CASCADE"`
	Token     string    `gorm:"column:token;      type:text; not null; uniqueIndex"`
	IP        *string   `gorm:"column:ip;         type:text"`
	UserAgent *string   `gorm:"column:user_agent; type:text"`
	CreatedAt time.Time `gorm:"column:created_at; not null; autoCreateTime"`

	Client *ClientEntity `gorm:"foreignKey:ClientID"`
}

func (AuthTokenEntity) TableName() string {
	return "auth_tokens"
}
