package track

type TrackMetaData struct {
	Title    string `json:"title"`
	Author   string `json:"author"`
	Codec    string `json:"codec"`
	Bitrate  uint   `json:"bitrate"`
	FileName uint   `json:"fileName"`
}
