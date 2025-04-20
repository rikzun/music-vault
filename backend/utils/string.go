package utils

func StringPtrOrNil(value string) *string {
	if value == "" {
		return nil
	}

	return &value
}
