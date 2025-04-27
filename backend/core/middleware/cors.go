package middleware

import "github.com/gin-gonic/gin"

var CORS = func(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

	c.Header("Content-Security-Policy", "default-src 'self'")
	c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
	c.Header("X-Content-Type-Options", "nosniff")
	c.Header("X-Frame-Options", "DENY")

	if c.Request.Method == "OPTIONS" {
		c.AbortWithStatus(204)
		return
	}

	c.Next()
}
