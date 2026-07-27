package models

type ClientMeResponse struct {
	Id        int32   `json:"id"`
	Login     string  `json:"login"`
	AvatarURL *string `json:"avatarURL"`
}
