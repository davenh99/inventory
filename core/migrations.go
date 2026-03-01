package pbmodules

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

const migrationPlaceholder = `package migrations
// Placeholder to avoid compile errs if no migrations exist
// This file was auto-generated, manual changes will be overwritten.`

const migrationTemplate = `package migrations
// This file was auto-generated, manual changes will be overwritten.

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := ` + "`[%s]`" + `

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("%s")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}`

func prepareMigrationsDir(cfg Config) error {
	// wipe current migrations dir and create placeholder file
	err := os.RemoveAll(cfg.MigrationsDir)
	if err != nil {
		return fmt.Errorf("failed to reset migrations dir: %w", err)
	}

	err = os.MkdirAll(cfg.MigrationsDir, 0755)
	if err != nil {
		return fmt.Errorf("failed to create tmp dir: %w", err)
	}

	placeholderPath := filepath.Join(cfg.MigrationsDir, "main.go")
	err = os.WriteFile(placeholderPath, []byte(migrationPlaceholder), 0644)
	if err != nil {
		return fmt.Errorf("failed to write placeholder migration: %w", err)
	}

	return nil
}

func generateModuleMigrations(module Module, cfg Config, counter *int) error {
	fmt.Println("Generating migrations for module:", module.Name)

	for i, bytes := range module.PbCollections {
		version := strings.ReplaceAll(module.Version, ".", "_")

		collectionData := strings.TrimRight(string(bytes), "\n\r")
		collectionData = strings.ReplaceAll(collectionData, "`", `\u0060`)
		paddedCounter := fmt.Sprintf("%05d", *counter)

		migrationContent := fmt.Sprintf(migrationTemplate, collectionData, module.Collections[i].Id)
		migrationFileName := fmt.Sprintf("%s_%s_%s%s.go", paddedCounter, module.Name, module.Collections[i].Name, version)
		migrationFilePath := filepath.Join(cfg.MigrationsDir, migrationFileName)

		err := os.WriteFile(migrationFilePath, []byte(migrationContent), 0644)
		if err != nil {
			return fmt.Errorf("failed to write migration file for module %s: %w", module.Name, err)
		}

		*counter++
	}

	for i, bytes := range module.DataFiles {
		version := strings.ReplaceAll(module.Version, ".", "_")
		dataContent := strings.TrimRight(string(bytes), "\n\r")
		paddedCounter := fmt.Sprintf("%05d", *counter)

		// need to replace the first line package xxxx with package migrations
		lines := strings.SplitN(dataContent, "\n", 2)
		if len(lines) < 2 {
			return fmt.Errorf("invalid data file format for module %s", module.Name)
		}
		lines[0] = "package migrations"
		dataContent = strings.Join(lines, "\n")

		migrationFileName := fmt.Sprintf("%s_%s_%s%s_data.go", paddedCounter, module.Name, module.DataNames[i], version)
		migrationFilePath := filepath.Join(cfg.MigrationsDir, migrationFileName)

		err := os.WriteFile(migrationFilePath, []byte(dataContent), 0644)
		if err != nil {
			return fmt.Errorf("failed to write data migration file for module %s: %w", module.Name, err)
		}

		*counter++
	}

	return nil
}
