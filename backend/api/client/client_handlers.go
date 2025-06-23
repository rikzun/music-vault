package client

import (
	"backend/core"
	ClientService "backend/domain/clients"
	"net/http"

	"github.com/gin-gonic/gin"
)

func EntryMe(ctx *gin.Context) {
	clientID := core.GetClientID(ctx)
	client := ClientService.FindByID(clientID)

	data := ClientData{
		ID:        client.ID,
		Login:     client.Login,
		AvatarURL: nil,
	}

	ctx.JSON(http.StatusOK, data)
}
