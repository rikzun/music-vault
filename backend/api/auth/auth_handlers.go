package auth

import (
	"backend/core"
	AuthTokenService "backend/domain/auth_tokens"
	ClientService "backend/domain/clients"
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func EntrySignUp(ctx *gin.Context) {
	var body ClientSignUpBody
	if err := ctx.ShouldBindJSON(&body); err != nil {
		core.SendBindError(ctx, err)
		return
	}

	if client := ClientService.FindByUnique(body.Email, body.Login); client == nil {
		hash, err := utils.HashPassword(body.Password)

		if err != nil {
			ctx.String(http.StatusInternalServerError, err.Error())
			ctx.Abort()
			return
		}

		ip := utils.StringPtrOrNil(ctx.RemoteIP())
		ua := utils.StringPtrOrNil(ctx.GetHeader("User-Agent"))

		client := ClientService.Create(body.Email, body.Login, hash)
		signedToken := AuthTokenService.Create(client.ID, ip, ua)

		ctx.String(http.StatusOK, signedToken)
		return
	}

	ctx.Status(http.StatusConflict)
}

func EntrySignIn(ctx *gin.Context) {
	var body ClientSignInBody
	if err := ctx.ShouldBindJSON(&body); err != nil {
		core.SendBindError(ctx, err)
		return
	}

	client := ClientService.FindByUnique(body.Login, body.Login)

	if client == nil {
		ctx.Status(http.StatusNotFound)
		return
	}

	if utils.ValidatePassword(body.Password, client.Password) {
		ip := utils.StringPtrOrNil(ctx.RemoteIP())
		ua := utils.StringPtrOrNil(ctx.GetHeader("User-Agent"))
		signedToken := AuthTokenService.FindOrCreate(client.ID, ip, ua)

		ctx.String(http.StatusOK, signedToken)
		return
	}

	ctx.Status(http.StatusNotFound)
}
