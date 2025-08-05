package errors

import (
	"backend/core/custom"
	"net/http"
)

func TrackMetaReadFailed() custom.ApiError {
	code := "track.metadata_read_failed"
	details := map[string]string{}

	return custom.MakeApiError(
		http.StatusBadRequest,
		code,
		details,
	)
}

func TrackMetaParseFailed() custom.ApiError {
	code := "track.metadata_parse_failed"
	details := map[string]string{}

	return custom.MakeApiError(
		http.StatusBadRequest,
		code,
		details,
	)
}

func TrackImageReadFailed() custom.ApiError {
	code := "track.image_read_failed"
	details := map[string]string{}

	return custom.MakeApiError(
		http.StatusBadRequest,
		code,
		details,
	)
}
