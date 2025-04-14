package routing

import (
	"backend/routes/auth"

	"github.com/gin-gonic/gin"
)

func Init(engine *gin.Engine) {
	engine.POST("/sign-up", auth.EntrySignUp)
	engine.POST("/sign-in", auth.EntrySignIn)
}
