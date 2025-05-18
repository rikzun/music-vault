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
	details := make([]ErrorDetail, 0)

	if vErrs, ok := err.(validator.ValidationErrors); ok {
		for _, vErr := range vErrs {
			details = append(details, ErrorDetail{
				Field: vErr.Field(),
				Error: vErr.Tag(),
			})
		}
	}

	if jErr, ok := err.(*json.UnmarshalTypeError); ok {
		details = append(details, ErrorDetail{
			Field: jErr.Field,
			Error: "expect type is " + jErr.Type.String(),
		})
	}

	if jErr, ok := err.(*json.SyntaxError); ok {
		details = append(details, ErrorDetail{
			Field: fmt.Sprintf("pos: %d", jErr.Offset),
			Error: jErr.Error(),
		})
	}

	return ErrorResponse{
		Message: "json parse error",
		Details: details,
	}
}

func SendDetails(ctx *gin.Context, err error) {
	ctx.JSON(http.StatusBadRequest, transform(err))
	ctx.Abort()
}
