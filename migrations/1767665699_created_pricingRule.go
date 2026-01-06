package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `{
			"createRule": "@request.auth.id != '' && (\n\t\t\t\t   @request.auth.role.name = 'admin' || (\n\t\t\t\t     @request.auth.role.permissions.collections ?= '*' ||\n\t\t\t\t     @request.auth.role.permissions.collections ?= 'pricingRule'\n\t\t\t\t   ) &&\n\t\t\t\t   @request.auth.role.permissions.collections.canCreate = true\n\t\t\t\t )",
			"deleteRule": "@request.auth.id != '' && (\n\t\t\t\t   @request.auth.role.name = 'admin' || (\n\t\t\t\t     @request.auth.role.permissions.collections ?= '*' ||\n\t\t\t\t     @request.auth.role.permissions.collections ?= 'pricingRule'\n\t\t\t\t   ) &&\n\t\t\t\t   @request.auth.role.permissions.collections.canDelete = true\n\t\t\t\t )",
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
					"id": "bool3814588639",
					"name": "default",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "bool"
				},
				{
					"hidden": false,
					"id": "number862046937",
					"max": null,
					"min": null,
					"name": "margin",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number3201141929",
					"max": null,
					"min": null,
					"name": "overhead",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number2390866550",
					"max": null,
					"min": null,
					"name": "tax",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number2786054473",
					"max": null,
					"min": null,
					"name": "roundingPlaces",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
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
			"id": "pbc_4179629510",
			"indexes": [],
			"listRule": "@request.auth.id != '' && (\n\t\t\t\t   @request.auth.role.name = 'admin' || (\n\t\t\t\t     @request.auth.role.permissions.collections ?= '*' ||\n\t\t\t\t     @request.auth.role.permissions.collections ?= 'pricingRule'\n\t\t\t\t   ) &&\n\t\t\t\t   @request.auth.role.permissions.collections.canList = true\n\t\t\t\t )",
			"name": "pricingRule",
			"system": false,
			"type": "base",
			"updateRule": "@request.auth.id != '' && (\n\t\t\t\t   @request.auth.role.name = 'admin' || (\n\t\t\t\t     @request.auth.role.permissions.collections ?= '*' ||\n\t\t\t\t     @request.auth.role.permissions.collections ?= 'pricingRule'\n\t\t\t\t   ) &&\n\t\t\t\t   @request.auth.role.permissions.collections.canUpdate = true\n\t\t\t\t )",
			"viewRule": "@request.auth.id != '' && (\n\t\t\t\t   @request.auth.role.name = 'admin' || (\n\t\t\t\t     @request.auth.role.permissions.collections ?= '*' ||\n\t\t\t\t     @request.auth.role.permissions.collections ?= 'pricingRule'\n\t\t\t\t   ) &&\n\t\t\t\t   @request.auth.role.permissions.collections.canView = true\n\t\t\t\t )"
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_4179629510")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
