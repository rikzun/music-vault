package main

import (
	"backend/core"
	apierrors "backend/core/api_errors"
	"backend/core/middleware"
	"backend/core/routing"
	auth_handlers "backend/handlers/auth"
	client_handlers "backend/handlers/client"
	track_handlers "backend/handlers/tracks"
	track_covers_handlers "backend/handlers/tracks/covers"
	"backend/services"
	"os"
	"time"

	swagno3 "github.com/go-swagno/swagno/v3"
	"github.com/go-swagno/swagno/v3/components/security"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/log"
	"github.com/gofiber/fiber/v3/middleware/logger"
)

func main() {
	config := core.InitConfig()
	database := core.InitDatabase(config)
	defer database.Close()

	if !fiber.IsChild() {
		core.MigrateDB(database)
	}

	app := fiber.New(fiber.Config{
		ErrorHandler:      apierrors.ErrorHandler,
		StructValidator:   core.NewValidator(),
		StreamRequestBody: true,
	})

	loggerHandler := logger.New()

	openapi := swagno3.New(swagno3.Config{
		Title:   "Music Vault",
		Version: time.Now().Format("2006-01-02 15:04:05"),
	})
	openapi.SetApiKeyAuth("Authorization", security.Header, "")

	txFactory := core.NewTxFactory(database)
	clientServiceFactory := services.NewClientFactory(database)
	authTokenServiceFactory := services.NewAuthTokenFactory(database)
	trackServiceFactory := services.NewTrackFactory(database)
	FFmpegFactory := services.NewFFmpegFactory(database)

	router := routing.New(routing.Config{
		App:    app,
		Swagno: openapi,

		Security: middleware.Authorization(authTokenServiceFactory),
		WrapperFunc: routing.DIWrapper(
			txFactory, clientServiceFactory, authTokenServiceFactory, trackServiceFactory, FFmpegFactory,
		),
	})

	{
		unsecured := router.Group("api", loggerHandler, middleware.DefaultHeaders)
		unsecured.Post("auth/sign-up", auth_handlers.SignUpInfo, auth_handlers.SignUp)
		unsecured.Post("auth/sign-in", auth_handlers.SignInInfo, auth_handlers.SignIn)

		secured := router.GroupSecured("api", loggerHandler, middleware.DefaultHeaders)
		secured.Get("client/me", client_handlers.MeInfo, client_handlers.Me)

		secured.Get("tracks/upload", track_handlers.UploadInfo, track_handlers.Upload)
		secured.Get("tracks/covers/match", track_covers_handlers.MatchInfo, track_covers_handlers.Match)
		secured.Post("tracks/covers/upload", track_covers_handlers.UploadInfo, track_covers_handlers.Upload)

		router.RouteOpenApi()
		router.RouteScalar()
	}

	app.Hooks().OnPostStartupMessage(func(m *fiber.PostStartupMessageData) error {
		log.Info("Backend started")
		return nil
	})

	dir := "./uploads"
	err := os.MkdirAll(dir, os.ModePerm)

	if err != nil {
		log.Error(err)
		os.Exit(1)
	}

	err = app.Listen(":3001", fiber.ListenConfig{
		DisableStartupMessage: true,
		EnablePrefork:         true,
	})

	if err != nil {
		log.Error(err)
		os.Exit(1)
	}
}
