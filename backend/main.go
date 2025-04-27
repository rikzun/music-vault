package main

import (
	"backend/core"
	_ "backend/core/config"
	"backend/core/routing"
	"backend/schema"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	core.InitDatabase()
	core.Database.AutoMigrate(
		&schema.Client{},
		&schema.AuthToken{},
	)

	engine := gin.Default()
	engine.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, X-Requested-With")
		c.Header("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	})
	routing.Init(engine)

	engine.Run(":8080")
}
