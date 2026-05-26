package client

import (
	"backend/core"
	"backend/models"
	"backend/services"

	"github.com/go-swagno/swagno/v3/components/endpoint"
	"github.com/go-swagno/swagno/v3/components/http/response"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/log"
)

func MeInfo() []endpoint.EndPointOption {
	return []endpoint.EndPointOption{
		endpoint.WithTags("Client"),
		endpoint.WithSuccessfulReturns([]response.Response{
			response.New(models.ClientMeResponse{}, "200", "OK"),
		}),
	}
}

func Me(
	ctx fiber.Ctx,
	txFactory core.TxFactory,
	clientServiceFactory *services.ClientFactory,
) error {
	clientID := ctx.Locals("clientID").(int32)

	reqCtx := ctx.Context()
	tx, err := txFactory.Begin(reqCtx)

	if err != nil {
		log.Error(err)
		return err
	}
	defer tx.Rollback()

	clientService := clientServiceFactory.WithTx(reqCtx, tx)
	resp, err := clientService.FindByID(clientID)

	if err != nil {
		log.Error(err)
		return err
	}

	return ctx.JSON(models.ClientMeResponse{
		Id:        clientID,
		Login:     resp.Login,
		AvatarURL: nil,
	})
}
