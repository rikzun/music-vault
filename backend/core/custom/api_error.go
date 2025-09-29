package custom

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
