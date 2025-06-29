package main

import (
	"backend/core"
	"backend/core/middleware"
	"backend/domain"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	core.InitDatabase()
	core.ConfigureValidator()

	core.DB.AutoMigrate(
		&domain.ClientEntity{},
		&domain.AuthTokenEntity{},
		&domain.TrackEntity{},
	)

	os.MkdirAll("./uploads/", os.ModePerm)

	engine := gin.Default()
	engine.Use(middleware.DefaultHeaders)
	InitRouting(engine)

	engine.Run(":8080")
}
