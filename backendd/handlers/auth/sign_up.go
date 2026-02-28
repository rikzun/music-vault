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

func SignUpInfo() []endpoint.EndPointOption {
	return []endpoint.EndPointOption{
		endpoint.WithTags("Auth"),
		endpoint.WithBody(models.AuthSignUpBody{}),
		endpoint.WithSuccessfulReturns([]response.Response{response.New(models.AuthResponse{}, "200", "OK")}),
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
		return err
	}

	passwordHash, err := utils.Bcrypt.Generate(body.Password)
	if err != nil {
		return err
	}

	reqCtx := ctx.Context()
	tx, err := txFactory.Begin(reqCtx)

	if err != nil {
		return err
	}
	defer tx.Rollback()

	clientService := clientServiceFactory.WithTx(reqCtx, tx)

	clientID, uniqueViolation, err := clientService.CreateAndGetID(body.Email, body.Login, passwordHash)
	if uniqueViolation {
		return apierrors.ClientUniqueError()
	}
	if err != nil {
		return err
	}

	ip := ctx.IP()
	ua := ctx.UserAgent()

	authTokenService := authTokenServiceFactory.WithTx(reqCtx, tx)
	token, err := authTokenService.Create(clientID, ip, ua)
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
