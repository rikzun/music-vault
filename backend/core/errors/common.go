package errors

import (
	"net/http"
	"strconv"
)

type ApiError struct {
	Status int
	Error  ErrorContent
}

type ErrorContent struct {
	Code    string            `json:"code"`
	Details map[string]string `json:"details,omitempty"`
}

func MakeApiError(status int, code string, details map[string]string) ApiError {
	return ApiError{
		Status: status,
		Error: ErrorContent{
			Code:    code,
			Details: details,
		},
	}
}

type commonErrors struct{}

var Common = commonErrors{}

func (commonErrors) WrongContentType(expected string) ApiError {
	code := "common.wrong_content_type"
	details := map[string]string{
		"expected": expected,
	}

	return MakeApiError(
		http.StatusBadRequest,
		code,
		details,
	)
}

func (commonErrors) MissingHeader(header string) ApiError {
	code := "common.missing_header"
	details := map[string]string{
		"header": header,
	}

	return MakeApiError(
		http.StatusBadRequest,
		code,
		details,
	)
}

func (commonErrors) MissingPathParam(param string) ApiError {
	code := "common.missing_path_param"
	details := map[string]string{
		"param": param,
	}

	return MakeApiError(
		http.StatusBadRequest,
		code,
		details,
	)
}

func (commonErrors) InvalidHeaderValue(header string, expected string) ApiError {
	code := "common.invalid_header_value"
	details := map[string]string{
		"header":   header,
		"expected": expected,
	}

	return MakeApiError(
		http.StatusBadRequest,
		code,
		details,
	)
}

func (commonErrors) FileCreationFailed() ApiError {
	code := "common.file_creation_failed"
	details := map[string]string{}

	return MakeApiError(
		http.StatusInternalServerError,
		code,
		details,
	)
}

func (commonErrors) FileWritingFailed() ApiError {
	code := "common.file_writing_failed"
	details := map[string]string{}

	return MakeApiError(
		http.StatusInternalServerError,
		code,
		details,
	)
}

func (commonErrors) EntityNotFound(entity string, id uint) ApiError {
	code := "common.entity_not_found"
	details := map[string]string{
		"entity": entity,
		"id":     strconv.FormatUint(uint64(id), 10),
	}

	return MakeApiError(
		http.StatusNotFound,
		code,
		details,
	)
}
