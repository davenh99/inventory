package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{"name": "changelogDiff", "type": "base", "id": "pbc_changelogd", "fields": [{"name": "changelog", "type": "relation", "collectionId": "pbc_changelog0", "maxSelect": 1, "minSelect": 0, "required": true}, {"name": "field", "type": "text", "required": true}, {"name": "valueOld", "type": "text"}, {"name": "valueNew", "type": "text"}, {"name": "created", "type": "autodate", "onCreate": true, "onUpdate": false}, {"name": "updated", "type": "autodate", "onCreate": true, "onUpdate": true}]}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_changelogd")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}