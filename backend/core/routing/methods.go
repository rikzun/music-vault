package routing

import "github.com/go-swagno/swagno/v3/components/endpoint"

func (self *routing) Get(path string, info InfoFunc, handler any, handlers ...any) {
	h, hs := self.wrapperFunc(handler, handlers...)

	self.router.Get(path, h, hs...)
	self.openapiEndpoint(endpoint.GET, path, info)
}

func (self *routing) Head(path string, info InfoFunc, handler any, handlers ...any) {
	h, hs := self.wrapperFunc(handler, handlers...)

	self.router.Head(path, h, hs...)
	self.openapiEndpoint(endpoint.HEAD, path, info)
}

func (self *routing) Post(path string, info InfoFunc, handler any, handlers ...any) {
	h, hs := self.wrapperFunc(handler, handlers...)

	self.router.Post(path, h, hs...)
	self.openapiEndpoint(endpoint.POST, path, info)
}

func (self *routing) Put(path string, info InfoFunc, handler any, handlers ...any) {
	h, hs := self.wrapperFunc(handler, handlers...)

	self.router.Put(path, h, hs...)
	self.openapiEndpoint(endpoint.PUT, path, info)
}

func (self *routing) Delete(path string, info InfoFunc, handler any, handlers ...any) {
	h, hs := self.wrapperFunc(handler, handlers...)

	self.router.Delete(path, h, hs...)
	self.openapiEndpoint(endpoint.DELETE, path, info)
}

func (self *routing) Options(path string, info InfoFunc, handler any, handlers ...any) {
	h, hs := self.wrapperFunc(handler, handlers...)

	self.router.Options(path, h, hs...)
	self.openapiEndpoint(endpoint.OPTIONS, path, info)
}

func (self *routing) Patch(path string, info InfoFunc, handler any, handlers ...any) {
	h, hs := self.wrapperFunc(handler, handlers...)

	self.router.Patch(path, h, hs...)
	self.openapiEndpoint(endpoint.PATCH, path, info)
}
