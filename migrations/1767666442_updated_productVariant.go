package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2186958209")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text878546704",
			"max": 0,
			"min": 0,
			"name": "squareVariation",
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
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text2909174273",
			"max": 0,
			"min": 0,
			"name": "squareVersion",
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
		if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
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

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(7, []byte(`{
			"hidden": false,
			"id": "select1839276459",
			"maxSelect": 1,
			"name": "syncState",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "select",
			"values": [
				"sync",
				"drift",
				"overridden"
			]
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(8, []byte(`{
			"cascadeDelete": false,
			"collectionId": "pbc_212839922",
			"hidden": false,
			"id": "relation1874629670",
			"maxSelect": 999,
			"minSelect": 0,
			"name": "tags",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2186958209")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("text878546704")

		// remove field
		collection.Fields.RemoveById("text2909174273")

		// remove field
		collection.Fields.RemoveById("date2523285697")

		// remove field
		collection.Fields.RemoveById("select1839276459")

		// remove field
		collection.Fields.RemoveById("relation1874629670")

		return app.Save(collection)
	})
}
