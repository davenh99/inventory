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
		if err := collection.Fields.AddMarshaledJSONAt(13, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text1493719061",
			"max": 0,
			"min": 0,
			"name": "squareItem",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": false,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(14, []byte(`{
			"hidden": false,
			"id": "date2523285697",
			"max": "",
			"min": "",
			"name": "squareLastSync",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "date"
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
		collection.Fields.RemoveById("text1493719061")

		// remove field
		collection.Fields.RemoveById("date2523285697")

		return app.Save(collection)
	})
}
