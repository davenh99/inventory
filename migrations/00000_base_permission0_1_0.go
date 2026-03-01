package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{"name": "permission", "type": "base", "id": "pbc_permission", "fields": [{"name": "name", "type": "text", "max": 255, "required": true}, {"name": "collections", "type": "json"}, {"name": "canView", "type": "bool"}, {"name": "canList", "type": "bool"}, {"name": "canCreate", "type": "bool"}, {"name": "canUpdate", "type": "bool"}, {"name": "canDelete", "type": "bool"}, {"name": "created", "type": "autodate", "onCreate": true, "onUpdate": false}, {"name": "updated", "type": "autodate", "onCreate": true, "onUpdate": true}]}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_permission")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}