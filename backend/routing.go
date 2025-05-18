package main

import (
	"backend/api/auth"
	"backend/api/track"
	"backend/core/middleware"

	"github.com/gin-gonic/gin"
)

func InitRouting(engine *gin.Engine) {
	public := engine.Group("/api")
	public.POST("/sign-up", auth.EntrySignUp)
	public.POST("/sign-in", auth.EntrySignIn)

	protected := public.Group("", middleware.Authorization)
	protected.POST("/upload-track", track.EntryUploadTrack)
}
