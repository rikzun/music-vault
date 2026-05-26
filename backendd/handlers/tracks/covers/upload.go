package track_covers_handlers

import (
	"backend/core"
	"backend/models"
	"backend/services"
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
			parameter.StrParam("pHash", parameter.Query, parameter.WithRequired()),
		),
		endpoint.WithSuccessfulReturns([]response.Response{
			response.New(models.ID{}, "200", "OK"),
		}),
	}
}

func Upload(
	ctx fiber.Ctx,
	txFactory core.TxFactory,
	trackServiceFactory *services.TrackFactory,
) error {
	contentType := ctx.Get("Content-Type")
	if contentType != "application/octet-stream" {
		return fiber.ErrBadRequest
	}

	pHashStr := ctx.Query("pHash")
	if pHashStr == "" {
		return fiber.ErrBadRequest
	}

	var pHash uint64
	pHash, err := strconv.ParseUint(pHashStr, 10, 64)
	if err != nil {
		log.Error(err)
		return err
	}

	dir := "./uploads"

	err = os.MkdirAll(dir, os.ModePerm)
	if err != nil {
		log.Error(err)
		return err
	}

	uuidv4, err := uuid.NewRandom()
	if err != nil {
		log.Error(err)
		return err
	}

	filename := uuidv4.String() + ".png"
	filePath := filepath.Join(dir, filename)

	file, err := os.Create(filePath)
	if err != nil {
		log.Error(err)
		return err
	}

	var success bool
	defer func() {
		file.Close()

		if !success {
			os.Remove(filePath)
		}
	}()

	reader := ctx.RequestCtx().RequestBodyStream()
	if reader == nil {
		return fiber.ErrInternalServerError
	}

	buffer := make([]byte, 0, 1024*1024)
	for {
		length, err := io.ReadFull(reader, buffer[:cap(buffer)])
		buffer = buffer[:length]

		if length > 0 {
			_, writeErr := file.Write(buffer)

			if writeErr != nil {
				log.Error(writeErr)
				return writeErr
			}
		}

		if err != nil {
			if err == io.EOF || err == io.ErrUnexpectedEOF {
				break
			}

			log.Error(err)
			return err
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

	trackService := trackServiceFactory.WithTx(reqCtx, tx)
	coverID, err := trackService.CreateCover(filePath, pHash)

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
		Id: coverID,
	})
}
