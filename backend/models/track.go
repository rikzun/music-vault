package models

type TrackMetaBody struct {
	Title   string   `json:"title"`
	Artists []string `json:"artists"`
	Album   *string  `json:"album"`
}

type TrackData struct {
	ID         uint `json:"id"`
	UploaderID uint `json:"uploaderID"`

	CoverPath string  `json:"coverPath"`
	ImagePath *string `json:"imagePath"`

	Title   string   `json:"title"`
	Artists []string `json:"artists"`
	Album   *string  `json:"album"`
	Codec   string   `json:"codec"`
	Bitrate uint     `json:"bitrate"`

	Duration float64 `json:"duration"`

	// Artists        []TrackArtist       `json:"artists"`
}
