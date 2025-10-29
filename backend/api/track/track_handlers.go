package track

import (
	"backend/core/custom"
	"backend/core/errors"
	"backend/domain/services"
	"backend/global"
	"bytes"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	"os"
	"os/exec"
	"path"
	"strconv"
	"strings"

	"github.com/google/uuid"
)

type Format struct {
	Duration string `json:"duration"`
}

type ProbeOutput struct {
	Format Format `json:"format"`
}

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

		_, err = io.Copy(imageFile, imageReader)
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

	_, err = io.Copy(trackFile, ctx.Request.Body)
	if err != nil {
		ctx.ApiError(errors.Common.FileWritingFailed())
		return
	}

	cmd := exec.Command("ffprobe",
		"-v", "quiet",
		"-print_format", "json",
		"-show_format",
		"./"+audioPath,
	)

	output, err := cmd.Output()
	if err != nil {
		fmt.Errorf("err: %v", err)
	}

	var probeOutput ProbeOutput
	if err := json.Unmarshal(output, &probeOutput); err != nil {
		fmt.Errorf("parse err: %v", err)
	}

	duration, err := strconv.ParseFloat(probeOutput.Format.Duration, 64)
	if err != nil {
		duration = 0
		fmt.Errorf("conv err: %v", err)
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
		duration,
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

	// Prepare the ffmpeg command.
	cmd := exec.Command("ffmpeg",
		"-v", "quiet",
		"-i", "./"+track.AudioPath,
		"-ac", "1",
		"-af", "aresample=1000",
		"-f", "s16le",
		"-",
	)

	// Capture the output.
	var stderr bytes.Buffer
	cmd.Stderr = &stderr
	output, err := cmd.Output()
	if err != nil {
		fmt.Printf("Failed to process audio file: %s", stderr.String())
		return
	}

	// Read the raw 16-bit little-endian samples.
	numBytes := len(output)
	if numBytes%2 != 0 {
		fmt.Printf("Raw audio data has an uneven number of bytes")
		return
	}

	numSamples := numBytes / 2
	samples := make([]int16, numSamples)
	buf := bytes.NewReader(output)
	if err := binary.Read(buf, binary.LittleEndian, &samples); err != nil {
		fmt.Printf("Failed to parse raw audio data")
		return
	}

	if len(samples) == 0 {
		ctx.JSON(http.StatusOK, TrackWaveform{
			Data: make([]int8, 0),
		})
		return
	}

	targetSize := 150
	data := make([]int8, targetSize)

	// Calculate the global maximum absolute sample value for normalization.
	// This will be used as the peak for the entire track.
	var maxAbs float64
	for _, s := range samples {
		absVal := math.Abs(float64(s))
		if absVal > maxAbs {
			maxAbs = absVal
		}
	}

	if maxAbs == 0 {
		ctx.JSON(http.StatusOK, TrackWaveform{
			Data: make([]int8, targetSize), // Return all zeros if no sound
		})
		return
	}

	samplesPerPoint := numSamples / targetSize
	if samplesPerPoint == 0 {
		samplesPerPoint = 1
	}

	// Process each block to find both positive and negative peaks.
	for i := 0; i < targetSize; i++ {
		startIdx := i * samplesPerPoint
		endIdx := startIdx + samplesPerPoint
		if endIdx > numSamples {
			endIdx = numSamples
		}

		// Find the peak value in the current block, preserving its sign.
		var blockPeak int16
		for j := startIdx; j < endIdx; j++ {
			if math.Abs(float64(samples[j])) > math.Abs(float64(blockPeak)) {
				blockPeak = samples[j]
			}
		}

		// Normalize the block's peak value to the range [-100, 100].
		normalized := (float64(blockPeak) / maxAbs) * 100

		// Clamp the result to the desired range, just in case of float inaccuracies.
		if normalized > 100 {
			normalized = 100
		} else if normalized < -100 {
			normalized = -100
		}

		data[i] = int8(normalized)
	}

	ctx.JSON(http.StatusOK, TrackWaveform{Data: data})
}
