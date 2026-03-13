package square

import (
	"github.com/pocketbase/pocketbase/core"
	square "github.com/square/square-go-sdk"
	client "github.com/square/square-go-sdk/client"
	option "github.com/square/square-go-sdk/option"
)

type Config struct {
	App               core.App
	SquareAccessToken string
}

func Register(app core.App, cfg Config) {
	app.OnServe().BindFunc(cfg.ImportSquareItems)
}

func (c *Config) ImportSquareItems(se *core.ServeEvent) error {
	se.Router.POST("/square/items/import", func(e *core.RequestEvent) error {
		client := client.NewClient(
			option.WithToken(
				c.SquareAccessToken,
			), option.WithBaseURL(square.Environments.Sandbox),
		)

		// locs, err := client.Locations.List(ctx)

		// if err != nil {
		// 	return err
		// }

		// for _, l := range locs.Locations {
		// 	println(l.ID, l.Name)
		// }

		// response, err := client.Catalog.List()
		// if err != nil {
		// 	return err
		// }

		return e.Next()
	})

	return se.Next()
}
