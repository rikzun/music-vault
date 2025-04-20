package auth

type ClientSignBody struct {
	Email    string `json:"email"    binding:"required,email"`
	Login    string `json:"login"    binding:"required"`
	Password string `json:"password" binding:"required"`
}
