package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{"name": "productVariant", "type": "base", "id": "pbc_prodvar000", "fields": [{"name": "squareItemVariation", "type": "text"}, {"name": "sellPriceSquare", "type": "number"}, {"name": "squareLastSync", "type": "date"}]}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_prodvar000")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}