package core

import (
	"app/core/changelog"
	"app/core/inventory"
	"app/core/role"
	"app/utils"
	"net/http"

	computedfields "github.com/davenh99/pb-computedfields"
	"github.com/davenh99/pb-typescript/gentypes"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/plugins/ghupdate"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func RegisterHooks(app *pocketbase.PocketBase) {
	env := utils.Env

	computedfields.Register(app, computedFieldsCfg)
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: env.Env == "development",
	})

	changelog.Register(app, changelog.Config{
		Collections: map[string][]string{
			"user":          {"name"},
			"supplierPrice": {"price", "discount"},
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
			FilePath:                   "ui",
			CollectionAdditionalFields: computedFieldsCfg.ExtractFields(),
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

	inventory.Register(app)
}
