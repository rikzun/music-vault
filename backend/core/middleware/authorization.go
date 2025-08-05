package middleware

import (
	"backend/domain/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

var Authorization = func(ctx *gin.Context) {
	authToken := ctx.GetHeader("Authorization")

	if authToken == "" {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	clientID := services.AuthToken.
		ValidateAndGetClientID(authToken)

	if clientID == 0 {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	ctx.Set("clientID", clientID)
	ctx.Next()
}
