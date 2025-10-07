package track

import (
	"backend/core/custom"
	"backend/core/errors"
	"backend/domain/services"
	"backend/global"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path"
	"strconv"
	"strings"

	"github.com/google/uuid"
)

func EntryUploadTrack(ctx *custom.Context) {
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

	var meta TrackMetaBody
	err = json.Unmarshal(metaBuffer, &meta)
	if err != nil {
		ctx.ApiError(errors.Track.MetaParseFailed())
		return
	}

	var imageReader io.Reader
	if imageSizeHeader := ctx.GetHeaderPtr("X-Image-Size"); imageSizeHeader != nil {
		imageSize, err := strconv.ParseInt(*imageSizeHeader, 10, 64)
		if err != nil || imageSize < 0 {
			ctx.ApiError(errors.Common.InvalidHeaderValue("X-Image-Size", "uint"))
			return
		}

		imageReader = io.LimitReader(ctx.Request.Body, imageSize)
	}

	folder := "uploads"
	err = os.MkdirAll(folder, os.ModePerm)
	if err != nil {
		ctx.ApiError(errors.Common.FileCreationFailed())
		return
	}

	fileName := uuid.NewString()

	var imagePath *string
	if imageReader != nil {
		path := path.Join(folder, "image_"+fileName)

		imagePath = &path
		imageFile, err := os.Create(path)

		if err != nil {
			ctx.ApiError(errors.Common.FileCreationFailed())
			return
		}

		defer imageFile.Close()

		n, err := io.Copy(imageFile, imageReader)
		fmt.Printf("imagefile: %d", n)

		if err != nil {
			ctx.ApiError(errors.Common.FileWritingFailed())
			return
		}
	}

	audioPath := path.Join(folder, "track_"+fileName)
	trackFile, err := os.Create(audioPath)
	if err != nil {
		ctx.ApiError(errors.Common.FileCreationFailed())
		return
	}

	defer trackFile.Close()

	n, err := io.Copy(trackFile, ctx.Request.Body)
	fmt.Printf("trackfile: %d", n)
	if err != nil {
		ctx.ApiError(errors.Common.FileWritingFailed())
		return
	}

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

func EntryTrackWaveform(ctx *custom.Context) {
	id := ctx.RequireIDParam("id")
	if id == nil {
		return
	}

	track := services.Track.FindByID(*id)
	if track == nil {
		ctx.ApiError(errors.Common.EntityNotFound("track", *id))
		return
	}

	cmd := exec.Command("ffmpeg", []string{
		"-v", "quiet",
		"-i", "/" + track.AudioPath,
		"-ac", "1",
		"-af", "aresample=500",
		"-f", "s16le",
		"-",
	}...)

	cmd.Stderr = os.Stderr

	output, err := cmd.Output()
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return
	}

	if len(output)%2 != 0 {
		fmt.Printf("err: %d\n", len(output))
	}

	samples := make([]int16, len(output)/2)
	for i := range samples {
		samples[i] = int16(output[i*2]) | int16(output[i*2+1])<<8
	}

	if len(samples) == 0 {
		ctx.JSON(http.StatusOK, TrackWaveform{
			Data: make([]int8, 0),
		})
		return
	}

	targetSize := 500
	data := make([]int8, targetSize)

	maxAbs := int16(0)
	for _, s := range samples {
		absVal := s
		if absVal < 0 {
			absVal = -absVal
		}
		if absVal > maxAbs {
			maxAbs = absVal
		}
	}

	if maxAbs == 0 {
		ctx.JSON(http.StatusOK, TrackWaveform{
			Data: make([]int8, 0),
		})
		return
	}

	step := max(len(samples)/targetSize, 1)

	for i := range targetSize {
		idx := i * step
		if idx >= len(samples) {
			break
		}

		normalized := float64(samples[idx]) / float64(maxAbs) * 100

		if normalized > 100 {
			normalized = 100
		} else if normalized < -100 {
			normalized = -100
		}

		data[i] = int8(normalized)
	}

	ctx.JSON(http.StatusOK, TrackWaveform{Data: data})
}
