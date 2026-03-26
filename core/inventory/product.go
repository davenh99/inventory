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
	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.POST("/product/{id}/updateProductVariants", UpdateProductVariants).Bind(apis.RequireAuth())

		return se.Next()
	})

	app.OnRecordCreateRequest("product").BindFunc(attachProductAttributesAndValues)
	app.OnRecordUpdateRequest("product").BindFunc(attachProductAttributesAndValues)

	app.OnRecordCreateExecute("product").BindFunc(upsertProductAttributesAndValues)
	app.OnRecordUpdateExecute("product").BindFunc(upsertProductAttributesAndValues)
}

func attachProductAttributesAndValues(e *core.RecordRequestEvent) error {
	e.Record.Set("_productAttributes", []any{})

	body, _ := io.ReadAll(e.Request.Body)

	var payload map[string]any
	json.Unmarshal(body, &payload)

	// If data is present, add _productAttributes to the record data for response
	if body, ok := payload["body"].(map[string]any); ok {
		if productAttrs, ok := body["_productAttributes"]; ok {
			e.Record.Set("_productAttributes", productAttrs)
		}
	}

	return e.Next()
}

func upsertProductAttributesAndValues(e *core.RecordEvent) error {
	prodAttrColl, _ := e.App.FindCollectionByNameOrId("productAttribute")
	prodAttrValColl, _ := e.App.FindCollectionByNameOrId("productAttributeValue")
	productAttributes := e.Record.Get("_productAttributes").([]any)
	productId := e.Record.Id // TODO do I know if this is populated on createExecute? investigate
	productAttributeIds := []string{}

	prodAttrfilter := fmt.Sprintf("product = '%s'", productId)

	if len(productAttributes) == 0 {
		// create the single product variant
		err := updateProductVariants(e.App, productId)
		if err != nil {
			return err
		}
		// if no attributes, delete any existing product attribute values for the product
		unusedProdAttrValRecords, _ := e.App.FindRecordsByFilter(prodAttrValColl, prodAttrfilter, "", -1, 0, nil)
		for _, rec := range unusedProdAttrValRecords {
			err := e.App.Delete(rec)
			if err != nil {
				return err
			}
		}
		return nil
	}

	// update product attributes and attribute values in transaction.
	e.App.RunInTransaction(func(txApp core.App) error {
		for _, attr := range productAttributes {
			attrMap := attr.(map[string]any)
			var prodAttrRecord *core.Record

			productAttributeValueIds := []string{}

			if id, ok := attrMap["id"].(string); ok && id != "" {
				// add existing prodattr id to filter to exclude from deleting
				prodAttrfilter += fmt.Sprintf(" && id != '%s'", id)
				// If ID is present, load existing record for update
				prodAttrRec, err := txApp.FindRecordById(prodAttrColl, id)
				if err != nil {
					return err
				}
				prodAttrRecord = prodAttrRec
			} else {
				prodAttrRecord = core.NewRecord(prodAttrColl)
			}
			prodAttrRecord.Load(attrMap)
			prodAttrRecord.Set("product", productId)

			// save prodattribute (no validate to avoid error if no prodattribute values)
			err := txApp.SaveNoValidate(prodAttrRecord)
			if err != nil {
				return err
			}

			productAttributeIds = append(productAttributeIds, prodAttrRecord.Id)
			// add the new id to the filter to exclude from deleting
			prodAttrfilter += fmt.Sprintf(" && id != '%s'", prodAttrRecord.Id)
			prodAttrValfilter := fmt.Sprintf("product = '%s' && productAttribute = '%s'", productId, prodAttrRecord.Id)

			// save prodattribute values, fill in prodattribute id
			if prodAttrValues, ok := attrMap["_productAttributeValues"].([]any); ok {
				for _, val := range prodAttrValues {
					valMap := val.(map[string]any)

					// Save productAttributeValue record
					var prodAttrValRecord *core.Record

					if id, ok := valMap["id"].(string); ok && id != "" {
						// remove attr values where attr value attr not equal to productattr attr
						if attrVal, ok := valMap["_attributeValue"].(map[string]any); ok {
							if attrValAttr, ok := attrVal["attribute"].(string); ok && attrValAttr == prodAttrRecord.GetString("attribute") {
								// add existing prodattrval id to filter to exclude from deleting
								prodAttrValfilter += fmt.Sprintf(" && id != '%s'", id)

								// If ID and attribute are present, load existing record for update
								prodAttrValRec, err := txApp.FindRecordById(prodAttrValColl, id)
								if err != nil {
									return err
								}
								prodAttrValRecord = prodAttrValRec
							} else {
								continue
							}
						}
					} else {
						prodAttrValRecord = core.NewRecord(prodAttrValColl)
					}

					prodAttrValRecord.Load(valMap)
					prodAttrValRecord.Set("productAttribute", prodAttrRecord.Id)
					prodAttrValRecord.Set("product", productId)
					err := txApp.Save(prodAttrValRecord)
					if err != nil {
						return err
					}

					productAttributeValueIds = append(productAttributeValueIds, prodAttrValRecord.Id)
					// add the new id to the filter to exclude from deleting
					prodAttrValfilter += fmt.Sprintf(" && id != '%s'", prodAttrValRecord.Id)
				}
			}

			// save prodattribute (with validation this time), with list of prodattribute ids
			prodAttrRecord.Set("productAttributeValues", productAttributeValueIds)
			err = txApp.Save(prodAttrRecord)
			if err != nil {
				return err
			}

			// Delete any productAttributeValue records that are not included in the current payload
			unusedProdAttrValRecords, _ := txApp.FindRecordsByFilter(prodAttrValColl, prodAttrValfilter, "", -1, 0, nil)
			for _, rec := range unusedProdAttrValRecords {
				err := txApp.Delete(rec)
				if err != nil {
					return err
				}
			}
		}

		return nil
	})

	// afterwards, update product attribute ids on the product (productAttributeIds)
	e.Record.Set("productAttributes", productAttributeIds)

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

func UpdateProductVariants(e *core.RequestEvent) error {
	productId := e.Request.PathValue("id")

	err := updateProductVariants(e.App, productId)
	if err != nil {
		return err
	}

	return e.Next()
}

func updateProductVariants(app core.App, productId string) error {
	product, err := app.FindRecordById("product", productId)
	if err != nil {
		return err
	}

	existingVariants, err := app.FindRecordsByFilter("productVariant", "product = {:id}", "", -1, 0, dbx.Params{"id": productId})
	if err != nil {
		return err
	}

	// map existing variants by a sorted key of attributeValue IDs for quick lookup
	variantMap := map[string]*core.Record{}
	for _, variant := range existingVariants {
		vals := variant.Get("attributeValues")
		if arr, ok := vals.([]string); ok {
			key := strings.Join(arr, ",") // deterministic key
			variantMap[key] = variant
		}
		// archive all existing variants first
		variant.Set("active", false)
	}

	// generate all combinations of attribute values
	attributeCombinations, err := getProductCombinations(app, productId)
	if err != nil {
		return err
	}

	// generate singular variant if no attributes
	if len(attributeCombinations) == 0 {
		prodVariantColl, _ := app.FindCollectionByNameOrId("productVariant")

		rec := core.NewRecord(prodVariantColl)
		rec.Set("product", productId)

		rec.Set("displayName", product.Get("name"))
		rec.Set("name", product.Get("name"))
		rec.Set("active", true)

		err = app.Save(rec)
		if err != nil {
			return err
		}

		return nil
	}

	for _, combo := range attributeCombinations {
		ids := []string{}
		for _, rec := range combo {
			ids = append(ids, rec.Id)
		}
		key := strings.Join(ids, ",") // deterministic key

		// expand attributeValue and attribute to get their names
		errs := app.ExpandRecords(combo, []string{"attributeValue", "productAttribute.attribute"}, nil)
		if len(errs) > 0 {
			return fmt.Errorf("failed to expand attribute combinations: %v", errs)
		}

		name := ""
		for i, rec := range combo {
			if i > 0 {
				name += ", "
			}
			attrValName := rec.ExpandedOne("attributeValue").GetString("name")
			attrName := rec.ExpandedOne("productAttribute").ExpandedOne("attribute").GetString("name")
			name += fmt.Sprintf("%s: %s", attrName, attrValName)
		}
		name = fmt.Sprintf("%s (%s)", product.Get("name"), name)

		if existing, found := variantMap[key]; found {
			// variant exists, activate it
			existing.Set("active", true)
			existing.Set("name", name)

			err := app.Save(existing)
			if err != nil {
				return err
			}

		} else {
			// variant doesn't exist, create new record
			prodVariantColl, _ := app.FindCollectionByNameOrId("productVariant")

			rec := core.NewRecord(prodVariantColl)
			rec.Set("product", productId)
			rec.Set("productAttributeValues", ids)

			rec.Set("displayName", name)
			rec.Set("name", name)
			rec.Set("active", true)

			err := app.Save(rec)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

// generate combinations of product attribute values (likely to be used for variant generation)
func getProductCombinations(app core.App, productId string) ([][]*core.Record, error) {
	records, err := app.FindRecordsByFilter(
		"productAttributeValue",
		"product = {:prod}",
		"productAttribute.attribute.name, attributeValue.name",
		-1,
		0,
		dbx.Params{"prod": productId},
	)
	if err != nil {
		return nil, err
	}

	seen := map[string]bool{}
	prodAttrs := []string{}
	prodAttrToValues := map[string][]*core.Record{}

	for _, rec := range records {
		prodAttr := rec.GetString("productAttribute")

		if !seen[prodAttr] {
			seen[prodAttr] = true
			prodAttrs = append(prodAttrs, prodAttr)
		}

		prodAttrToValues[prodAttr] = append(prodAttrToValues[prodAttr], rec)
	}

	attributeValues := make([][]*core.Record, len(prodAttrs))
	for i, attr := range prodAttrs {
		attributeValues[i] = prodAttrToValues[attr]
	}

	return utils.CartesianProduct(attributeValues), nil
}
