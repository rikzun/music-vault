package services

import (
	"backend/db"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

type CreateAndGetIDResponse struct {
	ClientID        int32
	UniqueViolation bool
}

func (self *Client) CreateAndGetID(email string, login string, passwordHash string) (CreateAndGetIDResponse, error) {
	query := `
		INSERT INTO clients (email, login, password_hash)
		VALUES ($1, $2, $3)
		RETURNING id
	`
	var clientID int32

	err := self.database.QueryRow(self.context, query,
		email, login, passwordHash,
	).Scan(&clientID)

	if err != nil {
		if pgErr, ok := err.(*pgconn.PgError); ok {
			if pgErr.Code == db.UniqueViolation {
				return CreateAndGetIDResponse{
					UniqueViolation: true,
				}, nil
			}
		}

		return CreateAndGetIDResponse{}, err
	}

	return CreateAndGetIDResponse{
		ClientID: clientID,
	}, nil
}

type FindByIdentifierResponse struct {
	ClientID     int32
	PasswordHash string
	Found        bool
}

func (self *Client) FindByIdentifier(identifier string) (FindByIdentifierResponse, error) {
	query := `
		SELECT
			id,
			password_hash
		FROM clients
		WHERE login = $1 OR email = $1
		LIMIT 1;
	`

	var clientID int32
	var passwordHash string

	err := self.database.QueryRow(self.context, query,
		identifier,
	).Scan(&clientID, &passwordHash)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return FindByIdentifierResponse{}, nil
		}

		return FindByIdentifierResponse{}, err
	}

	return FindByIdentifierResponse{
		ClientID:     clientID,
		PasswordHash: passwordHash,
		Found:        true,
	}, nil
}
