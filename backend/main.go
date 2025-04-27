package main

import (
	"backend/core"
	_ "backend/core/config"
	"backend/core/middleware"
	"backend/core/routing"
	"backend/schema"
	"reflect"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

func main() {
	core.InitDatabase()
	core.Database.AutoMigrate(
		&schema.Client{},
		&schema.AuthToken{},
	)

	engine := gin.Default()
	engine.Use(middleware.CORS)

	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterTagNameFunc(func(field reflect.StructField) string {
			jsonTag := field.Tag.Get("json")

			if jsonTag == "" {
				return field.Name
			}

			return jsonTag
		})
	}

	routing.Init(engine)
	engine.Run(":8080")
}
