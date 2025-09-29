package custom

import (
	"backend/domain"
	"backend/domain/services"
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Context struct {
	raw     *gin.Context
	Request *http.Request
}

func (ctx *Context) BindJSON(obj any) bool {
	if err := ctx.raw.ShouldBindJSON(obj); err != nil {
		ctx.raw.JSON(http.StatusBadRequest, transform(err))
		ctx.raw.Abort()
		return false
	}

	return true
}

func (ctx *Context) ClientID() *uint {
	id, exists := ctx.raw.Get("clientID")

	if !exists {
		return nil
	}

	clientID, ok := id.(uint)

	if !ok {
		return nil
	}

	return &clientID
}

func (ctx *Context) Client() *domain.ClientEntity {
	id, exists := ctx.raw.Get("clientID")

	if !exists {
		return nil
	}

	clientID, ok := id.(uint)

	if !ok {
		return nil
	}

	return services.Client.FindByID(clientID)
}

// Status sets the HTTP response code.
func (ctx *Context) Status(code int) {
	ctx.raw.Status(code)
}

// AbortWithStatus calls `Abort()` and writes the headers with the specified status code.
// For example, a failed attempt to authenticate a request could use: context.AbortWithStatus(401).
func (ctx *Context) AbortWithStatus(code int) {
	ctx.raw.AbortWithStatus(code)
}

// JSON serializes the given struct as JSON into the response body. It also sets the Content-Type as "application/json".
func (ctx *Context) JSON(code int, obj any) {
	ctx.raw.JSON(code, obj)
}

func (ctx *Context) ApiError(err ApiError) {
	ctx.JSON(err.Status, err.Error)
}

// RemoteIP parses the IP from Request.RemoteAddr, normalizes and returns the IP (without the port).
func (ctx *Context) RemoteAddress() string {
	return ctx.raw.RemoteIP()
}

// RemoteIP parses the IP from Request.RemoteAddr, normalizes and returns the IP (without the port).
func (ctx *Context) RemoteAddressPtr() *string {
	return utils.StringPtrOrNil(ctx.raw.RemoteIP())
}

// GetHeader returns value from request headers.
func (ctx *Context) GetHeader(key string) string {
	return ctx.raw.GetHeader(key)
}

// GetHeader returns value from request headers.
func (ctx *Context) GetHeaderPtr(key string) *string {
	return utils.StringPtrOrNil(ctx.raw.GetHeader(key))
}
