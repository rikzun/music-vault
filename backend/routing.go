package main

import (
	"backend/api/auth"
	"backend/api/client"
	"backend/api/track"
	"backend/core/custom"
	"backend/core/middleware"

	"github.com/gin-gonic/gin"
)

func InitRouting(engine *gin.Engine) {
	public := engine.Group("/api")
	public.POST("auth/sign-up", custom.Handler(auth.EntrySignUp))
	public.POST("auth/sign-in", custom.Handler(auth.EntrySignIn))

	protected := engine.Group("/api", middleware.Authorization)
	protected.GET("client/me", custom.Handler(client.EntryMe))

	protected.POST("track/upload", custom.Handler(track.EntryUploadTrack))
	protected.GET("track/get-uploaded", custom.Handler(track.EntryGetUploaded))
}
