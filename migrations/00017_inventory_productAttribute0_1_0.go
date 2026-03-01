package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{"name": "productAttribute", "type": "base", "id": "pbc_prodattr00", "fields": [{"name": "active", "type": "bool"}, {"name": "attribute", "type": "relation", "collectionId": "pbc_attribute0", "minSelect": 0, "maxSelect": 1}, {"name": "product", "type": "relation", "collectionId": "pbc_prod000000", "minSelect": 0, "maxSelect": 1, "required": true}, {"name": "created", "type": "autodate", "onCreate": true, "onUpdate": false}, {"name": "updated", "type": "autodate", "onCreate": true, "onUpdate": true}]}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_prodattr00")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}