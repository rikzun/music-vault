package custom

type ErrorContent struct {
	Code    string            `json:"code"`
	Details map[string]string `json:"details,omitempty"`
}

type ApiError struct {
	Status int
	Error  ErrorContent
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
