package track

import (
	"backend/core"
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

var allowedCodecs = []string{
	"mp3", "wav", "flac", "aac",
}

func EntryUploadTrack(ctx *gin.Context) {
	if !strings.HasPrefix(ctx.GetHeader("Content-Type"), "application/octet-stream") {
		core.SendError(ctx,
			http.StatusBadRequest,
			"Invalid Content-Type, expected application/octet-stream",
		)
		return
	}

	metaSize, metaHeaderParseErr := strconv.ParseInt(ctx.GetHeader("X-Meta-Size"), 10, 64)
	if metaHeaderParseErr != nil {
		metaSize = 0
	}

	limitedReader := io.LimitReader(ctx.Request.Body, metaSize)
	metaBuffer := make([]byte, metaSize)
	_, metaReadErr := limitedReader.Read(metaBuffer)
	if metaReadErr != nil && metaReadErr != io.EOF {
		core.SendError(ctx,
			http.StatusInternalServerError,
			fmt.Sprintf("Error reading metadata: %v", metaReadErr),
		)
		return
	}

	var metaData TrackMetaData
	metaParseErr := json.Unmarshal(metaBuffer, &metaData)
	if metaParseErr != nil {
		core.SendError(ctx,
			http.StatusInternalServerError,
			fmt.Sprintf("Error parsing metadata: %v", metaParseErr),
		)
		return
	}

	fileName := uuid.NewString()

	file, fileCreateErr := os.Create("./uploads/" + fileName + ".mp3")
	if fileCreateErr != nil {
		core.SendError(ctx,
			http.StatusInternalServerError,
			fmt.Sprintf("Cannot create file: %v", fileCreateErr),
		)
		return
	}
	defer file.Close()

	_, fileCopyErr := io.Copy(file, ctx.Request.Body)
	if fileCopyErr != nil {
		core.SendError(ctx,
			http.StatusInternalServerError,
			fmt.Sprintf("Error saving file: %v", fileCopyErr),
		)
		return
	}

	ctx.String(http.StatusOK, fmt.Sprintf("File %s uploaded successfully", fileName))
}
