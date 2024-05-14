package user

import (
	"context"
	"database/sql"
	"fmt"
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
	query := "INSERT INTO public.user (username, password, email) VALUES ($1, $2, $3) returning id"
	err := repo.db.QueryRowContext(ctx, query, user.UserName, user.Password, user.Email).Scan(&lastInsertID)

	if err != nil {
		fmt.Println("a")
		return &User{}, err
	}
	fmt.Println("b")

	user.ID = int64(lastInsertID)
	return user, nil
}

func (repo *repository) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	u := User{}

	query := "SELECT id, email, username, password FROM public.user WHERE email = $1"

	err := repo.db.QueryRowContext(ctx, query, email).Scan(&u.ID, &u.Email, &u.UserName, &u.Password)

	if err != nil {
		return &User{}, err
	}
	return &u, nil

}

func (repo *repository) CreateSSOUser(ctx context.Context, user *SSOUser) (*SSOUser, error) {
	var lastInsertID int
	providerId, err := repo.getProvider(ctx, user.Provider)

	if err != nil {
		fmt.Println("aquí")
		return &SSOUser{}, err
	}

	query := "INSERT INTO sso (\"providerId\", \"accessToken\", username) VALUES ($1, $2, $3) returning id"
	err = repo.db.QueryRowContext(ctx, query, providerId, user.Secret, user.Username).Scan(&lastInsertID)

	if err != nil {
		fmt.Println("allá")
		return &SSOUser{}, err
	}

	user.ID = int64(lastInsertID)
	return user, nil
}

func (repo *repository) getProvider(ctx context.Context, name string) (int, error) {
	query := "SELECT id FROM ssoprovider where name = $1"
	var providerid int
	err := repo.db.QueryRowContext(ctx, query, name).Scan(&providerid)

	if err != nil {
		return 0, err
	}

	return providerid, nil
}

func (repo *repository) GetUserBySecret(ctx context.Context, secret string) (*SSOUser, error) {
	u := SSOUser{}

	var providerID string

	query := "SELECT id, \"providerId\", \"accessToken\", username FROM sso WHERE \"accessToken\" = $1"

	err := repo.db.QueryRowContext(ctx, query, secret).Scan(&u.ID, &providerID, &u.Secret, &u.Username)

	if err != nil {
		return &SSOUser{}, err
	}

	query = "SELECT name FROM ssoprovider WHERE id=$1"
	err = repo.db.QueryRowContext(ctx, query, providerID).Scan(&u.Provider)

	if err != nil {
		return &SSOUser{}, err
	}

	return &u, nil

}
