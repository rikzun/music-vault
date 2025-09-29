package custom

import (
	"encoding/json"
	"fmt"

	"github.com/go-playground/validator/v10"
)

func transform(bindError error) any {
	code := "json.unknown_error"
	details := map[string]string{}

	if err, ok := bindError.(*json.SyntaxError); ok {
		code = "json.parse_error"
		details[fmt.Sprintf("pos: %d", err.Offset)] = err.Error()

	} else if err, ok := bindError.(*json.UnmarshalTypeError); ok {
		code = "json.parse_error"
		details[err.Field] = "expect type is " + err.Type.String()

	} else if errors, ok := bindError.(validator.ValidationErrors); ok {
		code = "json.validator_error"

		for _, err := range errors {
			details[err.Field()] = err.Tag()
		}
	}

	return ErrorContent{
		Code:    code,
		Details: details,
	}
}
