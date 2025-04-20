package main

import (
	"backend/core"
	"backend/core/routing"
	ClientService "backend/services/client"

	"github.com/gin-gonic/gin"
)

func main() {
	core.InitDatabase()
	core.Database.AutoMigrate(&ClientService.ClientSchema{})

	engine := gin.Default()
	routing.Init(engine)

	engine.Run(":8080")
}
