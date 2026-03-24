package core

import (
	computedfields "github.com/davenh99/pb-computedfields"
	"github.com/pocketbase/pocketbase/core"
)

var computedFieldsCfg = computedfields.Config{
	CollectionComputedFields: map[string][]computedfields.ComputedField{
		"productAttributeValue": {
			{
				FieldName: "name",
				FieldType: computedfields.TEXT,
				Compute: func(e *core.RecordEnrichEvent) any {
					prodAttrVal, err := e.App.FindRecordById("attributeValue", e.Record.GetString("attributeValue"))
					if err != nil {
						return ""
					}

					return prodAttrVal.GetString("name")
				},
			},
		},
		"productAttribute": {
			{
				FieldName: "name",
				FieldType: computedfields.TEXT,
				Compute: func(e *core.RecordEnrichEvent) any {
					prodAttr, err := e.App.FindRecordById("attribute", e.Record.GetString("attribute"))
					if err != nil {
						return ""
					}

					return prodAttr.GetString("name")
				},
			},
		},
	},
}
