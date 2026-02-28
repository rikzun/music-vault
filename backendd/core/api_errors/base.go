package apierrors

import (
	"encoding/json"
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
