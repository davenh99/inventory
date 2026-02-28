package main

import (
	"app/ui/src/modules/base/hooks/changelog"
	"app/ui/src/modules/base/hooks/role"
	"app/utils"
	"embed"
	"io/fs"
	"log"
	"net/http"

	computedfields "github.com/davenh99/pb-computedfields"
	"github.com/davenh99/pb-typescript/gentypes"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/ghupdate"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/hook"

	_ "app/migrations"
)

var Version = "dev"

//go:embed ui/dist/*
var embeddedFiles embed.FS

func main() {
	env := utils.Env
	app := pocketbase.New()

	computedfields.Register(app, computedfields.Config{})

	migrationsDir := "./migrations"
	if env.Env == "development" {
		migrationsDir = "../migrations"
	}

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: env.Env == "development",
		Dir:         migrationsDir,
	})

	changelog.Register(app, changelog.Config{
		Collections: map[string][]string{
			"user":           {"name"},
			"supplierPrice":  {"price", "discount"},
			"sellPrice":      {"priceSellSquare", "syncState"},
			"productVariant": {"syncState"},
		},
	})

	role.Register(app, role.Config{
		App: app,
		SkipCollectionRules: map[string]*role.SkipRules{
			"user":          nil,
			"changelog":     nil, // TODO make sure list and view allowed, maybe check if auth is not null?
			"changelogDiff": nil, // TODO make sure list and view allowed, maybe check if auth is not null?
			"role":          nil, // TODO make sure list and view allowed, maybe check if auth is not null?
			"permission":    nil, // TODO make sure list and view allowed, maybe check if auth is not null?
		},
	})

	switch env.Env {
	case "development":
		gentypes.Register(app, gentypes.Config{
			FilePath: "ui",
		})
	case "production":
		ghupdate.MustRegister(app, app.RootCmd, ghupdate.Config{
			Owner:             env.GithubOwner,
			Repo:              env.GithubRepo,
			ArchiveExecutable: env.ArchiveExecutable,
			HttpClient: &utils.AuthClient{
				Token: env.GithubToken,
				Base:  http.DefaultClient,
			},
		})
	}

	// frontend
	app.OnServe().Bind(&hook.Handler[*core.ServeEvent]{
		Func: func(e *core.ServeEvent) error {
			distFS, err := fs.Sub(embeddedFiles, "ui/dist")
			if err != nil {
				return err
			}

			e.Router.GET("/{path...}", apis.Static(distFS, true))

			return e.Next()
		},
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
