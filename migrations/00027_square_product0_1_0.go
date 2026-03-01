package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{"name": "product", "type": "base", "id": "pbc_prod000000", "fields": [{"name": "squareItem", "type": "text"}, {"name": "squareLastSync", "type": "date"}]}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_prod000000")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}