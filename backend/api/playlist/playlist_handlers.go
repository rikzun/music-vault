package playlist

import (
	"backend/core/custom"
	"backend/domain/services"
	"net/http"
)

func EntryGetUploaded(ctx *custom.Context) {
	clientID := ctx.ClientID()
	tracks := services.Track.FindByClient(*clientID)

	data := make([]TrackData, 0, len(tracks))
	for _, track := range tracks {

		artists := make([]TrackArtist, 0, len(track.Artists))
		for _, artist := range track.Artists {

			artists = append(artists, TrackArtist{
				ID:   artist.ID,
				Name: artist.Name,
			})
		}

		data = append(data, TrackData{
			ID:         track.ID,
			UploaderID: track.UploaderID,
			AudioURL:   track.AudioPath,
			ImageURL:   track.ImagePath,
			Title:      track.Title,
			Album:      track.Album,
			Codec:      track.Codec,
			Bitrate:    track.Bitrate,
			Lossless:   track.Lossless,
			Artists:    artists,
		})
	}

	ctx.JSON(
		http.StatusOK,
		UploadedTracks{data},
	)
}
