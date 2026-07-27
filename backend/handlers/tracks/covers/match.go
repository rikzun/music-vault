package track_covers_handlers

import (
	"backend/core"
	"backend/models"
	"backend/services"
	"strconv"

	"github.com/go-swagno/swagno/v3/components/endpoint"
	"github.com/go-swagno/swagno/v3/components/http/response"
	"github.com/go-swagno/swagno/v3/components/parameter"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/log"
)

func MatchInfo() []endpoint.EndPointOption {
	return []endpoint.EndPointOption{
		endpoint.WithTags("Track"),
		endpoint.WithParams(
			parameter.StrParam("pHash", parameter.Query, parameter.WithRequired()),
		),
		endpoint.WithSuccessfulReturns([]response.Response{
			response.New(models.ID{}, "200", "OK"),
			response.New(models.Empty{}, "404", "Not Found"),
		}),
	}
}

func Match(
	ctx fiber.Ctx,
	txFactory core.TxFactory,
	trackServiceFactory *services.TrackFactory,
) error {
	pHashStr := ctx.Query("pHash")
	if pHashStr == "" {
		return fiber.ErrBadRequest
	}

	var pHash uint64
	pHash, err := strconv.ParseUint(pHashStr, 10, 64)
	if err != nil {
		log.Error(err)
		return err
	}

	reqCtx := ctx.Context()
	tx, err := txFactory.Begin(reqCtx)

	if err != nil {
		log.Error(err)
		return err
	}
	defer tx.Rollback()

	trackService := trackServiceFactory.WithTx(reqCtx, tx)
	res, err := trackService.GetCoverIdByPHash(pHash)

	if err != nil {
		log.Error(err)
		return err
	}

	if !res.Found {
		return ctx.SendStatus(fiber.StatusNotFound)
	}

	if err := tx.Commit(); err != nil {
		log.Error(err)
		return err
	}

	return ctx.JSON(models.ID{
		Id: res.ImageID,
	})
}
