package migrations

import (
	"app/utils"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		uom, err := app.FindCollectionByNameOrId("uom")
		if err != nil {
			return err
		}

		type UOM struct {
			Name         string  `json:"name"`
			Category     string  `json:"category"`
			Ratio        float64 `json:"ratio"`
			ReferenceUom bool    `json:"referenceUom"`
			Active       bool    `json:"active"`
		}

		data := []UOM{
			{Name: "Unit(s)", Category: "units", Ratio: 1, ReferenceUom: true},
			{Name: "Item(s)", Category: "units", Ratio: 1},
			{Name: "Box of 10", Category: "units", Ratio: 10},
			{Name: "Dozen", Category: "units", Ratio: 12},
			{Name: "L", Category: "volume", Ratio: 1, ReferenceUom: true},
			{Name: "mL", Category: "volume", Ratio: 0.001},
			{Name: "kg", Category: "weight", Ratio: 1, ReferenceUom: true},
			{Name: "g", Category: "weight", Ratio: 0.001},
		}

		for _, name := range data {
			record := core.NewRecord(uom)

			record.Set("name", name.Name)
			record.Set("category", name.Category)
			record.Set("ratio", name.Ratio)
			record.Set("referenceUom", name.ReferenceUom)
			record.Set("active", true)

			app.Save(record)
		}

		return nil
	}, func(app core.App) error {
		record, _ := app.FindAuthRecordByEmail("user", utils.Env.AdminName)
		if record == nil {
			return nil
		}

		return app.Delete(record)
	})
}
