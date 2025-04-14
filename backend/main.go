package main

import (
	"backend/core/routing"
	"backend/modules"
	ClientService "backend/services/client"

	"github.com/gin-gonic/gin"
)

func main() {
	modules.InitDatabase()
	modules.Database.AutoMigrate(&ClientService.ClientSchema{})

	engine := gin.Default()
	routing.Init(engine)

	engine.Run(":8080")
}
