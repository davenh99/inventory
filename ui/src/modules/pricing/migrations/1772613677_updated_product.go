package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_prod000000")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(12, []byte(`{
			"cascadeDelete": false,
			"collectionId": "pbc_pricingrul",
			"hidden": false,
			"id": "relation164705970",
			"maxSelect": 1,
			"minSelect": 0,
			"name": "pricingRule",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_prod000000")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("relation164705970")

		return app.Save(collection)
	})
}
