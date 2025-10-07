package errors

import "net/http"

type trackErrors struct{}

var Track = trackErrors{}

func (trackErrors) MetaReadFailed() ApiError {
	code := "track.metadata_read_failed"
	details := map[string]string{}

	return MakeApiError(
		http.StatusBadRequest,
		code,
		details,
	)
}

func (trackErrors) MetaParseFailed() ApiError {
	code := "track.metadata_parse_failed"
	details := map[string]string{}

	return MakeApiError(
		http.StatusBadRequest,
		code,
		details,
	)
}

func (trackErrors) ImageReadFailed() ApiError {
	code := "track.image_read_failed"
	details := map[string]string{}

	return MakeApiError(
		http.StatusBadRequest,
		code,
		details,
	)
}
