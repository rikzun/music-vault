package core

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type ErrorResponse struct {
	Message string        `json:"message"`
	Details []ErrorDetail `json:"details,omitempty"`
}

type ErrorDetail struct {
	Field string `json:"field"`
	Error string `json:"error"`
}

func transform(err error) any {
	message := "unknown bind error"
	details := make([]ErrorDetail, 0)

	if vErrs, ok := err.(validator.ValidationErrors); ok {
		message = "validator error"

		for _, vErr := range vErrs {
			details = append(details, ErrorDetail{
				Field: vErr.Field(),
				Error: vErr.Tag(),
			})
		}
	} else if jErr, ok := err.(*json.UnmarshalTypeError); ok {
		message = "json parse error"

		details = append(details, ErrorDetail{
			Field: jErr.Field,
			Error: "expect type is " + jErr.Type.String(),
		})
	} else if jErr, ok := err.(*json.SyntaxError); ok {
		message = "json parse error"

		details = append(details, ErrorDetail{
			Field: fmt.Sprintf("pos: %d", jErr.Offset),
			Error: jErr.Error(),
		})
	}

	return ErrorResponse{
		Message: message,
		Details: details,
	}
}

func SendBindError(ctx *gin.Context, err error) {
	ctx.JSON(http.StatusBadRequest, transform(err))
	ctx.Abort()
}

func SendError(ctx *gin.Context, code int, message string) {
	ctx.JSON(code, ErrorResponse{Message: message})
	ctx.Abort()
}
