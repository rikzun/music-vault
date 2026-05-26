package auth_handlers

import (
	"backend/core"
	apierrors "backend/core/api_errors"
	"backend/models"
	"backend/services"
	"backend/utils"

	"github.com/go-swagno/swagno/v3/components/endpoint"
	"github.com/go-swagno/swagno/v3/components/http/response"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/log"
)

func SignUpInfo() []endpoint.EndPointOption {
	return []endpoint.EndPointOption{
		endpoint.WithTags("Auth"),
		endpoint.WithBody(models.AuthSignUpBody{}),
		endpoint.WithSuccessfulReturns([]response.Response{
			response.New(models.AuthResponse{}, "200", "OK"),
			apierrors.ClientUniqueError().Response(),
		}),
	}
}

func SignUp(
	ctx fiber.Ctx,
	txFactory core.TxFactory,
	clientServiceFactory *services.ClientFactory,
	authTokenServiceFactory *services.AuthTokenFactory,
) error {
	var body models.AuthSignUpBody

	if err := ctx.Bind().Body(&body); err != nil {
		log.Error(err)
		return err
	}

	passwordHash, err := utils.Bcrypt.Generate(body.Password)
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

	clientService := clientServiceFactory.WithTx(reqCtx, tx)

	resp, err := clientService.CreateAndGetID(body.Email, body.Login, passwordHash)
	if resp.UniqueViolation {
		return apierrors.ClientUniqueError()
	}
	if err != nil {
		log.Error(err)
		return err
	}

	ip := ctx.IP()
	ua := ctx.UserAgent()

	authTokenService := authTokenServiceFactory.WithTx(reqCtx, tx)
	token, err := authTokenService.Create(resp.ClientID, ip, ua)
	if err != nil {
		log.Error(err)
		return err
	}

	if err := tx.Commit(); err != nil {
		log.Error(err)
		return err
	}

	return ctx.JSON(models.AuthResponse{
		Token: token,
	})
}
