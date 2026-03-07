package client

import (
	"backend/core"
	"backend/models"
	"backend/services"

	"github.com/go-swagno/swagno/v3/components/endpoint"
	"github.com/go-swagno/swagno/v3/components/http/response"
	"github.com/gofiber/fiber/v3"
)

func MeInfo() []endpoint.EndPointOption {
	return []endpoint.EndPointOption{
		endpoint.WithTags("Client"),
		endpoint.WithSuccessfulReturns([]response.Response{
			response.New(models.AuthResponse{}, "200", ""),
		}),
	}
}

func Me(
	ctx fiber.Ctx,
	txFactory core.TxFactory,
	clientServiceFactory *services.ClientFactory,
) error {
	clientID := ctx.Locals("clientID").(int32)
	println(clientID)

	return nil
}
