package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{"name": "tag", "type": "base", "id": "pbc_tag0000000", "fields": [{"name": "name", "type": "text", "max": 255}, {"name": "colorHex", "type": "text"}, {"name": "created", "type": "autodate", "onCreate": true, "onUpdate": false}, {"name": "updated", "type": "autodate", "onCreate": true, "onUpdate": true}]}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_tag0000000")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}