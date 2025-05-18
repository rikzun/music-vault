package middleware

import (
	AuthTokensService "backend/domain/auth_tokens"
	"net/http"

	"github.com/gin-gonic/gin"
)

var Authorization = func(ctx *gin.Context) {
	authToken := ctx.GetHeader("Authorization")

	if authToken == "" {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	clientID := AuthTokensService.ValidateAndGetID(authToken)

	if clientID == 0 {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	ctx.Set("clientID", clientID)
	ctx.Next()
}
