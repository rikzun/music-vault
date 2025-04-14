package auth

import (
	ClientService "backend/services/client"
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func EntrySignUp(ctx *gin.Context) {
	var body ClientSignBody
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	if _, found := ClientService.FindByLogin(body.Login); !found {
		hash, err := utils.HashPassword(body.Password)

		if err != nil {
			ctx.AbortWithError(http.StatusInternalServerError, err)
			return
		}

		ClientService.Create(body.Login, hash)
		ctx.Status(http.StatusOK)
		return
	}

	ctx.Status(http.StatusBadRequest)
}

func EntrySignIn(ctx *gin.Context) {
	var body ClientSignBody
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	client, found := ClientService.FindByLogin(body.Login)

	if !found {
		ctx.Status(http.StatusNotFound)
		return
	}

	if utils.ValidatePassword(body.Password, client.Password) {
		ctx.Status(http.StatusOK)
		return
	}

	ctx.Status(http.StatusNotFound)
}
