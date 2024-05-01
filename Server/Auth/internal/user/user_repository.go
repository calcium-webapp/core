package user

import (
	"context"
	"database/sql"
)

type DBTX interface {
	ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
	PrepareContext(context.Context, string) (*sql.Stmt, error)
	QueryContext(context.Context, string, ...interface{}) (*sql.Rows, error)
	QueryRowContext(context.Context, string, ...interface{}) *sql.Row
}

type repository struct {
	db DBTX
}

func NewRepository(db DBTX) Repository {
	return &repository{db: db}
}

func (repo *repository) CreateUser(ctx context.Context, user *User) (*User, error) {
	var lastInsertID int
	query := "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) returning id"
	err := repo.db.QueryRowContext(ctx, query, user.UserName, user.Password, user.Email).Scan(&lastInsertID)

	if err != nil {
		return &User{}, err
	}

	user.ID = int64(lastInsertID)
	return user, nil
}
