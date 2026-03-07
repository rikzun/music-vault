package routing

import (
	"fmt"
	"net/http"
	"strings"

	swagno3 "github.com/go-swagno/swagno/v3"
	"github.com/go-swagno/swagno/v3/components/endpoint"
	"github.com/go-swagno/swagno/v3/components/http/response"
	"github.com/go-swagno/swagno/v3/components/security"
	"github.com/gofiber/fiber/v3"
)

type WrapperFunc = func(handler any, handlers ...any) (any, []any)
type InfoFunc = func() []endpoint.EndPointOption

type Config struct {
	App    *fiber.App
	Swagno *swagno3.OpenAPI

	Security    any
	WrapperFunc WrapperFunc
}

type routing struct {
	router fiber.Router
	swagno *swagno3.OpenAPI
	prefix string

	security    any
	wrapperFunc WrapperFunc

	isSecured bool
}

func DefaultWrapper(handler any, handlers ...any) (any, []any) {
	return handler, handlers
}

func New(config Config) *routing {
	return &routing{
		router: config.App,
		swagno: config.Swagno,

		security:    config.Security,
		wrapperFunc: config.WrapperFunc,
	}
}

func (self *routing) Group(prefix string, handlers ...any) *routing {
	cleanPrefix := "/" + strings.Trim(prefix, "/")
	group := self.router.Group(cleanPrefix, handlers...)

	var finalPrefix = self.prefix
	if cleanPrefix != "" {
		finalPrefix += "/" + cleanPrefix
	}

	return &routing{
		router: group,
		swagno: self.swagno,
		prefix: finalPrefix,

		security:    self.security,
		wrapperFunc: self.wrapperFunc,

		isSecured: self.isSecured,
	}
}

func (self *routing) GroupSecured(prefix string, handlers ...any) *routing {
	cleanPrefix := "/" + strings.Trim(prefix, "/")
	group := self.router.Group(cleanPrefix, append([]any{self.security}, handlers...)...)

	var finalPrefix = self.prefix
	if cleanPrefix != "" {
		finalPrefix += "/" + cleanPrefix
	}

	return &routing{
		router: group,
		swagno: self.swagno,
		prefix: finalPrefix,

		security:    self.security,
		wrapperFunc: self.wrapperFunc,

		isSecured: true,
	}
}

func (self *routing) openapiEndpoint(method endpoint.MethodType, path string, info InfoFunc) {
	var fullPath = "/" + strings.Trim(self.prefix, "/") + "/" + strings.Trim(path, "/")

	options := append(info(),
		endpoint.WithErrors(
			[]response.Response{
				response.New(
					struct{}{},
					fmt.Sprint(http.StatusInternalServerError),
					"Internal Server Error",
				),
			},
		),
	)

	if self.isSecured {
		options = append(options,
			endpoint.WithErrors(
				[]response.Response{
					response.New(
						struct{}{},
						fmt.Sprint(http.StatusUnauthorized),
						"Unauthorized",
					),
				},
			),
			endpoint.WithSecurity([]map[security.SecuritySchemeName][]string{
				{security.APIKeyAuth: []string{}},
			}),
		)
	}

	self.swagno.AddEndpoint(
		endpoint.New(method, fullPath, options...),
	)
}
