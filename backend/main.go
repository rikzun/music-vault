package main

import (
	"backend/core"
	"backend/core/middleware"
	"backend/domain"
	"backend/global"

	"github.com/gin-gonic/gin"
)

func main() {
	core.ConfigureValidator()

	global.InitDatabase()
	global.Database().AutoMigrate(
		&domain.ClientEntity{},
		&domain.AuthTokenEntity{},
		&domain.TrackEntity{},
		&domain.ArtistEntity{},
		&domain.PlaylistEntity{},
		&domain.PlaylistTracksEntity{},
		&domain.ClientPlaylistsEntity{},
	)

	gin.SetMode(gin.ReleaseMode)

	engine := gin.Default()
	engine.SetTrustedProxies([]string{"127.0.0.1"})
	engine.Use(middleware.DefaultHeaders)
	InitRouting(engine)

	engine.Run(":8080")
}
