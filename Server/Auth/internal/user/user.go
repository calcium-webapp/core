package user

import "context"

type User struct {
	ID       int64  `json:"id" db:"id"`
	UserName string `json:"username" db:"username"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type CreateUserReq struct {
	UserName string `json:"username" db:"username"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type CreateUserRes struct {
	ID       string `json:"id" db:"id"`
	UserName string `json:"username" db:"username"`
	Email    string `json:"email" db:"email"`
}

type LoginUserReq struct {
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type LoginUserRes struct {
	accessToken string
	ID          string `json:"id" db:"id"`
	UserName    string `json:"username" db:"username"`
}

type SSOUser struct {
	ID       int64  `json:"id" db:"id"`
	Provider string `json:"provider" db:"provider"`
	Secret   string `json:"secret" db:"secret"`
	Username string `json:"username" db:"username"`
}

type CreateSSOReq struct {
	Provider string `json:"provider" db:"provider"`
	Secret   string `json:"secret" db:"secret"`
	Username string `json:"username" db:"username"`
}

type CreateSSORes struct {
	Provider string `json:"provider" db:"provider"`
	ID       int64  `json:"id" db:"id"`
	Username string `json:"username" db:"username"`
}

type LoginSSOReq struct {
	Secret string `json:"secret" db:"secret"`
}

type LoginSSORes struct {
	accessToken string
	Provider    string `json:"provider" db:"provider"`
	ID          int64  `json:"id" db:"id"`
	UserName    string `json:"username" db:"username"`
}

type Repository interface {
	CreateUser(ctx context.Context, user *User) (*User, error)
	GetUserByEmail(ctx context.Context, email string) (*User, error)
	CreateSSOUser(ctx context.Context, user *SSOUser) (*SSOUser, error)
	GetUserBySecret(ctx context.Context, secret string) (*SSOUser, error)
}

type Service interface {
	CreateUser(c context.Context, req *CreateUserReq) (*CreateUserRes, error)
	Login(c context.Context, req *LoginUserReq) (*LoginUserRes, error)
	CreateSSO(c context.Context, req *CreateSSOReq) (*CreateSSORes, error)
	LoginSSO(c context.Context, req *LoginSSOReq) (*LoginSSORes, error)
}
