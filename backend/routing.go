package main

import (
	"backend/api/auth"
	"backend/api/client"
	"backend/api/playlist"
	"backend/api/track"
	"backend/core/custom"
	"backend/core/middleware"

	"github.com/gin-gonic/gin"
)

func InitRouting(engine *gin.Engine) {
	public := engine.Group("/api")
	protected := engine.Group("/api", middleware.Authorization)

	public.POST("auth/sign-up", custom.Handler(auth.EntrySignUp))
	public.POST("auth/sign-in", custom.Handler(auth.EntrySignIn))

	protected.GET("client/me", custom.Handler(client.EntryMe))

	protected.POST("track/upload", custom.Handler(track.EntryUploadTrack))

	protected.GET("playlist/uploaded", custom.Handler(playlist.EntryGetUploaded))
}
