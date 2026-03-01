package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{"name": "supplierPrice", "type": "base", "id": "pbc_supplprice", "fields": [{"name": "productVariant", "type": "relation", "collectionId": "pbc_prodvar000", "minSelect": 0, "maxSelect": 1}, {"name": "partner", "type": "relation", "collectionId": "pbc_partner000", "minSelect": 0, "maxSelect": 1, "required": true}, {"name": "price", "type": "number"}, {"name": "uom", "title": "Unit of Measure", "type": "relation", "collectionId": "pbc_uom0000000", "minSelect": 0, "maxSelect": 1, "required": true}, {"name": "minQty", "title": "Minimum Order Quantity", "type": "number"}, {"name": "active", "type": "bool"}, {"name": "discount", "type": "number"}, {"name": "created", "type": "autodate", "onCreate": true, "onUpdate": false}, {"name": "updated", "type": "autodate", "onCreate": true, "onUpdate": true}]}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_supplprice")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}