package main

import (
	"backend/core"
	apierrors "backend/core/api_errors"
	"backend/core/routing"
	"backend/db/sqlc"
	auth_handlers "backend/handlers/auth"
	"backend/services"
	"log/slog"
	"os"
	"time"

	swagno3 "github.com/go-swagno/swagno/v3"
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

	queries := sqlc.New(database)

	txFactory := core.NewTxFactory(database)
	clientServiceFactory := services.NewClientFactory(queries)
	authTokenServiceFactory := services.NewAuthTokenFactory(queries)

	router := routing.New(routing.Config{
		App:    app,
		Swagno: openapi,
		Prefix: "api",

		WrapperFunc: routing.Wrapper(
			txFactory, clientServiceFactory, authTokenServiceFactory,
		),
	})

	{
		unsecured := router.Group("")
		unsecured.Post("auth/sign-up", auth_handlers.SignUpInfo, auth_handlers.SignUp)
		unsecured.Post("auth/sign-in", auth_handlers.SignInInfo, auth_handlers.SignIn)

		router.RouteOpenApi()
		router.RouteScalar()
	}

	app.Hooks().OnPreStartupMessage(func(message *fiber.PreStartupMessageData) error {
		message.BannerHeader = "" +
			message.ColorScheme.Red + " ___      ___ " + message.ColorScheme.Cyan + " ___      ___ \n" +
			message.ColorScheme.Red + "|\"  \\    /\"  |" + message.ColorScheme.Cyan + "|\"  \\    /\"  |\n" +
			message.ColorScheme.Red + " \\   \\  //   |" + message.ColorScheme.Cyan + " \\   \\  //  / \n" +
			message.ColorScheme.Red + " /\\   \\/.    |" + message.ColorScheme.Cyan + "  \\   \\/. ./  \n" +
			message.ColorScheme.Red + "|: \\.        |" + message.ColorScheme.Cyan + "   \\.    //   \n" +
			message.ColorScheme.Red + "|.  \\    /:  |" + message.ColorScheme.Cyan + "    \\    /    \n" +
			message.ColorScheme.Red + "|___|\\__/|___|" + message.ColorScheme.Cyan + "     \\__/     " +
			message.ColorScheme.Reset

		return nil
	})

	err := app.Listen(":3001", fiber.ListenConfig{
		EnablePrefork: true,
	})

	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}
}
