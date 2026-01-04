package gentypes

import (
	"app/common"
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/spf13/cobra"
)

type Field struct {
	FieldName string
	FieldType string
	ReadOnly  bool
}

func (f Field) GetName() string  { return f.FieldName }
func (f Field) GetType() string  { return f.FieldType }
func (f Field) IsReadOnly() bool { return f.ReadOnly }

type Config struct {
	FilePath                   string
	CollectionAdditionalFields map[string][]common.Field
	PrintSelectOptions         bool
}

func Register(app *pocketbase.PocketBase, cfg Config) {
	app.RootCmd.AddCommand(&cobra.Command{
		Use: "gen-types",
		Run: func(cmd *cobra.Command, args []string) {
			err := cfg.generateTypes(app)
			if err != nil {
				fmt.Printf("error: %v\n", err)
			}
		},
	})

	app.OnCollectionAfterUpdateSuccess().BindFunc(func(e *core.CollectionEvent) error {
		err := cfg.generateTypes(app)
		if err != nil {
			return err
		}

		return e.Next()
	})
}

func (c *Config) generateTypes(app *pocketbase.PocketBase) error {
	collections, err := app.FindAllCollections()
	if err != nil {
		return err
	}

	root, err := projectRoot()
	if err != nil {
		panic(err)
	}

	constsPath := filepath.Join(strings.Trim(root, "\t\n\r "), c.FilePath, "pocketbase.ts")
	fConst, err := os.Create(constsPath)
	if err != nil {
		return err
	}
	defer fConst.Close()
	fmt.Fprintf(fConst, "/* This file was automatically generated, changes will be overwritten. */\n\n")
	fmt.Fprintf(fConst, "import PocketBase, { RecordService } from \"pocketbase\";\n\n")
	c.printCollectionConstants(fConst, collections)
	c.printCollectionRecordMap(fConst, collections)
	printTypedPocketBase(fConst)

	outPath := filepath.Join(strings.Trim(root, "\t\n\r "), c.FilePath, "base.d.ts")
	f, err := os.Create(outPath)
	if err != nil {
		return err
	}
	defer f.Close()

	f.WriteString("/* This file was automatically generated, changes will be overwritten. */\n\n")

	c.printBaseType(f)

	if c.PrintSelectOptions {
		optionsPath := filepath.Join(strings.Trim(root, "\t\n\r "), c.FilePath, "select-options.d.ts")

		fOptions, err := os.Create(optionsPath)
		if err != nil {
			return err
		}
		defer fOptions.Close()

		fOptions.WriteString("/* This file was automatically generated, changes will be overwritten. */\n\n")

		for _, collection := range collections {
			if !collection.System {
				if c.PrintSelectOptions {
					c.printCollectionSelectOptions(fOptions, collection)
				}
			}
		}

	}

	for _, collection := range collections {
		if !collection.System {
			c.printCollectionTypes(f, collection)
		}
	}

	return nil
}

func (c *Config) printBaseType(f *os.File) {
	fmt.Fprint(f, "interface BaseRecord {\n")

	baseFields := []string{"id", "collectionName", "collectionId", "created", "updated"}

	for _, field := range baseFields {
		fmt.Fprintf(f, "  %s: string;\n", field)
	}

	fmt.Fprint(f, "}\n\n")
}

func (c *Config) printCollectionSelectOptions(f *os.File, collection *core.Collection) {
	collectionName := capitalise(collection.Name)

	selectFields := make([]*core.SelectField, 0)

	for _, field := range collection.Fields {
		if field.Type() == "select" && !field.GetHidden() {
			if sf, ok := field.(*core.SelectField); ok {
				selectFields = append(selectFields, sf)
			}
		}
	}

	if len(selectFields) == 0 {
		return
	}

	fmt.Fprintf(f, "export const %sSelectOptions = {\n", collectionName)

	for _, sf := range selectFields {
		fieldName := sf.GetName()

		values := append([]string{}, sf.Values...)

		fmt.Fprintf(f, "  %s: [", fieldName)
		for i, v := range values {
			fmt.Fprintf(f, "%q", v)
			if i < len(values)-1 {
				fmt.Fprint(f, ", ")
			}
		}
		fmt.Fprintln(f, "],")
	}

	fmt.Fprint(f, "};\n\n")
}

func printTypedPocketBase(f *os.File) {
	fmt.Fprintln(f, "export interface TypedPocketBase extends PocketBase {")
	fmt.Fprintln(f, "  collection<K extends keyof CollectionRecords>(")
	fmt.Fprintln(f, "    name: K")
	fmt.Fprintln(f, "  ): RecordService<CollectionRecords[K]>;")
	fmt.Fprintln(f, "")
	fmt.Fprintln(f, "  // fallback for dynamic strings")
	fmt.Fprintln(f, "  collection(name: string): RecordService<any>;")
	fmt.Fprintln(f, "}")
	fmt.Fprintln(f, "")
}

func (c *Config) printCollectionConstants(f *os.File, collections []*core.Collection) {
	fmt.Fprintln(f, "export const Collections = {")
	for _, col := range collections {
		if col.System {
			continue
		}
		fmt.Fprintf(
			f,
			"  %s: %q,\n",
			capitalise(col.Name),
			col.Name,
		)
	}
	fmt.Fprintf(f, "} as const;\n\n")
}

func (c *Config) printCollectionRecordMap(f *os.File, collections []*core.Collection) {
	fmt.Fprintln(f, "export interface CollectionRecords {")
	for _, col := range collections {
		if col.System {
			continue
		}
		fmt.Fprintf(
			f,
			"  %s: %sRecord;\n",
			col.Name,
			capitalise(col.Name),
		)
	}
	fmt.Fprintf(f, "}\n\n")
}

func (c *Config) printCollectionTypes(f *os.File, collection *core.Collection) {
	collectionName := capitalise(collection.Name)

	fmt.Fprintf(f, "/* Collection type: %s */\n", collection.Type)
	fmt.Fprintf(f, "interface %s {\n", collectionName)

	for _, field := range collection.Fields {
		if field.Type() == "autodate" || field.GetName() == "id" || field.GetHidden() {
			continue
		}
		fmt.Fprintf(f, "  %s%s; // %s\n", field.GetName(), toTypeScriptType(field), field.Type())
	}

	for _, additionalField := range c.CollectionAdditionalFields[collection.Name] {
		readonly := ""
		if additionalField.IsReadOnly() {
			readonly = "readonly "
		}
		fmt.Fprintf(
			f,
			"  %s%s%s",
			readonly,
			additionalField.GetName(),
			additionalFieldToTypeScriptType(additionalField.GetType()),
		)
	}

	fmt.Fprint(f, "}\n\n")

	fmt.Fprintf(f, "type %sRecord = %s & BaseRecord;\n\n", collectionName, collectionName)
}

func capitalise(s string) string {
	if s == "" {
		return ""
	}

	firstLetter := s[0]
	rest := s[1:]

	return strings.ToUpper(string(firstLetter)) + rest
}

func projectRoot() (string, error) {
	cmd := exec.Command("git", "rev-parse", "--show-toplevel")
	cmd.Stderr = os.Stderr

	var out bytes.Buffer
	cmd.Stdout = &out

	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("failed to find git root: %w", err)
	}

	root := filepath.Clean(out.String())
	return root, nil
}

func toTypeScriptType(f core.Field) string {
	switch f.Type() {
	case "password":
		if sf, ok := f.(*core.PasswordField); ok {
			if sf.Required {
				return ": string"
			}
		}
		return "?: string"
	case "text":
		if sf, ok := f.(*core.TextField); ok {
			if sf.Required {
				return ": string"
			}
		}
		return "?: string"
	case "email":
		if sf, ok := f.(*core.EmailField); ok {
			if sf.Required {
				return ": string"
			}
		}
		return "?: string"
	case "relation":
		if sf, ok := f.(*core.RelationField); ok {
			res := ""
			if !sf.Required {
				res += "?"
			}
			res += ": string"
			if sf.MaxSelect > 1 {
				res += "[]"
			}
			return res
		}
		return "?: string"
	case "autodate":
		return ": string"
	case "date":
		if sf, ok := f.(*core.DateField); ok {
			if sf.Required {
				return ": string"
			}
		}
		return "?: string"
	case "url":
		if sf, ok := f.(*core.FileField); ok {
			if sf.Required {
				return ": string"
			}
		}
		return "?: string"
	case "file":
		if sf, ok := f.(*core.FileField); ok {
			if sf.Required {
				return ": string"
			}
		}
		return "?: string"
	case "select":
		if sf, ok := f.(*core.SelectField); ok {
			res := ""
			values := sf.Values

			if !sf.Required {
				values = append(values, "")
			}

			if len(values) > 0 {
				var quoted []string
				for _, v := range values {
					quoted = append(quoted, fmt.Sprintf("\"%s\"", v))
				}
				res = strings.Join(quoted, " | ")
			}

			if sf.MaxSelect > 1 {
				res = fmt.Sprintf("(%s)[]", res)
			}
			if sf.Required {
				return fmt.Sprintf(": %s", res)
			} else {
				return fmt.Sprintf("?: %s", res)
			}
		}
		return "?: string"
	case "number":
		if sf, ok := f.(*core.NumberField); ok {
			if sf.Required {
				return ": number"
			}
		}
		return "?: number"
	case "bool":
		if sf, ok := f.(*core.BoolField); ok {
			if sf.Required {
				return ": boolean"
			}
		}
		return "?: boolean"
	case "json":
		if sf, ok := f.(*core.JSONField); ok {
			if sf.Required {
				return ": any"
			}
		}
		return "?: any"
	default:
		return "?: unknown"
	}
}

func additionalFieldToTypeScriptType(fType string) string {
	res := ""

	switch fType {
	case "text":
		res = ": string"
	case "number":
		res = ": number"
	case "bool":
		res = ": boolean"
	case "json":
		res = ": any"
	default:
		res = ": unknown"
	}

	return fmt.Sprintf("%s; // %s\n", res, fType)
}
