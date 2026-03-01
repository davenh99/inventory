package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{"name": "productCategory", "type": "base", "id": "pbc_prodcateg0", "fields": [{"name": "name", "type": "text", "max": 255}, {"name": "active", "type": "bool"}, {"name": "parent", "maxSelect": 1, "type": "relation", "collectionId": "pbc_prodcateg0"}, {"name": "created", "type": "autodate", "onCreate": true, "onUpdate": false}, {"name": "updated", "type": "autodate", "onCreate": true, "onUpdate": true}]}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_prodcateg0")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}