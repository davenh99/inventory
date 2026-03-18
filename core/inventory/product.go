package inventory

import (
	"app/utils"
	"encoding/json"
	"fmt"
	"io"
	"strings"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
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

	return updateProductVariants(e)
}

func updateProductVariants(e *core.RecordEvent) error {
	existingVariants, err := e.App.FindRecordsByFilter("productVariant", fmt.Sprintf("product = '%s'", e.Record.Id), "", -1, 0, nil)
	if err != nil {
		return err
	}

	// map existing variants by a sorted key of attributeValue IDs for quick lookup
	variantMap := map[string]*core.Record{}
	for _, variant := range existingVariants {
		vals := variant.Get("attributeValues") // assume it's a slice of IDs
		if arr, ok := vals.([]string); ok {
			key := strings.Join(arr, ",") // deterministic key
			variantMap[key] = variant
		}
		// archive all existing variants first
		variant.Set("active", false)
	}

	// generate all combinations of attribute values
	attributeCombinations, err := getProductCombinationIDs(e.App, e.Record.Id)
	if err != nil {
		return err
	}

	for _, combo := range attributeCombinations {
		key := strings.Join(combo, ",") // deterministic key
		if existing, found := variantMap[key]; found {
			// variant exists, activate it
			existing.Set("active", true)
		} else {
			// variant doesn't exist, create new record
			prodVariantColl, _ := e.App.FindCollectionByNameOrId("productVariant")

			rec := core.NewRecord(prodVariantColl)
			rec.Set("product", e.Record.Id)
			rec.Set("attributeValues", combo)
			// TODO need attr names actually
			displayName := strings.Join(combo, " | ") // simple displayName from value IDs
			rec.Set("displayName", displayName)
			rec.Set("active", true)

			err := e.App.Save(rec)
			if err != nil {
				return err
			}
		}
	}

	return e.Next()
}

// generate combinations of product attribute values (likely to be used for variant generation)
func getProductCombinationIDs(app core.App, productId string) ([][]string, error) {
	type Row struct {
		Attribute      string `db:"attribute"`
		ID             string `db:"id"`
		AttributeValue string `db:"attributeValue"`
	}
	var rows []Row

	err := app.DB().
		Select(
			"pa.attribute AS attribute",
			"pav.id AS id",
			"pav.attributeValue AS attributeValue",
		).
		From("productAttributeValue AS pav").
		InnerJoin("productAttribute AS pa",
			dbx.NewExp("pav.productAttribute = pa.id"),
		).
		Where(dbx.NewExp("pav.product = {:prod}", dbx.Params{"prod": productId})).
		OrderBy("pa.attribute", "pav.attributeValue").
		All(&rows)
	if err != nil {
		return nil, apis.NewInternalServerError("couldn't fetch product ids", err)
	}

	if len(rows) == 0 {
		return [][]string{}, nil
	}

	attributeValues := make([][]string, 0)

	currentAttr := rows[0].Attribute
	currentVals := []string{}

	for _, r := range rows {
		if r.Attribute != currentAttr {
			// flush previous group
			attributeValues = append(attributeValues, currentVals)

			// start new group
			currentAttr = r.Attribute
			currentVals = []string{}
		}
		currentVals = append(currentVals, r.ID)
	}

	// flush last group
	attributeValues = append(attributeValues, currentVals)

	return utils.CartesianProduct(attributeValues), nil
}
