package apierrors

import (
	"encoding/json"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
)

func ErrorHandler(ctx fiber.Ctx, e error) error {
	status := fiber.StatusInternalServerError
	apiError := ApiError{}

	switch err := e.(type) {
	case *json.SyntaxError:
		status = fiber.StatusBadRequest
		apiError.Code = JsonParseErrorCode
		apiError.Details = map[string]any{
			"position": strconv.FormatInt(err.Offset, 10),
			"message":  err.Error(),
		}

	case *json.UnmarshalTypeError:
		status = fiber.StatusBadRequest
		apiError.Code = JsonParseErrorCode
		apiError.Details = map[string]any{
			"field":    err.Field,
			"expected": err.Type.String(),
		}

	case validator.ValidationErrors:
		status = fiber.StatusBadRequest
		apiError.Code = JsonValidateErrorCode
		apiError.Details = map[string]any{}

		for _, vErr := range err {
			if param := vErr.Param(); param != "" {
				apiError.Details[vErr.Field()] = map[string]any{
					vErr.Tag(): param,
				}
			} else {
				apiError.Details[vErr.Field()] = map[string]any{
					vErr.Tag(): true,
				}
			}
		}

	case *fiber.Error:
		println(err.Error())
		return ctx.SendStatus(err.Code)

	case *ApiError:
		status = err.Status
		apiError.Code = err.Code
		apiError.Details = err.Details
	}

	return ctx.Status(status).JSON(apiError)
}
