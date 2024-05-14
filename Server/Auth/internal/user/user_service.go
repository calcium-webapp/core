package user

import (
	"auth/util"
	"context"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"fmt"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type service struct {
	Repository
	timeout time.Duration
}

func NewService(repository Repository) Service {
	return &service{
		Repository: repository,
		timeout:    time.Duration(2) * time.Second,
	}
}

func (s *service) CreateUser(c context.Context, req *CreateUserReq) (*CreateUserRes, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()

	hashedPassword, err := util.HashPassword(req.Password)

	if err != nil {
		return nil, err
	}

	u := &User{
		UserName: req.UserName,
		Email:    req.Email,
		Password: hashedPassword,
	}

	r, err := s.Repository.CreateUser(ctx, u)

	if err != nil {
		return nil, err
	}

	res := &CreateUserRes{
		ID:       strconv.Itoa(int(r.ID)),
		UserName: r.UserName,
		Email:    r.Email,
	}

	return res, nil

}

func (s *service) Login(c context.Context, req *LoginUserReq) (*LoginUserRes, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()

	u, err := s.Repository.GetUserByEmail(ctx, req.Email)
	if err != nil {
		return &LoginUserRes{}, err
	}

	err = util.CheckPassword(req.Password, u.Password)
	if err != nil {
		return &LoginUserRes{}, err
	}

	privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		fmt.Println("Error generating ECDSA key:", err)
		return &LoginUserRes{}, err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodES256, jwt.RegisteredClaims{
		Issuer:    strconv.Itoa(int(u.ID)),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
	})

	ss, err := token.SignedString(privateKey)
	if err != nil {
		fmt.Println(err.Error())
		return &LoginUserRes{}, err
	}

	return &LoginUserRes{accessToken: ss, ID: strconv.Itoa(int(u.ID)), UserName: u.UserName}, nil
}

func (s *service) CreateSSO(c context.Context, req *CreateSSOReq) (*CreateSSORes, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()

	u := &SSOUser{
		Username: req.Username,
		Provider: req.Provider,
		Secret:   req.Secret,
	}

	r, err := s.Repository.CreateSSOUser(ctx, u)

	if err != nil {
		return nil, err
	}

	res := &CreateSSORes{
		ID:       r.ID,
		Username: r.Username,
		Provider: r.Provider,
	}

	return res, nil

}

func (s *service) LoginSSO(c context.Context, req *LoginSSOReq) (*LoginSSORes, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()

	u, err := s.Repository.GetUserBySecret(ctx, req.Secret)
	if err != nil {
		return &LoginSSORes{}, err
	}

	privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		fmt.Println("Error generating ECDSA key:", err)
		return &LoginSSORes{}, err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodES256, jwt.RegisteredClaims{
		Issuer:    strconv.Itoa(int(u.ID)),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
	})

	ss, err := token.SignedString(privateKey)
	if err != nil {
		fmt.Println(err.Error())
		return &LoginSSORes{}, err
	}

	return &LoginSSORes{accessToken: ss, ID: u.ID, UserName: u.Username, Provider: u.Provider}, nil
}
