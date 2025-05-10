package track

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func EntryUploadTrack(ctx *gin.Context) {
	if !strings.HasPrefix(ctx.GetHeader("Content-Type"), "application/octet-stream") {
		ctx.AbortWithError(
			http.StatusBadRequest,
			errors.New("Invalid Content-Type, expected application/octet-stream"),
		)
		return
	}

	metaSize, parseErr := strconv.ParseInt(ctx.GetHeader("X-Meta-Size"), 10, 64)
	if parseErr != nil {
		metaSize = 0
	}

	limitedReader := io.LimitReader(ctx.Request.Body, metaSize)
	metaBuffer := make([]byte, metaSize)
	_, readErr := limitedReader.Read(metaBuffer)
	if readErr != nil && readErr != io.EOF {
		ctx.String(http.StatusInternalServerError, "Error reading metadata: %v", readErr)
		return
	}

	metaData := strings.TrimRight(string(metaBuffer[:metaSize]), "\x00 \n")
	fileName := strconv.FormatInt(time.Now().Unix(), 10)
	println(metaData)

	os.MkdirAll("./uploads/", os.ModePerm)
	outFile, err := os.Create("./uploads/" + fileName + ".mp3")
	if err != nil {
		ctx.String(http.StatusInternalServerError, "Cannot create file: %v", err)
		return
	}
	defer outFile.Close()

	_, copyErr := io.Copy(outFile, ctx.Request.Body)
	if copyErr != nil {
		ctx.String(http.StatusInternalServerError, "Error saving file: %v", err)
		return
	}

	ctx.String(http.StatusOK, fmt.Sprintf("File %s uploaded successfully", fileName))
}
