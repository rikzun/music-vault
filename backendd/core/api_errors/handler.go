package apierrors

import (
	"encoding/json"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
)

func ErrorHandler(ctx fiber.Ctx, e error) error {
	status := fiber.StatusInternalServerError
	var data *ApiError = nil

	switch err := e.(type) {
	case *json.SyntaxError:
		status = fiber.StatusBadRequest

		data = &ApiError{}
		data.Code = JsonParseErrorCode
		data.Details = map[string]any{
			"position": strconv.FormatInt(err.Offset, 10),
			"message":  err.Error(),
		}

	case *json.UnmarshalTypeError:
		status = fiber.StatusBadRequest

		data = &ApiError{}
		data.Code = JsonParseErrorCode
		data.Details = map[string]any{
			"field":    err.Field,
			"expected": err.Type.String(),
		}

	case validator.ValidationErrors:
		status = fiber.StatusBadRequest

		data = &ApiError{}
		data.Code = JsonValidateErrorCode
		data.Details = map[string]any{}

		for _, vErr := range err {
			if param := vErr.Param(); param != "" {
				data.Details[vErr.Field()] = map[string]any{
					vErr.Tag(): param,
				}
			} else {
				data.Details[vErr.Field()] = map[string]any{
					vErr.Tag(): true,
				}
			}
		}

	case *fiber.Error:
		status = err.Code

	case *ApiError:
		status = err.Status

		data = &ApiError{}
		data.Code = err.Code
		data.Details = err.Details
	}

	if data == nil {
		return ctx.SendStatus(status)
	}

	return ctx.Status(status).JSON(data)
}
