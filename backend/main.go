package main

import (
	"backend/core"
	"backend/core/middleware"
	"backend/domain"

	"github.com/gin-gonic/gin"
)

func main() {
	core.InitDatabase()
	core.ConfigureValidator()

	core.DB.AutoMigrate(
		&domain.ClientEntity{},
		&domain.AuthTokenEntity{},
	)

	engine := gin.Default()
	engine.Use(middleware.DefaultHeaders)
	engine.Use(middleware.Authorization)
	InitRouting(engine)

	engine.Run(":8080")
}
