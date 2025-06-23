package client

type ClientData struct {
	ID        uint    `json:"id"`
	Login     string  `json:"login"`
	AvatarURL *string `json:"avatarURL"`
}
