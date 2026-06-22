package services

import (
	"backend/core"
	"encoding/json"
	"fmt"
	"os/exec"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v3/log"
)

type FFmpeg struct{ baseService }
type FFmpegFactory = baseFactory[FFmpeg]

func NewFFmpegFactory(db core.DB) *FFmpegFactory {
	return newBaseFactory(db, func(b baseService) *FFmpeg {
		return &FFmpeg{b}
	})
}

//queries

type ffprobeOutput struct {
	Streams []ffprobeStream `json:"streams"`
	Format  ffprobeFormat   `json:"format"`
}

type ffprobeStream struct {
	CodecType string `json:"codec_type"`
	CodecName string `json:"codec_name"`
	BitRate   string `json:"bit_rate"`
}

type ffprobeFormat struct {
	FormatName string `json:"format_name"`
	Duration   string `json:"duration"`
	Bitrate    string `json:"bit_rate"`
}

type GetTechMetadataResponse struct {
	Codec     string
	Extension string
	Duration  float64
	Bitrate   uint

	IsVideo     bool
	Unsupported bool
}

func (self *FFmpeg) GetTechMetadata(filePath string) (GetTechMetadataResponse, error) {
	cmd := exec.Command("ffprobe",
		"-v", "quiet",
		"-print_format", "json",
		"-show_entries", "stream=codec_type,codec_name,bit_rate:format=format_name,duration,bit_rate",
		filePath,
	)

	out, err := cmd.Output()
	if err != nil {
		log.Error(err)
		return GetTechMetadataResponse{}, err
	}

	var raw ffprobeOutput
	if err := json.Unmarshal(out, &raw); err != nil {
		log.Error(err)
		return GetTechMetadataResponse{}, err
	}

	for _, stream := range raw.Streams {
		if stream.CodecType == "video" && stream.CodecName != "mjpeg" && stream.CodecName != "png" {
			return GetTechMetadataResponse{IsVideo: true}, nil
		}
	}

	meta := GetTechMetadataResponse{}

	for _, stream := range raw.Streams {
		if stream.CodecType == "audio" {
			meta.Codec = stream.CodecName
			break
		}
	}

	if bitrate, ok := parseBitrate(raw.Format.Bitrate); ok {
		meta.Bitrate = bitrate
	} else {
		for _, stream := range raw.Streams {
			if stream.CodecType == "audio" {
				if bitrate, ok := parseBitrate(stream.BitRate); ok {
					meta.Bitrate = bitrate
					break
				}
			}
		}
	}

	if meta.Bitrate == 0 {
		return GetTechMetadataResponse{Unsupported: true}, nil
	}

	if duration, ok := parseDuration(raw.Format.Duration); ok {
		meta.Duration = duration
	} else {
		return GetTechMetadataResponse{Unsupported: true}, nil
	}

	tokens := splitFormatName(raw.Format.FormatName)

	has := func(needle string) bool {
		for _, token := range tokens {
			if token == needle || strings.Contains(token, needle) {
				return true
			}
		}

		return false
	}

	switch {
	case has("m4a") || has("mp4") || has("mov"):
		meta.Extension = ".m4a"

	case has("mp3"):
		meta.Extension = ".mp3"

	case has("ogg"):
		if meta.Codec == "opus" {
			meta.Extension = ".opus"
			break
		}

		meta.Extension = ".ogg"

	case has("opus"):
		meta.Extension = ".opus"

	case has("webm"):
		meta.Extension = ".weba"

	case has("matroska"):
		meta.Extension = ".mka"

	case has("flac"):
		meta.Extension = ".flac"

	case has("wav") || has("pcm"):
		meta.Extension = ".wav"

	case has("aiff") || has("aif"):
		meta.Extension = ".aiff"

	case has("aac"):
		meta.Extension = ".aac"

	case has("ac3"):
		meta.Extension = ".ac3"

	case has("eac3"):
		meta.Extension = ".eac3"

	case has("dts"):
		meta.Extension = ".dts"

	case has("truehd"):
		meta.Extension = ".thd"

	case has("amr"):
		meta.Extension = ".amr"

	case has("ape"):
		meta.Extension = ".ape"

	case has("wv") || has("wavpack"):
		meta.Extension = ".wv"

	case has("wma") || has("asf"):
		meta.Extension = ".wma"

	case has("caf"):
		meta.Extension = ".caf"

	case has("3gp") || has("3g2"):
		meta.Extension = ".3gp"

	case has("spx") || has("speex"):
		meta.Extension = ".spx"

	case has("ra") || has("rm"):
		meta.Extension = ".ra"

	default:
		return GetTechMetadataResponse{Unsupported: true}, nil
	}

	return meta, nil
}

func parseDuration(str string) (float64, bool) {
	str = strings.TrimSpace(str)

	if str == "" || str == "0" {
		return 0, false
	}

	value, err := strconv.ParseFloat(str, 64)
	if err != nil {
		return 0, false
	}

	return value, true
}

func parseBitrate(str string) (uint, bool) {
	str = strings.TrimSpace(str)

	if str == "" || str == "0" {
		return 0, false
	}

	var value uint
	fmt.Sscanf(str, "%d", &value)

	return value, true
}

func splitFormatName(s string) []string {
	parts := strings.Split(strings.ToLower(s), ",")
	out := make([]string, 0, len(parts))

	for _, part := range parts {
		if part = strings.TrimSpace(part); part != "" {
			out = append(out, part)
		}
	}

	return out
}
