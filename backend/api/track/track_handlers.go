package track

import (
	"backend/core"
	TrackService "backend/domain/tracks"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func EntryUploadTrack(ctx *gin.Context) {
	if !strings.HasPrefix(ctx.GetHeader("Content-Type"), "application/octet-stream") {
		core.SendError(ctx,
			http.StatusBadRequest,
			"Invalid Content-Type, expected application/octet-stream",
		)
		return
	}

	metaSize, err := strconv.ParseInt(ctx.GetHeader("X-Meta-Size"), 10, 64)
	if err != nil {
		core.SendError(ctx,
			http.StatusBadRequest,
			"Error reading X-Meta-Size header",
		)
		return
	}

	metaReader := io.LimitReader(ctx.Request.Body, metaSize)
	metaBuffer := make([]byte, metaSize)

	_, err = io.ReadFull(metaReader, metaBuffer)
	if err != nil && err != io.EOF {
		core.SendError(ctx,
			http.StatusInternalServerError,
			fmt.Sprintf("Error reading meta: %v", err),
		)
		return
	}

	var meta TrackMetaBody
	err = json.Unmarshal(metaBuffer, &meta)
	if err != nil {
		core.SendError(ctx,
			http.StatusInternalServerError,
			fmt.Sprintf("Error parsing meta: %v", err),
		)
		return
	}

	imageSize, err := strconv.ParseInt(ctx.GetHeader("X-Image-Size"), 10, 64)
	if err != nil {
		core.SendError(ctx,
			http.StatusBadRequest,
			"Error reading X-Image-Size header",
		)
		return
	}

	fileName := uuid.NewString()
	imageReader := io.LimitReader(ctx.Request.Body, imageSize)

	imageFile, _ := os.Create("./uploads/" + fileName + "_image")
	trackFile, _ := os.Create("./uploads/" + fileName + "_track")
	defer imageFile.Close()
	defer trackFile.Close()

	io.Copy(imageFile, imageReader)
	io.Copy(trackFile, ctx.Request.Body)

	trackID := TrackService.Create(
		meta.Title,
		meta.Artists,
		&meta.Album,
		meta.Codec,
		meta.Bitrate,
		meta.Lossless,
	)

	response := TrackCreateResponse{
		ID: trackID,
	}

	ctx.JSON(http.StatusOK, response)
}
