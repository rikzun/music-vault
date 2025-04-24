package AuthTokenService

import (
	"backend/core"
	"backend/core/config"
	"backend/schema"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/base64"

	"github.com/google/uuid"
)

func Create(clientID uint, ip *string, ua *string) string {
	uuidToken := uuid.NewString()

	mac := hmac.New(sha512.New, []byte(config.Secret))
	mac.Write([]byte(uuidToken))

	signedToken := mac.Sum(nil)
	signedTokenBase64 := base64.StdEncoding.EncodeToString(signedToken)

	record := schema.AuthToken{
		ClientID:  clientID,
		Token:     signedTokenBase64,
		IP:        ip,
		UserAgent: ua,
	}

	core.Database.Create(&record)
	return signedTokenBase64
}

func FindOrCreate(clientID uint, ip *string, ua *string) string {
	if ip == nil {
		return Create(clientID, ip, ua)
	}

	var record schema.AuthToken

	result := core.Database.
		Where("client_id = ? AND ip = ?", clientID, *ip).
		First(&record)

	if result.Error != nil {
		return Create(clientID, ip, ua)
	}

	return record.Token
}

// func ValidateToken(signedToken string) bool {
// 	expectedToken, err := base64.StdEncoding.DecodeString(signedToken)
// 	if err != nil {
// 		return false
// 	}

// 	mac := hmac.New(sha512.New, secret)
// 	mac.Write([]byte(outToken))
// 	computedSig := mac.Sum(nil)

// 	return hmac.Equal(computedSig, expectedToken)
// }
