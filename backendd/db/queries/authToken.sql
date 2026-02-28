-- name: CreateAuthToken :exec
INSERT INTO auth_tokens (client_id, token, ip, user_agent, created_at)
VALUES ($1, $2, $3, $4, NOW());

-- name: FindAuthToken :one
SELECT token
FROM auth_tokens
WHERE client_id = $1 AND (ip = $2 OR user_agent = $3);