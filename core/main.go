package pbmodules

import (
	"fmt"
)

type Config struct {
	ModulesDir    string
	MigrationsDir string
}

func GenerateMigrations(cfg Config) error {
	modules, err := discoverModules(cfg.ModulesDir)
	if err != nil {
		return err
	}

	sortedModules, err := sortModules(modules)
	if err != nil {
		return err
	}

	err = prepareMigrationsDir(cfg)
	if err != nil {
		return err
	}

	counter := 0
	for _, module := range sortedModules {
		err := generateModuleMigrations(module, cfg, &counter)
		if err != nil {
			return fmt.Errorf("failed to generate migrations for module %s: %w", module.Name, err)
		}
	}

	return nil
}
