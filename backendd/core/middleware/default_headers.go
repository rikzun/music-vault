package middleware

import "github.com/gofiber/fiber/v3"

func DefaultHeaders(ctx fiber.Ctx) error {
	ctx.Response().Header.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	ctx.Response().Header.Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Meta-Size, X-Image-ID")
	ctx.Response().Header.Set("Access-Control-Allow-Origin", "*")

	ctx.Response().Header.Set("Cross-Origin-Opener-Policy", "same-origin")
	ctx.Response().Header.Set("Cross-Origin-Resource-Policy", "same-origin")

	ctx.Response().Header.Set("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
	ctx.Response().Header.Set("Referrer-Policy", "strict-origin-when-cross-origin")
	ctx.Response().Header.Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")

	ctx.Response().Header.Set("X-Content-Type-Options", "nosniff")
	ctx.Response().Header.Set("X-Frame-Options", "SAMEORIGIN")
	ctx.Response().Header.Set("X-XSS-Protection", "1; mode=block")

	if ctx.Method() == fiber.MethodOptions {
		return ctx.SendStatus(fiber.StatusNoContent)
	}

	return ctx.Next()
}
