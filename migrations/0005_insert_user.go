package migrations

import (
	"app/utils"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		users, err := app.FindCollectionByNameOrId("user")
		if err != nil {
			return err
		}

		record := core.NewRecord(users)

		record.Set("email", utils.Env.AdminName)
		record.Set("password", utils.Env.AdminPassword)
		record.Set("role", "0000000000admin")

		return app.Save(record)
	}, func(app core.App) error {
		record, _ := app.FindAuthRecordByEmail("user", utils.Env.AdminName)
		if record == nil {
			return nil
		}

		return app.Delete(record)
	})
}
