package jwt

import (
	"github.com/golang-jwt/jwt/v5"
)

var secret string = "1"

func CreateToken(clientID uint) string {
	token := jwt.NewWithClaims(
		jwt.SigningMethodHS512,
		jwt.MapClaims{"id": clientID},
	)

	jwtToken, _ := token.SignedString(secret)
	return jwtToken
}

func ValidateToken(jwtToken string) uint {
	var claims jwt.MapClaims

	token, err := jwt.ParseWithClaims(jwtToken, &claims,
		func(token *jwt.Token) (any, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrTokenSignatureInvalid
			}

			return secret, nil
		},
	)

	if err != nil || !token.Valid {
		return 0
	}

	if id, ok := claims["id"].(uint); ok {
		return id
	}

	return 0
}
