package routing

import "github.com/gofiber/fiber/v3"

func (self *routing) RouteOpenApi() {
	openapiJSON := self.swagno.MustToJson()

	self.router.Get("openapi.json", func(ctx fiber.Ctx) error {
		return ctx.Status(200).Send(openapiJSON)
	})
}
