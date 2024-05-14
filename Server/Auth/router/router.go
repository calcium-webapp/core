package router

import (
	"auth/internal/user"

	"github.com/gin-gonic/gin"
)

var r *gin.Engine

func InitRouter(userHandler *user.Handler) {
	r = gin.Default()

	r.POST("/signup/sso", userHandler.CreateSSO)
	r.POST("/signup", userHandler.CreateUser)
	r.POST("/login/sso", userHandler.LoginSSO)
	r.POST("/login", userHandler.Login)
}

func Start(addr string) error {
	return r.Run(addr)
}
