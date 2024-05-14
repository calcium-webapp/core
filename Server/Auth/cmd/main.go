package main

import (
	"auth/dbconn"
	"auth/internal/user"
	"auth/router"
	"log"
	"os"

	env "github.com/joho/godotenv"
)

func main() {
	var err error = env.Load(".env")
	if err != nil {
		log.Fatalf("Could not load.env file %s", err)
	}
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	dbuser := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")
	dbname := os.Getenv("POSTGRES_DB")
	dbConn, err := dbconn.NewDatabase(host, port, dbuser, password, dbname)
	if err != nil {
		log.Fatalf("Could not initialize database connection %s", err)
	}
	userRep := user.NewRepository(dbConn.GetDB())
	userSvc := user.NewService(userRep)
	userHandler := user.NewHandler(userSvc)

	router.InitRouter(userHandler)
	router.Start("0.0.0.0:8080")
}
