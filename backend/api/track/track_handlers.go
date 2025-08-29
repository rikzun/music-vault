package track

import (
	"backend/core/custom"
	"backend/core/errors"
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

func EntryUploadTrack(ctx *custom.Context) {
	contentType := ctx.GetHeader("Content-Type")
	if !strings.HasPrefix(contentType, "application/octet-stream") {
		ctx.ApiError(errors.CommonWrongContentType("application/octet-stream"))
		return
	}

	metaSizeHeader := ctx.GetHeaderPtr("X-Meta-Size")
	if metaSizeHeader == nil {
		ctx.ApiError(errors.CommonMissingHeader("X-Meta-Size"))
		return
	}

	metaSize, err := strconv.ParseInt(*metaSizeHeader, 10, 64)
	if err != nil || metaSize < 0 {
		ctx.ApiError(errors.CommonInvalidHeaderValue("X-Meta-Size", "uint"))
		return
	}

	metaReader := io.LimitReader(ctx.Request.Body, metaSize)
	metaBuffer := make([]byte, metaSize)

	_, err = io.ReadFull(metaReader, metaBuffer)
	if err != nil && err != io.EOF {
		ctx.ApiError(errors.TrackMetaReadFailed())
		return
	}

	var meta TrackMetaBody
	err = json.Unmarshal(metaBuffer, &meta)
	if err != nil {
		ctx.ApiError(errors.TrackMetaParseFailed())
		return
	}

	var imageReader io.Reader
	if imageSizeHeader := ctx.GetHeaderPtr("X-Image-Size"); imageSizeHeader != nil {
		imageSize, err := strconv.ParseInt(*imageSizeHeader, 10, 64)
		if err != nil || imageSize < 0 {
			ctx.ApiError(errors.CommonInvalidHeaderValue("X-Image-Size", "uint"))
			return
		}

		imageReader = io.LimitReader(ctx.Request.Body, imageSize)
	}

	folder := "uploads"
	os.MkdirAll(folder, os.ModePerm)
	fileName := uuid.NewString()

	var imagePath *string
	if imageReader != nil {
		path := path.Join(folder, "image_"+fileName)
		imagePath = &path

		imageFile, err := os.Create(*imagePath)
		if err != nil {
			ctx.ApiError(errors.CommonFileCreationFailed())
			return
		}

		defer imageFile.Close()
		io.Copy(imageFile, imageReader)
	}

	audioPath := path.Join(folder, "track_"+fileName)
	trackFile, err := os.Create(audioPath)
	if err != nil {
		ctx.ApiError(errors.CommonFileCreationFailed())
		return
	}

	defer trackFile.Close()
	io.Copy(trackFile, ctx.Request.Body)

	clientID := ctx.ClientID()

	trackID := services.Track.Create(
		*clientID,
		audioPath,
		imagePath,
		meta.Title,
		meta.Artists,
		&meta.Album,
		meta.Codec,
		meta.Bitrate,
		meta.Lossless,
	)

	ctx.JSON(http.StatusOK, global.ID{
		ID: trackID,
	})
}

func EntryGetUploaded(ctx *custom.Context) {
	clientID := ctx.ClientID()
	tracks := services.Track.FindByClient(*clientID)

	data := make([]UploadedTrack, 0, len(tracks))
	for _, track := range tracks {
		data = append(data, UploadedTrack{
			AudioURL: track.AudioPath,
			ImageURL: track.ImagePath,
		})
	}

	ctx.JSON(
		http.StatusOK,
		UploadedTracks{data},
	)
}
