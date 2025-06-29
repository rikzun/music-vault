package main

import (
	"backend/api/auth"
	"backend/api/client"
	"backend/api/track"
	"backend/core/middleware"

	"github.com/gin-gonic/gin"
)

func InitRouting(engine *gin.Engine) {
	public := engine.Group("/api")
	public.POST("auth/sign-up", auth.EntrySignUp)
	public.POST("auth/sign-in", auth.EntrySignIn)

	protected := engine.Group("/api", middleware.Authorization)
	protected.GET("client/me", client.EntryMe)
	protected.POST("track/upload", track.EntryUploadTrack)
}
