package track

type TrackMetaDataBody struct {
	Title    string `json:"title"`
	Author   string `json:"author"`
	Codec    string `json:"codec"`
	Bitrate  uint   `json:"bitrate"`
	FileName string `json:"fileName"`
}

type TrackCreateResponse struct {
	ID uint `json:"id"`
}
