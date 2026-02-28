package models

type AuthSignUpBody struct {
	Email    string `json:"email"    validate:"required,email"        desc:"RFC 5322 compatible format"`
	Login    string `json:"login"    validate:"required,min=3,max=32" desc:"length: 3-32"`
	Password string `json:"password" validate:"required,min=8,max=64" desc:"length: 8-64"`
}

type AuthSignInBody struct {
	Identifier string `json:"identifier" validate:"required"              desc:"email or login"`
	Password   string `json:"password"   validate:"required,min=8,max=64" desc:"length: 8-64"`
}

type AuthResponse struct {
	Token string `json:"token"`
}
