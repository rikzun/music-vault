package main

import (
	"backend/core"
	apierrors "backend/core/api_errors"
	"backend/core/middleware"
	"backend/core/routing"
	auth_handlers "backend/handlers/auth"
	client_handlers "backend/handlers/client"
	"backend/services"
	"log/slog"
	"os"
	"time"

	swagno3 "github.com/go-swagno/swagno/v3"
	"github.com/go-swagno/swagno/v3/components/security"
	"github.com/gofiber/fiber/v3"
)

func main() {
	config := core.InitConfig()
	database := core.InitDatabase(config)
	defer database.Close()

	if !fiber.IsChild() {
		core.MigrateDB(database)
	}

	app := fiber.New(fiber.Config{
		ErrorHandler:    apierrors.ErrorHandler,
		StructValidator: core.NewValidator(),
	})

	openapi := swagno3.New(swagno3.Config{
		Title:   "Music Vault",
		Version: time.Now().Format("2006-01-02 15:04:05"),
	})
	openapi.SetApiKeyAuth("Authorization", security.Header, "")

	txFactory := core.NewTxFactory(database)
	clientServiceFactory := services.NewClientFactory(database)
	authTokenServiceFactory := services.NewAuthTokenFactory(database)

	router := routing.New(routing.Config{
		App:    app,
		Swagno: openapi,

		Security: middleware.Authorization(authTokenServiceFactory),
		WrapperFunc: routing.DIWrapper(
			txFactory, clientServiceFactory, authTokenServiceFactory,
		),
	})

	{
		unsecured := router.Group("api", middleware.DefaultHeaders)
		unsecured.Post("auth/sign-up", auth_handlers.SignUpInfo, auth_handlers.SignUp)
		unsecured.Post("auth/sign-in", auth_handlers.SignInInfo, auth_handlers.SignIn)

		secured := router.GroupSecured("api", middleware.DefaultHeaders)
		secured.Get("client/me", client_handlers.MeInfo, client_handlers.Me)

		router.RouteOpenApi()
		router.RouteScalar()
	}

	app.Hooks().OnPostStartupMessage(func(m *fiber.PostStartupMessageData) error {
		println("Backend started")
		return nil
	})

	err := app.Listen(":3001", fiber.ListenConfig{
		DisableStartupMessage: true,
		EnablePrefork:         true,
	})

	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}
}
