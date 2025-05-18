package core

import (
	"reflect"

	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

func ConfigureValidator() {
	if validator, ok := binding.Validator.Engine().(*validator.Validate); ok {
		validator.RegisterTagNameFunc(func(field reflect.StructField) string {
			jsonTag := field.Tag.Get("json")

			if jsonTag == "" {
				return field.Name
			}

			return jsonTag
		})
	}
}
