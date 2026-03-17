package inventory

import (
	"encoding/json"
	"fmt"
	"io"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func Register(app *pocketbase.PocketBase) {
	app.OnRecordCreateRequest("product").BindFunc(attachProductAttributesAndValues)
	app.OnRecordUpdateRequest("product").BindFunc(attachProductAttributesAndValues)

	app.OnRecordCreateExecute("product").BindFunc(upsertProductAttributesAndValues)
	app.OnRecordUpdateExecute("product").BindFunc(upsertProductAttributesAndValues)
}

func attachProductAttributesAndValues(e *core.RecordRequestEvent) error {
	body, _ := io.ReadAll(e.Request.Body)

	var payload map[string]any
	json.Unmarshal(body, &payload)

	// If expand data is present, add productAttribute_via_product to the record data for response
	if expand, ok := payload["expand"].(map[string]any); ok {
		if productAttrs, ok := expand["productAttribute_via_product"].([]any); ok {
			e.Record.Set("productAttributes", productAttrs)
		}
	}

	return e.Next()
}

func upsertProductAttributesAndValues(e *core.RecordEvent) error {
	prodAttrColl, _ := e.App.FindCollectionByNameOrId("productAttribute")
	prodAttrValColl, _ := e.App.FindCollectionByNameOrId("productAttributeValue")
	productAttributes := e.Record.Get("productAttributes").([]any)
	productID := e.Record.Id

	prodAttrfilter := fmt.Sprintf("product = '%s'", productID)

	// If expand data is present, process productAttribute_via_product
	for _, attr := range productAttributes {
		attrMap := attr.(map[string]any)

		// Save productAttribute record
		var prodAttrRecord *core.Record

		if id, ok := attrMap["id"].(string); ok && id != "" {
			// add existing prodattr id to filter to exclude from deleting
			prodAttrfilter += fmt.Sprintf(" && id != '%s'", id)
			// If ID is present, load existing record for update
			prodAttrRec, err := e.App.FindRecordById(prodAttrColl, id)
			if err != nil {
				return err
			}
			prodAttrRecord = prodAttrRec
		} else {
			prodAttrRecord = core.NewRecord(prodAttrColl)
		}
		prodAttrRecord.Load(attrMap)
		prodAttrRecord.Set("product", productID)
		err := e.App.Save(prodAttrRecord)
		if err != nil {
			return err
		}
		// add the new id to the filter to exclude from deleting
		prodAttrfilter += fmt.Sprintf(" && id != '%s'", prodAttrRecord.Id)

		prodAttrValfilter := fmt.Sprintf("product = '%s' && productAttribute = '%s'", productID, prodAttrRecord.Id)

		// Save nested productAttributeValue records
		if attrExpand, ok := attrMap["expand"].(map[string]any); ok {
			if prodAttrValues, ok := attrExpand["productAttributeValue_via_productAttribute"].([]any); ok {
				for _, val := range prodAttrValues {
					valMap := val.(map[string]any)

					// Save productAttributeValue record
					var prodAttrValRecord *core.Record

					if id, ok := valMap["id"].(string); ok && id != "" {
						// remove attr values where attr value attr not equal to productattr attr
						if prodAttrValExpand, ok := valMap["expand"].(map[string]any); ok {
							if attrVal, ok := prodAttrValExpand["attributeValue"].(map[string]any); ok {
								if attrValAttr, ok := attrVal["attribute"].(string); ok && attrValAttr == prodAttrRecord.GetString("attribute") {
									// add existing prodattrval id to filter to exclude from deleting
									prodAttrValfilter += fmt.Sprintf(" && id != '%s'", id)

									// If ID and attribute are present, load existing record for update
									prodAttrValRec, err := e.App.FindRecordById(prodAttrValColl, id)
									if err != nil {
										return err
									}
									prodAttrValRecord = prodAttrValRec
								} else {
									continue
								}
							}
						}
					} else {
						prodAttrValRecord = core.NewRecord(prodAttrValColl)
					}

					prodAttrValRecord.Load(valMap)
					prodAttrValRecord.Set("productAttribute", prodAttrRecord.Id)
					prodAttrValRecord.Set("product", productID)
					err := e.App.Save(prodAttrValRecord)
					if err != nil {
						return err
					}

					// add the new id to the filter to exclude from deleting
					prodAttrValfilter += fmt.Sprintf(" && id != '%s'", prodAttrValRecord.Id)
				}
			}
		}

		// Delete any productAttributeValue records that are not included in the current payload
		unusedProdAttrValRecords, _ := e.App.FindRecordsByFilter(prodAttrValColl, prodAttrValfilter, "", -1, 0, nil)
		for _, rec := range unusedProdAttrValRecords {
			err := e.App.Delete(rec)
			if err != nil {
				return err
			}
		}
	}

	// Delete any product attribute records that are not included in the current payload
	unusedProdAttrRecords, _ := e.App.FindRecordsByFilter(prodAttrColl, prodAttrfilter, "", -1, 0, nil)
	for _, rec := range unusedProdAttrRecords {
		err := e.App.Delete(rec)
		if err != nil {
			return err
		}
	}

	return e.Next()
}
