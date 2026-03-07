package apierrors

import (
	"encoding/json"
	"fmt"

	"github.com/go-swagno/swagno/v3/components/http/response"
)

type ApiErrorCode string

type ApiError struct {
	Status  int            `json:"-"`
	Code    ApiErrorCode   `json:"code"`
	Details map[string]any `json:"details,omitempty"`
}

func (e ApiError) Error() string {
	data, _ := json.Marshal(e)
	return string(data)
}

func (e ApiError) Response() response.CustomResponse {
	return response.New(e, fmt.Sprint(e.Status), string(e.Code))
}

func (e ApiError) DescResponse(description string) response.CustomResponse {
	finalDesc := string(e.Code)
	if description != "" {
		finalDesc = description + " " + finalDesc
	}

	return response.New(e, fmt.Sprint(e.Status), finalDesc)
}
