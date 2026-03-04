package pbmodules

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func generateFieldSchema(modules []Module, cfg Config) error {
	// need typed as below sort of:
	/*import {CollectionRecords} from "./pocketbase-types";
	export type FieldSchema = {
	  [C in keyof CollectionRecords]: Record
	    keyof CollectionRecords[C],
	    {
	      type: string;
	      title: string;
	      description: string;
	      help: string;
	      options?: {
	        label: string;
	        value: string;
	      }[];
	    }
	  >;
	};
	*/
	// Collect all collections and their field metadata
	fieldSchema := make(map[string]map[string]CollectionFieldMeta)

	for _, module := range modules {
		for _, collection := range module.Collections {
			if fieldSchema[collection.Name] == nil {
				fieldSchema[collection.Name] = make(map[string]CollectionFieldMeta)
			}
			for _, field := range collection.Fields {
				fieldSchema[collection.Name][field.Name] = field
			}
		}
	}

	// Create the TypeScript file content
	var tsContent strings.Builder
	tsContent.WriteString(`/* This file was automatically generated, changes will be overwritten. */

import { CollectionRecords } from "./pocketbase-types";

type FieldType =
  | "text"
  | "number"
  | "bool"
  | "relation"
  | "select"
  | "json"
  | "file"
  | "date"
  | "autodate"
  | "email";

type FieldDefinition = {
  type: FieldType;
  title: string;
  description: string;
  help: string;
  options?: {
    label: string;
    value: string;
  }[];
};

export type FieldSchema = {
  [C in keyof CollectionRecords]?: {
    [F in keyof CollectionRecords[C]]?: FieldDefinition;
  };
};`)

	tsContent.WriteString(`

export const fieldSchema: FieldSchema = `)

	// Build the field schema object
	schemaObj := make(map[string]map[string]any)
	for collectionName, fields := range fieldSchema {
		schemaObj[collectionName] = make(map[string]any)
		for fieldName, fieldMeta := range fields {
			if !fieldMeta.Hidden {
				title := fieldMeta.Title
				values := []map[string]string{}
				if title == "" {
					title = camelCaseToLabel(fieldName)
				}
				if fieldMeta.Values != nil {
					for _, opt := range fieldMeta.Values {
						values = append(values, map[string]string{
							"value": opt,
							"label": camelCaseToLabel(opt),
						})
					}
				}
				schemaObj[collectionName][fieldName] = map[string]any{
					"title":       title,
					"type":        fieldMeta.Type,
					"options":     values,
					"description": fieldMeta.Description,
					"help":        fieldMeta.Help,
				}
			}
		}
	}

	// Marshal to JSON with proper formatting
	schemaJSON, err := json.MarshalIndent(schemaObj, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal field schema to JSON: %w", err)
	}

	tsContent.WriteString(string(schemaJSON) + ";\n")

	// Ensure the directory exists
	err = os.MkdirAll(cfg.FieldSchemaDir, 0755)
	if err != nil {
		return fmt.Errorf("failed to create field schema directory: %w", err)
	}

	// Write to file
	schemaFilePath := filepath.Join(cfg.FieldSchemaDir, "field-schema.ts")
	err = os.WriteFile(schemaFilePath, []byte(tsContent.String()), 0644)
	if err != nil {
		return fmt.Errorf("failed to write field schema file: %w", err)
	}

	fmt.Printf("Generated field schema at %s\n", schemaFilePath)
	return nil
}
