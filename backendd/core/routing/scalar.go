package routing

import (
	"log/slog"
	"os"

	scalar "github.com/bdpiprava/scalar-go"
	"github.com/gofiber/fiber/v3"
)

func (self *routing) RouteScalar() {
	openapiJSON := self.swagno.MustToJson()

	html, err := scalar.NewV2(
		func(o *scalar.Options) {
			o.SpecBytes = openapiJSON

			o.Configurations["theme"] = "fastify"
			o.Configurations["documentDownloadType"] = "none"
			o.Configurations["operationTitleSource"] = "path"
			o.Configurations["darkMode"] = true
			o.Configurations["hideClientButton"] = true

			o.Configurations["defaultHttpClient"] = scalar.HTTPClientConfig{
				TargetKey: "shell",
				ClientKey: "fastify",
			}

			o.Configurations["agent"] = map[string]any{
				"disabled": true,
			}

			o.Configurations["metadata"] = map[string]any{
				"title": "API Reference",
			}
		},
	)

	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}

	self.router.Get("", func(ctx fiber.Ctx) error {
		ctx.RequestCtx().SetContentType(fiber.MIMETextHTMLCharsetUTF8)
		return ctx.SendString(html)
	})
}
