package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{"name": "product", "type": "base", "id": "pbc_prod000000", "fields": [{"name": "name", "type": "text", "max": 255, "required": true}, {"name": "active", "type": "bool"}, {"name": "type", "type": "select", "maxSelect": 1, "values": ["stockable", "consumable"]}, {"name": "canPurchase", "type": "bool"}, {"name": "canSell", "type": "bool"}, {"name": "uom", "type": "relation", "minSelect": 0, "maxSelect": 1, "collectionId": "pbc_uom0000000"}, {"name": "category", "type": "relation", "minSelect": 0, "maxSelect": 1, "collectionId": "pbc_prodcateg0"}, {"name": "description", "type": "text"}, {"name": "image", "type": "file"}, {"name": "tags", "type": "relation", "minSelect": 0, "maxSelect": 999, "collectionId": "pbc_tag0000000"}, {"name": "created", "type": "autodate", "onCreate": true, "onUpdate": false}, {"name": "updated", "type": "autodate", "onCreate": true, "onUpdate": true}]}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_prod000000")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}