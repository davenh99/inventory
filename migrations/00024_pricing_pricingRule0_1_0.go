package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{"name": "pricingRule", "type": "base", "id": "pbc_pricingrul", "fields": [{"name": "name", "type": "text", "max": 255, "required": true}, {"name": "margin", "type": "number"}, {"name": "overhead", "type": "number"}, {"name": "default", "type": "bool"}, {"name": "tax", "type": "number"}, {"name": "created", "type": "autodate", "onCreate": true, "onUpdate": false}, {"name": "updated", "type": "autodate", "onCreate": true, "onUpdate": true}]}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_pricingrul")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}