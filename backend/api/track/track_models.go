package track

type TrackMetaBody struct {
	Title    string   `json:"title"`
	Artists  []string `json:"artists"`
	Album    string   `json:"album"`
	Codec    string   `json:"codec"`
	Bitrate  uint     `json:"bitrate"`
	Lossless bool     `json:"lossless"`
}

type UploadedTracks struct {
	Data []UploadedTrack `json:"data"`
}

type UploadedTrack struct {
	AudioURL string  `json:"audioURL"`
	ImageURL *string `json:"imageURL"`
}
