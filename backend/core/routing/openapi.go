package routing

import "github.com/gofiber/fiber/v3"

func (self *routing) RouteOpenApi() {
	var openapiJSON []byte

	self.router.Get("docs/openapi.json", func(ctx fiber.Ctx) error {
		if openapiJSON == nil {
			openapiJSON = self.swagno.MustToJson()
		}

		return ctx.Status(200).Send(openapiJSON)
	})
}
