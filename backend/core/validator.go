package core

import (
	"reflect"

	"github.com/go-playground/validator/v10"
)

type structValidator struct {
	validate *validator.Validate
}

func (v *structValidator) Validate(out any) error {
	return v.validate.Struct(out)
}

func NewValidator() *structValidator {
	v := validator.New(validator.WithRequiredStructEnabled())

	v.RegisterTagNameFunc(func(field reflect.StructField) string {
		jsonTag := field.Tag.Get("json")

		if jsonTag == "" {
			return field.Name
		}

		return jsonTag
	})

	return &structValidator{
		validate: v,
	}
}
