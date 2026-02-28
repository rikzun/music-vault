package services

import (
	"backend/db"
	"backend/db/sqlc"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

func (self *Client) CreateAndGetID(email string, login string, passwordHash string) (int32, bool, error) {
	clientID, err := self.queries.CreateClient(self.context, sqlc.CreateClientParams{
		Email:        email,
		Login:        login,
		PasswordHash: passwordHash,
	})

	if pgErr, ok := err.(*pgconn.PgError); ok {
		if pgErr.Code == db.UniqueViolation {
			return clientID, true, nil
		}
	}

	return clientID, false, err
}

func (self *Client) FindByIdentifier(identifier string) (*sqlc.FindClientByIdentifierRow, bool, error) {
	data, err := self.queries.FindClientByIdentifier(self.context, identifier)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, false, nil
		}

		return nil, false, err
	}

	return &data, true, err
}
