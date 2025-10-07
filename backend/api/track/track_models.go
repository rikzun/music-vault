package track

type TrackMetaBody struct {
	Title    string   `json:"title"`
	Artists  []string `json:"artists"`
	Album    string   `json:"album"`
	Codec    string   `json:"codec"`
	Bitrate  uint     `json:"bitrate"`
	Lossless bool     `json:"lossless"`
}

type TrackWaveform struct {
	Data []int8 `json:"data"`
}
