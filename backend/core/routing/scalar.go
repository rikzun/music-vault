package routing

import (
	scalar "github.com/bdpiprava/scalar-go"
	"github.com/gofiber/fiber/v3"
)

func (self *routing) RouteScalar() {
	var scalarHTML string

	self.router.Get("docs", func(ctx fiber.Ctx) error {
		ctx.RequestCtx().SetContentType(fiber.MIMETextHTMLCharsetUTF8)

		if scalarHTML == "" {
			var err error

			scalarHTML, err = scalar.NewV2(
				func(o *scalar.Options) {
					o.SpecBytes = self.swagno.MustToJson()

					o.Configurations["theme"] = "fastify"
					o.Configurations["documentDownloadType"] = "none"
					o.Configurations["operationTitleSource"] = "path"
					o.Configurations["darkMode"] = true
					o.Configurations["hideClientButton"] = true
					o.Configurations["defaultOpenAllTags"] = true
					o.Configurations["hideModels"] = true

					o.Configurations["authentication"] = map[string]any{
						"preferredSecurityScheme": "apiKeyAuth",
					}

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
				return err
			}
		}

		return ctx.SendString(scalarHTML)
	})
}
