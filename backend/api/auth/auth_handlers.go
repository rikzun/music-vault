package auth

import (
	"backend/core/custom"
	"backend/domain/services"
	"backend/utils"
	"net/http"
)

func EntrySignUp(ctx *custom.Context) {
	var body ClientSignUpBody
	if !ctx.RequireBindJSON(&body) {
		return
	}

	if services.Client.ExistsByUnique(body.Email, body.Login) {
		ctx.Status(http.StatusConflict)
		return
	}

	passwordHash, err := utils.HashPassword(body.Password)
	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ip := ctx.RemoteAddressPtr()
	ua := ctx.GetHeaderPtr("User-Agent")

	client := services.Client.Create(body.Email, body.Login, passwordHash)
	token := services.AuthToken.Create(client.ID, ip, ua)

	ctx.JSON(http.StatusOK, ClientTokenResponse{token})
}

func EntrySignIn(ctx *custom.Context) {
	var body ClientSignInBody
	if !ctx.RequireBindJSON(&body) {
		return
	}

	client := services.Client.FindOneByUnique(body.Login)
	if client == nil {
		ctx.Status(http.StatusNotFound)
		return
	}

	if utils.ValidatePassword(body.Password, client.Password) {
		ip := ctx.RemoteAddressPtr()
		ua := ctx.GetHeaderPtr("User-Agent")
		token := services.AuthToken.FindOneOrCreate(client.ID, ip, ua)

		ctx.JSON(http.StatusOK, ClientTokenResponse{token})
		return
	}

	ctx.Status(http.StatusNotFound)
}
