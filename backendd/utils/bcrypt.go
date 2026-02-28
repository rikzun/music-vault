package utils

import "golang.org/x/crypto/bcrypt"

type bcryptWrapper struct {
	cost int
}

var Bcrypt = bcryptWrapper{cost: 12}

func (b bcryptWrapper) Generate(value string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(value), b.cost)
	return string(hash), err
}

func (b bcryptWrapper) Compare(hash string, value string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(value))
	return err == nil
}
