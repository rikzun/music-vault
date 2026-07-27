package services

import (
	"backend/core"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type AuthToken struct{ baseService }
type AuthTokenFactory = baseFactory[AuthToken]

func NewAuthTokenFactory(db core.DB) *AuthTokenFactory {
	return newBaseFactory(db, func(b baseService) *AuthToken {
		return &AuthToken{b}
	})
}

//queries

func (self *AuthToken) Create(clientID int32, ip string, ua string) (string, error) {
	token := uuid.New()

	query := `
		INSERT INTO auth_tokens (client_id, token, ip, user_agent)
		VALUES ($1, $2, $3, $4)
	`

	_, err := self.database.Exec(self.context, query,
		clientID, token, ip, ua,
	)

	return token.String(), err
}

func (self *AuthToken) FindOrCreate(clientID int32, ip string, ua string) (string, error) {
	query := `
		SELECT token
		FROM auth_tokens
		WHERE client_id = $1 AND (ip = $2 OR user_agent = $3)
	`

	var token string

	err := self.database.QueryRow(self.context, query,
		clientID, ip, ua,
	).Scan(&token)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			token, err := self.Create(clientID, ip, ua)

			if err != nil {
				return "", err
			}

			return token, nil
		}

		return "", err
	}

	return token, nil
}

type FindOrCreateResponse struct {
	ClientID int32
	Found    bool
}

func (self *AuthToken) FindClientID(token string) (FindOrCreateResponse, error) {
	query := `
		SELECT client_id
		FROM auth_tokens
		WHERE token = $1
	`

	var clientID int32

	err := self.database.QueryRow(self.context, query,
		token,
	).Scan(&clientID)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return FindOrCreateResponse{}, nil
		}

		return FindOrCreateResponse{}, err
	}

	return FindOrCreateResponse{
		ClientID: clientID,
		Found:    true,
	}, nil
}
