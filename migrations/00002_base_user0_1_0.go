package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{"name": "user", "type": "auth", "id": "_pb_users_auth_", "fields": [{"name": "avatar", "type": "file", "maxSelect": 1}, {"name": "name", "type": "text", "max": 255, "required": true}, {"name": "verified", "type": "bool", "system": true}, {"name": "emailVisibility", "type": "bool", "system": true}, {"name": "email", "type": "email", "system": true, "required": true}, {"name": "tokenKey", "autogeneratePattern": "[a-zA-Z0-9]{50}", "hidden": true, "min": 30, "max": 60, "type": "text", "system": true, "required": true}, {"name": "password", "type": "password", "system": true, "required": true, "hidden": true, "min": 8}, {"name": "role", "type": "relation", "collectionId": "pbc_role000000", "required": true}, {"name": "created", "type": "autodate", "onCreate": true, "onUpdate": false}, {"name": "updated", "type": "autodate", "onCreate": true, "onUpdate": true}], "deleteRule": "id = @request.auth.id", "updateRule": "id = @request.auth.id", "indexes": ["CREATE UNIQUE INDEX \u0060idx_tokenKey__pb_users_auth_\u0060 ON \u0060user\u0060(\u0060tokenKey\u0060)", "CREATE UNIQUE INDEX \u0060idx_email__pb_users_auth_\u0060 ON \u0060user\u0060(\u0060email\u0060) WHERE \u0060email\u0060 != ''"]}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}