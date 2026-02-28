package routing

import (
	"fmt"
	"net/http"
	"strings"

	swagno3 "github.com/go-swagno/swagno/v3"
	"github.com/go-swagno/swagno/v3/components/endpoint"
	"github.com/go-swagno/swagno/v3/components/http/response"
	"github.com/gofiber/fiber/v3"
)

type WrapperFunc func(handler any, handlers ...any) (any, []any)
type InfoFunc = func() []endpoint.EndPointOption

type Config struct {
	App         *fiber.App
	Swagno      *swagno3.OpenAPI
	Prefix      string
	WrapperFunc WrapperFunc
}

type routing struct {
	router      fiber.Router
	swagno      *swagno3.OpenAPI
	prefix      string
	wrapperFunc WrapperFunc
}

func DefaultWrapper(handler any, handlers ...any) (any, []any) {
	return handler, handlers
}

func New(config Config) *routing {
	prefix := "/" + strings.Trim(config.Prefix, "/")

	return &routing{
		router:      config.App.Group(prefix),
		swagno:      config.Swagno,
		prefix:      prefix,
		wrapperFunc: config.WrapperFunc,
	}
}

func (self *routing) Group(prefix string, handlers ...any) *routing {
	cleanPrefix := strings.Trim(prefix, "/")
	group := self.router.Group(cleanPrefix, handlers...)

	var finalPrefix = self.prefix
	if cleanPrefix != "" {
		finalPrefix += "/" + cleanPrefix
	}

	return &routing{
		router:      group,
		swagno:      self.swagno,
		prefix:      finalPrefix,
		wrapperFunc: self.wrapperFunc,
	}
}

func (self *routing) openapiEndpoint(method endpoint.MethodType, path string, info InfoFunc) {
	var fullPath = strings.Trim(self.prefix, "/") + "/" + strings.Trim(path, "/")

	options := append(info(), endpoint.WithErrors(
		[]response.Response{
			response.New(
				struct{}{},
				fmt.Sprint(http.StatusInternalServerError),
				"Internal Server Error",
			),
		}),
	)

	self.swagno.AddEndpoint(
		endpoint.New(method, fullPath, options...),
	)
}
