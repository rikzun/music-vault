package playlist

import (
	"backend/core/custom"
	"backend/core/errors"
	"backend/domain"
	"backend/domain/services"
	"backend/global"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path"
	"strconv"
	"strings"

	"github.com/google/uuid"
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
			Duration:   track.Duration,
			Artists:    artists,
		})
	}

	ctx.JSON(
		http.StatusOK,
		PlaylistTracks{data},
	)
}

func EntryCreate(ctx *custom.Context) {
	contentType := ctx.GetHeader("Content-Type")
	if !strings.HasPrefix(contentType, "application/octet-stream") {
		ctx.ApiError(errors.Common.WrongContentType("application/octet-stream"))
		return
	}

	metaSizeHeader := ctx.GetHeaderPtr("X-Meta-Size")
	if metaSizeHeader == nil {
		ctx.ApiError(errors.Common.MissingHeader("X-Meta-Size"))
		return
	}

	metaSize, err := strconv.ParseInt(*metaSizeHeader, 10, 64)
	if err != nil || metaSize < 0 {
		ctx.ApiError(errors.Common.InvalidHeaderValue("X-Meta-Size", "uint"))
		return
	}

	metaBuffer := make([]byte, metaSize)
	_, err = io.ReadFull(ctx.Request.Body, metaBuffer)
	if err != nil && err != io.EOF {
		ctx.ApiError(errors.Track.MetaReadFailed())
		return
	}

	var meta PlaylistMetaBody
	err = json.Unmarshal(metaBuffer, &meta)
	if err != nil {
		ctx.ApiError(errors.Track.MetaParseFailed())
		return
	}

	imageBytes, err := io.ReadAll(ctx.Request.Body)
	if err != nil {
		ctx.ApiError(errors.Track.ImageReadFailed())
		return
	}

	var imagePath *string
	if len(imageBytes) != 0 {
		folder := "uploads"

		err = os.MkdirAll(folder, os.ModePerm)
		if err != nil {
			ctx.ApiError(errors.Common.FileCreationFailed())
			return
		}

		fileName := uuid.NewString()
		filePath := path.Join(folder, "playlist_image_"+fileName)

		err = os.WriteFile(filePath, imageBytes, 0644)
		if err != nil {
			ctx.ApiError(errors.Common.FileCreationFailed())
			return
		}

		imagePath = &filePath
	}

	clientID := ctx.ClientID()

	services.Playlist.Create(
		*clientID,
		imagePath,
		meta.Title,
		domain.PlaylistVariantDefault,
	)
}

func EntryGetList(ctx *custom.Context) {
	clientID := ctx.ClientID()
	playlists := services.Playlist.FindByClient(*clientID)

	data := make([]ClientPlaylistData, 0, len(playlists))
	for _, track := range playlists {

		data = append(data, ClientPlaylistData{
			ID:       track.ID,
			ImageURL: track.ImagePath,
			Title:    track.Title,
		})
	}

	ctx.JSON(
		http.StatusOK,
		ClientPlaylists{data},
	)
}

func EntryGetTracks(ctx *custom.Context) {
	paramID := ctx.RequireIDParam("id")
	if paramID == nil {
		return
	}

	playlistTracks := services.Playlist.GetPlaylistsTracksByID(*paramID)
	data := make([]TrackData, 0, len(playlistTracks))

	for _, playlistTrack := range playlistTracks {
		track := playlistTrack.Track
		artists := make([]TrackArtist, 0, len(track.Artists))

		for _, artist := range track.Artists {
			artists = append(artists, TrackArtist{
				ID:   artist.ID,
				Name: artist.Name,
			})
		}

		var originPlaylist *ClientPlaylistData
		if playlistTrack.OriginPlaylistID != nil {
			originPlaylist = &ClientPlaylistData{
				ID:       playlistTrack.OriginPlaylist.ID,
				ImageURL: playlistTrack.OriginPlaylist.ImagePath,
				Title:    playlistTrack.OriginPlaylist.Title,
			}
		}

		data = append(data, TrackData{
			ID:             track.ID,
			UploaderID:     track.UploaderID,
			AudioURL:       track.AudioPath,
			ImageURL:       track.ImagePath,
			Title:          track.Title,
			Album:          track.Album,
			Codec:          track.Codec,
			Bitrate:        track.Bitrate,
			Lossless:       track.Lossless,
			Duration:       track.Duration,
			Artists:        artists,
			OriginPlaylist: originPlaylist,
		})
	}

	ctx.JSON(
		http.StatusOK,
		PlaylistTracks{data},
	)
}

func EntryAddTrack(ctx *custom.Context) {
	paramID := ctx.RequireIDParam("id")
	if paramID == nil {
		return
	}

	var body PlaylistAddBody
	if ok := ctx.RequireBindJSON(&body); !ok {
		return
	}

	records := make([]domain.PlaylistTracksEntity, 0, len(body.Data))
	for _, trackID := range body.Data {
		records = append(records, domain.PlaylistTracksEntity{
			PlaylistID: *paramID,
			TrackID:    trackID,
		})
	}

	global.Database().Create(&records)
}

func EntryAddPlaylist(ctx *custom.Context) {
	paramID := ctx.RequireIDParam("id")
	if paramID == nil {
		return
	}

	var body PlaylistAddBody
	if ok := ctx.RequireBindJSON(&body); !ok {
		return
	}

	records := make([]domain.PlaylistTracksEntity, 0)
	for _, playlistID := range body.Data {
		tracks := services.Playlist.GetTracksIDByID(playlistID)

		for _, trackID := range tracks {
			records = append(records, domain.PlaylistTracksEntity{
				PlaylistID:       *paramID,
				TrackID:          trackID,
				OriginPlaylistID: &playlistID,
			})
		}
	}

	global.Database().Create(&records)
}
