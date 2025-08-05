package errors

import (
	"backend/core/custom"
	"net/http"
)

func CommonWrongContentType(expected string) custom.ApiError {
	code := "common.wrong_content_type"
	details := map[string]string{
		"expected": expected,
	}

	return custom.MakeApiError(
		http.StatusBadRequest,
		code,
		details,
	)
}

func CommonMissingHeader(header string) custom.ApiError {
	code := "common.missing_header"
	details := map[string]string{
		"header": header,
	}

	return custom.MakeApiError(
		http.StatusBadRequest,
		code,
		details,
	)
}

func CommonInvalidHeaderValue(header string, expected string) custom.ApiError {
	code := "common.invalid_header_value"
	details := map[string]string{
		"header":   header,
		"expected": expected,
	}

	return custom.MakeApiError(
		http.StatusBadRequest,
		code,
		details,
	)
}

func CommonFileCreationFailed() custom.ApiError {
	code := "common.file_creation_failed"
	details := map[string]string{}

	return custom.MakeApiError(
		http.StatusInternalServerError,
		code,
		details,
	)
}
