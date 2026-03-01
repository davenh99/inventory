package pbmodules

import (
	"fmt"
	"log"
	"os"

	"github.com/goccy/go-yaml"
)

func discoverModules(modulesDir string) ([]Module, error) {
	entries, err := os.ReadDir(modulesDir)
	if err != nil {
		return nil, err
	}

	modules := []Module{}

	for _, entry := range entries {
		modDeclaration := fmt.Sprintf("%s/%s/%s", modulesDir, entry.Name(), "module.yaml")

		content, err := os.ReadFile(modDeclaration)
		if err != nil {
			log.Printf("Could not find module declaration in directory %s: %v\n", entry.Name(), err)
			continue
		}

		mod := Module{}
		err = yaml.Unmarshal(content, &mod)

		pbCollections := make([][]byte, len(mod.CollectionNames))
		collections := make([]Collection, len(mod.CollectionNames))
		dataFiles := make([][]byte, len(mod.DataNames))

		for i, model := range mod.CollectionNames {
			modelPath := fmt.Sprintf("%s/%s/%s/%s%s", modulesDir, entry.Name(), "models", model, ".yaml")
			modelContent, err := os.ReadFile(modelPath)
			if err != nil {
				log.Printf("Could not read model file %s: %v\n", modelPath, err)
				continue
			}
			collectionMeta := &Collection{}

			// convert yaml to json to insert into migration.
			modelJson, err := yaml.YAMLToJSON(modelContent)
			if err != nil {
				log.Printf("Could not convert model file %s from yaml to json: %v\n", modelPath, err)
				continue
			}
			pbCollections[i] = modelJson

			// unmarshal collection meta (will combine with above in future)
			err = yaml.Unmarshal(modelContent, collectionMeta)
			if err != nil {
				log.Printf("Could not parse model metadata file %s: %v\n", modelPath, err)
				continue
			}

			collections[i] = *collectionMeta
		}
		mod.PbCollections = pbCollections
		mod.Collections = collections

		for i, data := range mod.DataNames {
			dataPath := fmt.Sprintf("%s/%s/%s/%s%s", modulesDir, entry.Name(), "data", data, ".go")
			dataContent, err := os.ReadFile(dataPath)
			if err != nil {
				log.Printf("Could not read data file %s: %v\n", dataPath, err)
				continue
			}
			dataFiles[i] = dataContent
		}
		mod.DataFiles = dataFiles

		modules = append(modules, mod)
	}

	return modules, nil
}
