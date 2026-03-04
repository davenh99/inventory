package pbmodules

// ATM just the field meta that pb doesn't have, but can expand to full collection def later
type CollectionFieldMeta struct {
	Name        string   `yaml:"name"`
	Title       string   `yaml:"title"`
	Type        string   `yaml:"type"`
	Values      []string `yaml:"values"`
	Description string   `yaml:"description"`
	Help        string   `yaml:"help"`
	Hidden      bool     `yaml:"hidden"`
}

type Collection struct {
	Name   string                `yaml:"name"`
	Id     string                `yaml:"id"`
	Fields []CollectionFieldMeta `yaml:"fields"`
}

type Module struct {
	Name            string   `yaml:"name"`
	Version         string   `yaml:"version"`
	Description     string   `yaml:"description"`
	Dependencies    []string `yaml:"depends"`
	CollectionNames []string `yaml:"models"`
	DataNames       []string `yaml:"data"`
	PbCollections   [][]byte
	Collections     []Collection
	DataFiles       [][]byte
}
