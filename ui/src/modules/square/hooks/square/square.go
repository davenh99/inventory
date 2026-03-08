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
	// serves static files from the provided public dir (if exists)
	se.Router.POST("/square/import", func(e *core.RequestEvent) error {
		client := client.NewClient(
			option.WithToken(
				cfg.SquareAccessToken,
			), option.WithBaseURL(square.Environments.Sandbox),
		)
		return nil
	})

	return se.Next()
}
