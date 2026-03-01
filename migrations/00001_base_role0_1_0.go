package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{"name": "role", "type": "base", "id": "pbc_role000000", "fields": [{"name": "name", "type": "text", "max": 255, "required": true}, {"name": "permissions", "maxSelect": 999, "minSelect": 0, "type": "relation", "collectionId": "pbc_permission"}, {"name": "created", "type": "autodate", "onCreate": true, "onUpdate": false}, {"name": "updated", "type": "autodate", "onCreate": true, "onUpdate": true}]}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_role000000")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}