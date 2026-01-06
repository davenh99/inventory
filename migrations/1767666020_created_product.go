package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `{
			"createRule": "@request.auth.id != '' && (\n\t\t\t\t   @request.auth.role.name = 'admin' || (\n\t\t\t\t     @request.auth.role.permissions.collections ?= '*' ||\n\t\t\t\t     @request.auth.role.permissions.collections ?= 'product'\n\t\t\t\t   ) &&\n\t\t\t\t   @request.auth.role.permissions.collections.canCreate = true\n\t\t\t\t )",
			"deleteRule": "@request.auth.id != '' && (\n\t\t\t\t   @request.auth.role.name = 'admin' || (\n\t\t\t\t     @request.auth.role.permissions.collections ?= '*' ||\n\t\t\t\t     @request.auth.role.permissions.collections ?= 'product'\n\t\t\t\t   ) &&\n\t\t\t\t   @request.auth.role.permissions.collections.canDelete = true\n\t\t\t\t )",
			"fields": [
				{
					"autogeneratePattern": "[a-z0-9]{15}",
					"hidden": false,
					"id": "text3208210256",
					"max": 15,
					"min": 15,
					"name": "id",
					"pattern": "^[a-z0-9]+$",
					"presentable": false,
					"primaryKey": true,
					"required": true,
					"system": true,
					"type": "text"
				},
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "text1579384326",
					"max": 0,
					"min": 0,
					"name": "name",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": false,
					"system": false,
					"type": "text"
				},
				{
					"hidden": false,
					"id": "select2363381545",
					"maxSelect": 1,
					"name": "type",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "select",
					"values": [
						"stockable",
						"consumable"
					]
				},
				{
					"hidden": false,
					"id": "bool4118157481",
					"name": "canPurchase",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "bool"
				},
				{
					"hidden": false,
					"id": "bool3631234186",
					"name": "canSell",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "bool"
				},
				{
					"cascadeDelete": false,
					"collectionId": "pbc_1933247317",
					"hidden": false,
					"id": "relation2082281764",
					"maxSelect": 1,
					"minSelect": 0,
					"name": "uom",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "relation"
				},
				{
					"cascadeDelete": false,
					"collectionId": "pbc_1174553048",
					"hidden": false,
					"id": "relation105650625",
					"maxSelect": 1,
					"minSelect": 0,
					"name": "category",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "relation"
				},
				{
					"hidden": false,
					"id": "bool1260321794",
					"name": "active",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "bool"
				},
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "text1843675174",
					"max": 0,
					"min": 0,
					"name": "description",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": false,
					"system": false,
					"type": "text"
				},
				{
					"cascadeDelete": false,
					"collectionId": "pbc_4179629510",
					"hidden": false,
					"id": "relation164705970",
					"maxSelect": 1,
					"minSelect": 0,
					"name": "pricingRule",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "relation"
				},
				{
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
				},
				{
					"hidden": false,
					"id": "autodate2990389176",
					"name": "created",
					"onCreate": true,
					"onUpdate": false,
					"presentable": false,
					"system": false,
					"type": "autodate"
				},
				{
					"hidden": false,
					"id": "autodate3332085495",
					"name": "updated",
					"onCreate": true,
					"onUpdate": true,
					"presentable": false,
					"system": false,
					"type": "autodate"
				}
			],
			"id": "pbc_1108966215",
			"indexes": [],
			"listRule": "@request.auth.id != '' && (\n\t\t\t\t   @request.auth.role.name = 'admin' || (\n\t\t\t\t     @request.auth.role.permissions.collections ?= '*' ||\n\t\t\t\t     @request.auth.role.permissions.collections ?= 'product'\n\t\t\t\t   ) &&\n\t\t\t\t   @request.auth.role.permissions.collections.canList = true\n\t\t\t\t )",
			"name": "product",
			"system": false,
			"type": "base",
			"updateRule": "@request.auth.id != '' && (\n\t\t\t\t   @request.auth.role.name = 'admin' || (\n\t\t\t\t     @request.auth.role.permissions.collections ?= '*' ||\n\t\t\t\t     @request.auth.role.permissions.collections ?= 'product'\n\t\t\t\t   ) &&\n\t\t\t\t   @request.auth.role.permissions.collections.canUpdate = true\n\t\t\t\t )",
			"viewRule": "@request.auth.id != '' && (\n\t\t\t\t   @request.auth.role.name = 'admin' || (\n\t\t\t\t     @request.auth.role.permissions.collections ?= '*' ||\n\t\t\t\t     @request.auth.role.permissions.collections ?= 'product'\n\t\t\t\t   ) &&\n\t\t\t\t   @request.auth.role.permissions.collections.canView = true\n\t\t\t\t )"
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1108966215")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
