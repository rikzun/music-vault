package core

import "github.com/gin-gonic/gin"

func GetClientID(ctx *gin.Context) uint {
	clientID, exists := ctx.Get("clientID")

	if !exists {
		return 0
	}

	return clientID.(uint)
}
