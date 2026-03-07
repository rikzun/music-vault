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
)

func SignInInfo() []endpoint.EndPointOption {
	return []endpoint.EndPointOption{
		endpoint.WithTags("Auth"),
		endpoint.WithBody(models.AuthSignInBody{}),
		endpoint.WithSuccessfulReturns([]response.Response{
			response.New(models.AuthResponse{}, "200", "OK"),
			apierrors.ClientNotFound().Response(),
			apierrors.ClientPasswordMismatch().Response(),
		}),
	}
}

func SignIn(
	ctx fiber.Ctx,
	txFactory core.TxFactory,
	clientServiceFactory *services.ClientFactory,
	authTokenServiceFactory *services.AuthTokenFactory,
) error {
	var body models.AuthSignInBody

	if err := ctx.Bind().Body(&body); err != nil {
		return err
	}

	reqCtx := ctx.Context()
	tx, err := txFactory.Begin(reqCtx)

	if err != nil {
		return err
	}
	defer tx.Rollback()

	clientService := clientServiceFactory.WithTx(reqCtx, tx)

	resp, err := clientService.FindByIdentifier(body.Identifier)
	if !resp.Found {
		return apierrors.ClientNotFound()
	}
	if err != nil {
		return err
	}

	compared := utils.Bcrypt.Compare(resp.PasswordHash, body.Password)
	if !compared {
		return apierrors.ClientPasswordMismatch()
	}

	authTokenService := authTokenServiceFactory.WithTx(reqCtx, tx)

	ip := ctx.IP()
	ua := ctx.UserAgent()
	token, err := authTokenService.FindOrCreate(resp.ClientID, ip, ua)

	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return ctx.JSON(models.AuthResponse{
		Token: token,
	})
}
