package middleware

import "github.com/gin-gonic/gin"

var DefaultHeaders = func(ctx *gin.Context) {
	ctx.Header("Access-Control-Allow-Origin", "*")
	ctx.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	ctx.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Meta-Size, X-Image-Size")

	ctx.Header("Content-Security-Policy", "default-src 'self'")
	ctx.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
	ctx.Header("X-Content-Type-Options", "nosniff")
	ctx.Header("X-Frame-Options", "DENY")

	if ctx.Request.Method == "OPTIONS" {
		ctx.AbortWithStatus(204)
		return
	}

	ctx.Next()
}
