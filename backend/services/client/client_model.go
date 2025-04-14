package ClientService

type ClientSchema struct {
	ID       uint   `json:"id"    gorm:"primaryKey"`
	Login    string `json:"login" gorm:"uniqueIndex"`
	Password string `json:"password"`
}
