package playlist

type PlaylistTracks struct {
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

	Artists        []TrackArtist       `json:"artists"`
	OriginPlaylist *ClientPlaylistData `json:"originPlaylist"`
}

type TrackArtist struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

type PlaylistMetaBody struct {
	Title string `json:"title"`
}

type ClientPlaylistData struct {
	ID          uint    `json:"id"`
	Position    uint    `json:"position"`
	ImageURL    *string `json:"imageURL"`
	Title       string  `json:"title"`
	TrackIdList []uint  `json:"trackIdList"`
}

type ClientPlaylists struct {
	Data []ClientPlaylistData `json:"data"`
}

type PlaylistAddBody struct {
	Data []uint `json:"data"`
}
