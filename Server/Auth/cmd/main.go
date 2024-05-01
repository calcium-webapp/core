package main

import (
	"auth/dbconn"
	"auth/internal/user"
	"auth/router"
	"log"
)

func main() {
	dbConn, err := dbconn.NewDatabase()
	if err != nil {
		log.Fatalf("Could not initialize database connection %s", err)
	}
	userRep := user.NewRepository(dbConn.GetDB())
	userSvc := user.NewService(userRep)
	userHandler := user.NewHandler(userSvc)

	router.InitRouter(userHandler)
	router.Start("0.0.0.0:8080")
}
