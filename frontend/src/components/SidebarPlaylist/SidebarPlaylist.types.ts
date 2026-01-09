export interface GetListPlaylistResponse {
    data: PlaylistShortData[]
}

export interface PlaylistShortData {
    id: number
	position: number
	imageURL: string | null
	title: string
	trackIdList: number[]
	duration: number
}
