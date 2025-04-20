package ClientService

type ClientSchema struct {
	ID       uint   `json:"id"    gorm:"primaryKey"`
	Email    string `json:"email" gorm:"uniqueIndex"`
	Login    string `json:"login" gorm:"uniqueIndex"`
	Password string `json:"password"`
}
