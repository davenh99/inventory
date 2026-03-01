package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{"name": "uom", "type": "base", "id": "pbc_uom0000000", "fields": [{"name": "name", "type": "text", "max": 255, "required": true}, {"name": "category", "maxSelect": 1, "type": "select", "values": ["weight", "volume", "units"], "required": true}, {"name": "ratio", "type": "number"}, {"name": "referenceUom", "type": "bool"}, {"name": "active", "type": "bool"}, {"name": "created", "type": "autodate", "onCreate": true, "onUpdate": false}, {"name": "updated", "type": "autodate", "onCreate": true, "onUpdate": true}]}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_uom0000000")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}