package track_handlers

import (
	"backend/core"
	apierrors "backend/core/api_errors"
	"backend/models"
	"backend/services"
	"encoding/json"
	"io"
	"os"
	"path/filepath"
	"strconv"

	"github.com/go-swagno/swagno/v3/components/endpoint"
	"github.com/go-swagno/swagno/v3/components/http/response"
	"github.com/go-swagno/swagno/v3/components/parameter"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/log"
	"github.com/google/uuid"
)

func UploadInfo() []endpoint.EndPointOption {
	return []endpoint.EndPointOption{
		endpoint.WithTags("Track"),
		endpoint.WithParams(
			parameter.StrParam(
				"Content-Type",
				parameter.Header,
				parameter.WithRequired(),
				parameter.WithDefault("application/octet-stream"),
			),
			parameter.StrParam(
				"X-Meta-Size",
				parameter.Header,
				parameter.WithRequired(),
			),
			parameter.StrParam(
				"X-Cover-ID",
				parameter.Header,
			),
		),
		endpoint.WithSuccessfulReturns([]response.Response{
			apierrors.TrackContainsVideo().Response(),
			apierrors.TrackUnsupported().Response(),
			response.New(models.ID{}, "200", "OK"),
		}),
	}
}

func Upload(
	ctx fiber.Ctx,
	txFactory core.TxFactory,
	FFmpegFactory *services.FFmpegFactory,
	trackServiceFactory *services.TrackFactory,
) error {
	contentType := ctx.Get("Content-Type")
	if contentType != "application/octet-stream" {
		return fiber.ErrBadRequest
	}

	metaSizeHeader := ctx.Get("X-Meta-Size")
	if metaSizeHeader == "" {
		return fiber.ErrBadRequest
	}

	metaSize, err := strconv.ParseInt(metaSizeHeader, 10, 64)
	if err != nil || metaSize <= 0 {
		log.Error(err)
		return fiber.ErrBadRequest
	}

	reader := ctx.RequestCtx().RequestBodyStream()
	if reader == nil {
		return fiber.ErrInternalServerError
	}

	metaBuffer := make([]byte, metaSize)
	if _, err := io.ReadFull(reader, metaBuffer); err != nil {
		log.Error(err)
		return fiber.ErrBadRequest
	}

	var meta models.TrackMetaBody
	err = json.Unmarshal(metaBuffer, &meta)
	if err != nil {
		log.Error(err)
		return fiber.ErrBadRequest
	}

	uuidv4, err := uuid.NewRandom()
	if err != nil {
		log.Error(err)
		return err
	}

	filename := uuidv4.String()
	filePath := filepath.Join("./uploads", filename)

	file, err := os.Create(filePath)
	if err != nil {
		log.Error(err)
		return err
	}

	var success bool
	var filePath2 string

	defer func() {
		file.Close()

		if !success {
			os.Remove(filePath)
			os.Remove(filePath2)
		}
	}()

	buf := make([]byte, 1024*1024)
	for {
		n, readErr := reader.Read(buf)

		if n > 0 {
			_, writeErr := file.Write(buf[:n])

			if writeErr != nil {
				log.Error(writeErr)
				return writeErr
			}
		}

		if readErr != nil {
			if readErr == io.EOF {
				break
			}

			log.Error(readErr)
			return readErr
		}
	}

	file.Close()

	reqCtx := ctx.Context()
	tx, err := txFactory.Begin(reqCtx)

	if err != nil {
		log.Error(err)
		return err
	}
	defer tx.Rollback()

	ffmpegService := FFmpegFactory.New(reqCtx)
	techMeta, err := ffmpegService.GetTechMetadata(filePath)

	if err != nil {
		log.Error(err)
		return err
	}

	if techMeta.IsVideo {
		return apierrors.TrackContainsVideo()
	}

	if techMeta.Unsupported {
		return apierrors.TrackUnsupported()
	}

	filePath2 = filepath.Join("./uploads", filename+techMeta.Extension)
	os.Rename(filePath, filePath2)

	clientID := ctx.Locals("clientID").(int32)
	var coverID *int64 = nil

	coverIDHeader := ctx.Get("X-Cover-ID")
	if coverIDHeader != "" {
		coverIDParsed, err := strconv.ParseInt(metaSizeHeader, 10, 64)

		if err != nil || coverIDParsed <= 0 {
			log.Error(err)
			return fiber.ErrBadRequest
		}

		coverID = &coverIDParsed
	}

	trackService := trackServiceFactory.WithTx(reqCtx, tx)
	trackID, err := trackService.CreateTrack(clientID, coverID, filePath2, techMeta.Duration, meta.Title, meta.Album, techMeta.Codec, techMeta.Bitrate)

	if err != nil {
		log.Error(err)
		return err
	}

	if err := tx.Commit(); err != nil {
		log.Error(err)
		return err
	}

	success = true

	return ctx.JSON(models.ID{
		Id: trackID,
	})
}
