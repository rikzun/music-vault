package services

import (
	"backend/db/sqlc"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

func (self *AuthToken) Create(clientID int32, ip string, ua string) (string, error) {
	token := uuid.New()

	err := self.queries.CreateAuthToken(self.context, sqlc.CreateAuthTokenParams{
		ClientID:  clientID,
		Token:     pgtype.UUID{Bytes: token, Valid: true},
		Ip:        ip,
		UserAgent: pgtype.Text{String: ua, Valid: true},
	})

	return token.String(), err
}

func (self *AuthToken) FindOrCreate(clientID int32, ip string, ua string) (string, error) {
	token, err := self.queries.FindAuthToken(self.context, sqlc.FindAuthTokenParams{
		ClientID:  clientID,
		Ip:        ip,
		UserAgent: pgtype.Text{String: ua, Valid: true},
	})

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

	return token.String(), nil
}
