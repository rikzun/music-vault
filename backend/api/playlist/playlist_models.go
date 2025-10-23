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

	Duration float64 `json:"duration"`

	Artists []TrackArtist `json:"artists"`
}

type TrackArtist struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

type PlaylistMetaBody struct {
	Title string `json:"title"`
}

type PlaylistData struct {
	ID       uint    `json:"id"`
	ImageURL *string `json:"imageURL"`
	Title    string  `json:"Title"`
}

type Playlists struct {
	Data []PlaylistData `json:"data"`
}

type PlaylistAddBody struct {
	Data []uint `json:"data"`
}
