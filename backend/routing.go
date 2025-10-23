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
	protected.GET("track/:id/waveform", custom.Handler(track.EntryTrackWaveform))

	protected.GET("playlist/uploaded", custom.Handler(playlist.EntryGetUploaded))
	protected.POST("playlist/create", custom.Handler(playlist.EntryCreate))
	protected.GET("playlist/get-list", custom.Handler(playlist.EntryGetList))
	protected.POST("playlist/:id/add-track", custom.Handler(playlist.EntryAddTrack))
	protected.POST("playlist/:id/add-playlist", custom.Handler(playlist.EntryAddPlaylist))
}
