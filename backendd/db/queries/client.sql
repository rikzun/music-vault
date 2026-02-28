-- name: CreateClient :one
INSERT INTO clients (email, login, password_hash)
VALUES ($1, $2, $3)
RETURNING id;

-- name: FindClientByIdentifier :one
SELECT
    id as client_id,
    password_hash
FROM clients
WHERE login = $1 OR email = $1
LIMIT 1;