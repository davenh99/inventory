package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `{
			"createRule": "@request.auth.id != '' && (\n\t\t\t\t   @request.auth.role.name = 'admin' || (\n\t\t\t\t     @request.auth.role.permissions.collections ?= '*' ||\n\t\t\t\t     @request.auth.role.permissions.collections ?= 'productVariant'\n\t\t\t\t   ) &&\n\t\t\t\t   @request.auth.role.permissions.collections.canCreate = true\n\t\t\t\t )",
			"deleteRule": "@request.auth.id != '' && (\n\t\t\t\t   @request.auth.role.name = 'admin' || (\n\t\t\t\t     @request.auth.role.permissions.collections ?= '*' ||\n\t\t\t\t     @request.auth.role.permissions.collections ?= 'productVariant'\n\t\t\t\t   ) &&\n\t\t\t\t   @request.auth.role.permissions.collections.canDelete = true\n\t\t\t\t )",
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
					"id": "text261109956",
					"max": 0,
					"min": 0,
					"name": "sku",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": false,
					"system": false,
					"type": "text"
				},
				{
					"cascadeDelete": false,
					"collectionId": "pbc_1108966215",
					"hidden": false,
					"id": "relation3544843437",
					"maxSelect": 1,
					"minSelect": 0,
					"name": "product",
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
			"id": "pbc_2186958209",
			"indexes": [],
			"listRule": "@request.auth.id != '' && (\n\t\t\t\t   @request.auth.role.name = 'admin' || (\n\t\t\t\t     @request.auth.role.permissions.collections ?= '*' ||\n\t\t\t\t     @request.auth.role.permissions.collections ?= 'productVariant'\n\t\t\t\t   ) &&\n\t\t\t\t   @request.auth.role.permissions.collections.canList = true\n\t\t\t\t )",
			"name": "productVariant",
			"system": false,
			"type": "base",
			"updateRule": "@request.auth.id != '' && (\n\t\t\t\t   @request.auth.role.name = 'admin' || (\n\t\t\t\t     @request.auth.role.permissions.collections ?= '*' ||\n\t\t\t\t     @request.auth.role.permissions.collections ?= 'productVariant'\n\t\t\t\t   ) &&\n\t\t\t\t   @request.auth.role.permissions.collections.canUpdate = true\n\t\t\t\t )",
			"viewRule": "@request.auth.id != '' && (\n\t\t\t\t   @request.auth.role.name = 'admin' || (\n\t\t\t\t     @request.auth.role.permissions.collections ?= '*' ||\n\t\t\t\t     @request.auth.role.permissions.collections ?= 'productVariant'\n\t\t\t\t   ) &&\n\t\t\t\t   @request.auth.role.permissions.collections.canView = true\n\t\t\t\t )"
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2186958209")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
