package apierrors

import "github.com/gofiber/fiber/v3"

const (
	JsonParseErrorCode         ApiErrorCode = "JSON.PARSE_ERROR"
	JsonValidateErrorCode      ApiErrorCode = "JSON.VALIDATE_ERROR"
	ClientUniqueViolationCode  ApiErrorCode = "CLIENT.UNIQUE_VIOLATION"
	ClientNotFoundCode         ApiErrorCode = "CLIENT.NOT_FOUND"
	ClientPasswordMismatchCode ApiErrorCode = "CLIENT.PASSWORD_MISMATCH"
)

func ClientUniqueError() error {
	return &ApiError{
		Status: fiber.StatusConflict,
		Code:   ClientUniqueViolationCode,
	}
}

func ClientNotFound() error {
	return &ApiError{
		Status: fiber.StatusNotFound,
		Code:   ClientNotFoundCode,
	}
}

func ClientPasswordMismatch() error {
	return &ApiError{
		Status: fiber.StatusUnauthorized,
		Code:   ClientPasswordMismatchCode,
	}
}
