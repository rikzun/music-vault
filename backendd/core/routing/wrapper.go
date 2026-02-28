package routing

import (
	"log/slog"
	"os"
	"reflect"

	"github.com/gofiber/fiber/v3"
)

type argPlan struct {
	index   int
	resolve func(ctx fiber.Ctx) reflect.Value
}

var fiberCtxType = reflect.TypeFor[fiber.Ctx]()
var fiberHandlerType = reflect.TypeOf((*func(fiber.Ctx) error)(nil)).Elem()

func buildPlan(handlerType reflect.Type, args []any) []argPlan {
	argsValues := make([]reflect.Value, len(args))
	for i, f := range args {
		argsValues[i] = reflect.ValueOf(f)
	}

	var plan []argPlan
	for i := 0; i < handlerType.NumIn(); i++ {
		argType := handlerType.In(i)

		if argType == fiberCtxType {
			plan = append(plan, argPlan{index: i, resolve: func(ctx fiber.Ctx) reflect.Value {
				return reflect.ValueOf(ctx)
			}})

			continue
		}

		for _, fv := range argsValues {
			if argType != fv.Type() {
				continue
			}

			plan = append(plan, argPlan{index: i, resolve: func(_ fiber.Ctx) reflect.Value {
				return fv
			}})

			break
		}
	}

	return plan
}

func wrap(handler any, args []any) any {
	handlerVal := reflect.ValueOf(handler)
	handlerType := handlerVal.Type()

	if handlerType.Kind() != reflect.Func {
		return handler
	}

	plan := buildPlan(handlerType, args)
	if len(plan) == 0 {
		return handler
	}

	numIn := handlerType.NumIn()
	if len(plan) != numIn {
		slog.Error("not all required arguments were found")
		os.Exit(1)
	}

	return reflect.MakeFunc(fiberHandlerType, func(args []reflect.Value) []reflect.Value {
		ctx := args[0].Interface().(fiber.Ctx)

		filled := make([]reflect.Value, numIn)
		for _, p := range plan {
			filled[p.index] = p.resolve(ctx)
		}

		return handlerVal.Call(filled)
	}).Interface().(func(fiber.Ctx) error)
}

func Wrapper(args ...any) func(any, ...any) (any, []any) {
	return func(handler any, handlers ...any) (any, []any) {
		wrappedHandler := wrap(handler, args)

		wrappedHandlers := make([]any, len(handlers))
		for i, h := range handlers {
			wrappedHandlers[i] = wrap(h, args)
		}

		return wrappedHandler, wrappedHandlers
	}
}
