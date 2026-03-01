package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{"name": "partner", "type": "base", "id": "pbc_partner000", "fields": [{"name": "name", "type": "text", "max": 255, "required": true}, {"name": "created", "type": "autodate", "onCreate": true, "onUpdate": false}, {"name": "updated", "type": "autodate", "onCreate": true, "onUpdate": true}]}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_partner000")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}