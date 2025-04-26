package routing

import (
	"backend/api/auth"

	"github.com/gin-gonic/gin"
)

func Init(engine *gin.Engine) {
	group := engine.Group("/api")

	group.POST("/sign-up", auth.EntrySignUp)
	group.POST("/sign-in", auth.EntrySignIn)
}
