package track

type TrackMetaBody struct {
	Title    string   `json:"title"`
	Artists  []string `json:"artists"`
	Album    string   `json:"album"`
	Codec    string   `json:"codec"`
	Bitrate  uint     `json:"bitrate"`
	Lossless bool     `json:"lossless"`
}

type TrackCreateResponse struct {
	ID uint `json:"id"`
}
