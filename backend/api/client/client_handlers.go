package client

import (
	"backend/core/custom"
	"net/http"
)

func EntryMe(ctx *custom.Context) {
	client := ctx.Client()

	data := ClientData{
		ID:        client.ID,
		Login:     client.Login,
		AvatarURL: nil,
	}

	ctx.JSON(http.StatusOK, data)
}
