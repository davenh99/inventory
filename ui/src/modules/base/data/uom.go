package base_data

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
			Rounding     float64 `json:"rounding"`
			ReferenceUom bool    `json:"referenceUom"`
			Active       bool    `json:"active"`
		}

		data := []UOM{
			{Name: "Unit", Category: "unit", Ratio: 1, Rounding: 2, ReferenceUom: true, Active: true},
			{Name: "Box of 10", Category: "unit", Ratio: 10, Rounding: 2, Active: true},
			{Name: "L", Category: "volume", Ratio: 1, Rounding: 2, ReferenceUom: true, Active: true},
			{Name: "mL", Category: "volume", Ratio: 0.001, Rounding: 2, Active: true},
			{Name: "kg", Category: "weight", Ratio: 1, Rounding: 2, ReferenceUom: true, Active: true},
			{Name: "g", Category: "weight", Ratio: 0.001, Rounding: 2, Active: true},
		}

		for _, name := range data {
			record := core.NewRecord(uom)

			record.Set("name", name.Name)
			record.Set("category", name.Category)
			record.Set("ratio", name.Ratio)
			record.Set("rounding", name.Rounding)
			record.Set("referenceUom", name.ReferenceUom)
			record.Set("active", name.Active)

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
