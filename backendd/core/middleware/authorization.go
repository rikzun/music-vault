package middleware

import (
	"backend/services"

	"github.com/gofiber/fiber/v3"
)

func Authorization(authTokenServiceFactory *services.AuthTokenFactory) func(ctx fiber.Ctx) error {
	return func(ctx fiber.Ctx) error {
		token := ctx.Get("Authorization")

		if token == "" {
			return ctx.SendStatus(fiber.StatusUnauthorized)
		}

		authTokenService := authTokenServiceFactory.New(ctx.Context())
		res, err := authTokenService.FindClientID(token)

		if err != nil {
			return err
		}

		if !res.Found {
			return ctx.SendStatus(fiber.StatusUnauthorized)
		}

		ctx.Locals("clientID", res.ClientID)
		return ctx.Next()
	}
}
