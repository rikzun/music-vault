package playlist

type UploadedTracks struct {
	Data []TrackData `json:"data"`
}

type TrackData struct {
	ID         uint `json:"id"`
	UploaderID uint `json:"uploaderID"`

	AudioURL string  `json:"audioURL"`
	ImageURL *string `json:"imageURL"`

	Title    string  `json:"title"`
	Album    *string `json:"album"`
	Codec    string  `json:"codec"`
	Bitrate  uint    `json:"bitrate"`
	Lossless bool    `json:"lossless"`

	Artists []TrackArtist `json:"artists"`
}

type TrackArtist struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}
