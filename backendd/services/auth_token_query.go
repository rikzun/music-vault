package services

import (
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

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
