package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{"name": "productAttributeValue", "type": "base", "id": "pbc_prodattval", "fields": [{"name": "product", "type": "relation", "collectionId": "pbc_prod000000", "minSelect": 0, "maxSelect": 1}, {"name": "active", "type": "bool"}, {"name": "attributeValue", "type": "relation", "collectionId": "pbc_attributev", "minSelect": 0, "maxSelect": 1, "required": true}, {"name": "created", "type": "autodate", "onCreate": true, "onUpdate": false}, {"name": "updated", "type": "autodate", "onCreate": true, "onUpdate": true}]}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_prodattval")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}