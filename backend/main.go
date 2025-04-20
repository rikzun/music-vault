package main

import (
	"backend/core"
	"backend/core/routing"
	"backend/schema"

	"github.com/gin-gonic/gin"
)

func main() {
	core.InitDatabase()
	core.Database.AutoMigrate(
		&schema.Client{},
		&schema.AuthToken{},
	)

	engine := gin.Default()
	routing.Init(engine)

	engine.Run(":8080")
}
