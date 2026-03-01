package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{"name": "changelog", "type": "base", "id": "pbc_changelog0", "fields": [{"name": "collection", "type": "text", "required": true}, {"name": "record", "type": "text"}, {"name": "changeType", "type": "select", "required": true, "values": ["create", "update", "delete"]}, {"name": "changedBy", "type": "relation", "collectionId": "_pb_users_auth_", "maxSelect": 1, "minSelect": 0}, {"name": "reason", "type": "text"}, {"name": "created", "type": "autodate", "onCreate": true, "onUpdate": false}, {"name": "updated", "type": "autodate", "onCreate": true, "onUpdate": true}]}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_changelog0")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}