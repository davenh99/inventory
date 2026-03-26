import { Component, createResource, createSignal, Show, Suspense } from "solid-js";
import { Card, createForm, Tabs, Toast } from "@solidpb/ui-kit";
import { toaster } from "@kobalte/core/toast";
import ClipboardList from "lucide-solid/icons/clipboard-list";
import Blocks from "lucide-solid/icons/blocks";
import { createStore } from "solid-js/store";

import { camelCaseToLabel, getSelectOptions } from "../../services/getAvailableFields";
import { Collections } from "../../../pocketbase-types";
import { useAuthPB } from "../../config/pocketbase";
import LoadFullScreen from "../../views/app/LoadFullScreen";
import { EXPAND_PRODUCT, NEW_RECORD_ID } from "../../../constants";
import { useCrumbs } from "../../views/app/AppLayout";
import ProductFormAttributesTab from "./ProductFormAttributesTab";
import { buildUrl } from "../../services/navigation";

interface ProductFromProps {
  recordId?: string;
}

export type ProductAttributeRecordDraft = ProductAttributeUpdatePayload & {
  _attribute?: AttributeRecord;
  _productAttributeValues: (ProductAttributeValueUpdatePayload & { _attributeValue: AttributeValueRecord })[];
};

export type ProductStore = {
  product: Partial<ProductRecordExpand>;
  attributes: ProductAttributeRecordDraft[];
};

export const ProductForm: Component<ProductFromProps> = (props) => {
  const Form = createForm<Partial<ProductRecordExpand>>();
  const { pb, createTag } = useAuthPB();
  const [store, setStore] = createStore<ProductStore>({
    product: { type: "consumable", active: true },
    attributes: [],
  });
  const [productType, setProductType] = createSignal<{ label: string; value: string } | null>({
    value: store.product?.type ?? "consumable",
    label: camelCaseToLabel(store.product?.type ?? "consumable"),
  });
  const { setCrumbs } = useCrumbs();

  const [productResource, { refetch }] = createResource(async () => {
    if (props.recordId && props.recordId !== NEW_RECORD_ID) {
      const record = await pb
        .collection<ProductRecordExpand>(Collections.Product)
        .getOne(props.recordId, { expand: EXPAND_PRODUCT });

      setCrumbs?.([{ label: record.name }]);
      setProductType({ value: record.type, label: camelCaseToLabel(record.type) });
      setStore("product", record);
      setStore(
        "attributes",
        record.expand.productAttributes?.map((pa) => ({
          ...pa,
          // to distinguish it from the list of ids 'productAttributeValues', and lift up from the expand
          _productAttributeValues: pa.expand.productAttributeValues.map((pav) => ({
            ...pav,
            // similar for attribute value
            _attributeValue: pav.expand.attributeValue,
          })),
          // similar for attribute
          _attribute: pa.expand.attribute,
        })) ?? [],
      );
      return record;
    } else {
      setCrumbs?.([{ label: "New Product" }]);
    }
  });

  const pbImageUrl = () => {
    if (store.product?.image) {
      return pb.files.getURL(store.product, store.product.image);
    }
    return undefined;
  };
  // const [categories] = createResource(async () => {
  //   const data = await pb.collection(Collections.ProductCategory).getFullList();
  //   return data;
  // });
  const [tagOptions, { mutate: mutateTagOptions }] = createResource(async () => {
    const data = await pb.collection(Collections.Tag).getFullList();
    return data;
  });
  const [uomOptions] = createResource(async () => {
    const data = await pb.collection(Collections.Uom).getFullList();
    return data;
  });

  const handleSave = async (productData: ProductUpdatePayload) => {
    try {
      let prod: ProductRecord;
      const body = {
        body: {
          _productAttributes: store.attributes,
        },
      };
      if (productData.id) {
        prod = await pb.collection(Collections.Product).update(productData.id, productData, { body });
      } else {
        prod = await pb.collection(Collections.Product).create(productData, { body });
      }

      await pb.send(`/product/${prod.id}/updateProductVariants`, { method: "POST" });
      refetch();

      toaster.show((props) => (
        <Toast {...props} appearance="success" title="Saved" msg="Product saved successfully" />
      ));
    } catch (e) {
      console.error("Error saving product: ", e);
    }
  };

  const handleAttributeChange = (
    ind: number,
    attr: AttributeRecord | null,
    prodAttr: ProductAttributeRecordDraft | null,
  ) => {
    if (!attr || !prodAttr) return;

    setStore("attributes", ind, "attribute", attr.id);
    setStore("attributes", ind, "_attribute", attr);
  };

  const handleAttributeValuesChange = (
    ind: number,
    attrVal: AttributeValueRecord | AttributeValueRecord[] | null,
    prodAttr: ProductAttributeRecordDraft | null,
  ) => {
    if (!attrVal || !prodAttr) return;

    const newAttrValues = (Array.isArray(attrVal) ? attrVal : [attrVal]).map((val) => ({
      attributeValue: val.id,
      _attributeValue: val,
    }));

    setStore("attributes", ind, "_productAttributeValues", newAttrValues);
  };

  const handleDeleteAttribute = (ind: number) => {
    setStore("attributes", (attrs) => attrs.filter((_, i) => i !== ind));
  };

  const handleAddAttribute = () => {
    const newAttr: ProductAttributeRecordDraft = {
      attribute: "",
      _productAttributeValues: [],
    };

    setStore("attributes", store.attributes.length, newAttr);
  };

  const selectedTab = sessionStorage.getItem("productFormSelectedTab") || "general";

  return (
    <Suspense fallback={<LoadFullScreen />}>
      <Show when={store.product !== undefined && uomOptions() && tagOptions()} fallback={<LoadFullScreen />}>
        <div class="flex flex-col sm:flex-row shadow-sm rounded-2xl w-fit">
          <div class="join-item bg-base-200 not-sm:rounded-t-2xl sm:rounded-l-2xl sm:min-w-40">
            <ul class="menu w-full">
              <li>
                <a
                  href={`/bom/${store.product.expand?.bom_via_product?.[0]?.id || NEW_RECORD_ID}?product=${store.product.id}`}
                >
                  <ClipboardList /> Recipe
                </a>
              </li>
              <Show when={store.product.id}>
                <li>
                  <a
                    href={buildUrl(
                      "productVariant",
                      "Product Variants",
                      undefined,
                      undefined,
                      pb.filter(`${store.product.name}·product = {:prod}`, {
                        prod: store.product.id,
                      }),
                    )}
                  >
                    <Blocks /> Variations
                  </a>
                </li>
              </Show>
            </ul>
          </div>
          <Card class="join-item shadow-none sm:rounded-l-none not-sm:rounded-t-none">
            <Form data={store.product} setData={(data) => setStore("product", data)} onSave={handleSave}>
              <div class="md:w-220 max-w-full space-y-3">
                <div class="flex flex-col sm:flex-row justify-between space-y-2">
                  <div class="space-y-2">
                    <Form.TextField
                      field="name"
                      label="Product Name"
                      size="xl"
                      variant="ghost"
                      inputProps={{ placeholder: "Product Name" }}
                    />
                    <Form.SwitchField field="canPurchase" label="Can Purchase" />
                    <Form.SwitchField field="canSell" label="Can Sell" />
                  </div>
                  <Form.ImageField field="image" label="Product Image" size="md" src={pbImageUrl()} />
                </div>
                <Tabs
                  defaultTab={selectedTab}
                  onTabChange={(val) => sessionStorage.setItem("productFormSelectedTab", val)}
                >
                  <Tabs.List>
                    <Tabs.Trigger value="general">General</Tabs.Trigger>
                    <Tabs.Trigger value="variants">Variations</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="general" class="space-y-2">
                    <div class="flex flex-col sm:flex-row justify-between space-y-2">
                      <Show when={store.product.canSell}>
                        <Form.NumberField
                          field="sellPrice"
                          label="Sell Price"
                          inputProps={{ class: "w-30" }}
                          formatOptions={{ style: "currency", currency: "AUD" }}
                        />
                      </Show>
                      <Form.RelationField
                        field="tags"
                        label="Tags"
                        placeholder="Tags"
                        options={tagOptions() ?? []}
                        valueKey="id"
                        labelKey="name"
                        value={store.product.expand?.tags ?? []}
                        onChange={(tags) => {
                          if (tags) {
                            setStore(
                              "product",
                              "tags",
                              (Array.isArray(tags) ? tags.map((t) => t.id) : [tags.id]) ?? [],
                            );
                            setStore(
                              "product",
                              "expand",
                              "tags",
                              (Array.isArray(tags) ? tags : [tags]) ?? [],
                            );
                          } else {
                            setStore("product", "tags", []);
                            setStore("product", "expand", "tags", []);
                          }
                        }}
                        multi
                        onCreateInline={async (text) => {
                          const newTag = await createTag(text);
                          mutateTagOptions((prev) => (prev ? [...prev, newTag] : [newTag]));
                          return newTag;
                        }}
                      />
                    </div>
                    <Form.SelectField
                      field="type"
                      label="Product Type"
                      value={productType()}
                      onChange={(option) => setProductType(option)}
                      options={getSelectOptions(["stockable", "consumable"])}
                      disabled
                    />
                    <Form.RelationField
                      field="uom"
                      label="Unit of Measure"
                      options={uomOptions() ?? []}
                      valueKey="id"
                      labelKey="name"
                      value={store.product.expand?.uom ?? null}
                      onChange={(value) => {
                        setStore("product", "uom", (value as UomRecord).id);
                        setStore("product", "expand", "uom", value as UomRecord);
                      }}
                      placeholder="Unit of Measure"
                    />
                    {/* <Form.RelationField
                field="category"
                label="Category"
                placeholder="Category"
                options={categories() ?? []}
                valueKey="id"
                labelKey="name"
                value={product()!.expand?.category ?? null}
                onChange={(value) => {
                  mutateProduct((prev) => {
                    if (!prev) return prev;
                    return { ...prev, expand: { ...prev.expand, category: value } } as ProductRecordExpand;
                    });
                    }}
                    /> */}
                    <Form.TextAreaField
                      field="description"
                      label="Description"
                      textareaProps={{ placeholder: "Description (optional)" }}
                    />
                  </Tabs.Content>
                  <Tabs.Content value="variants">
                    <ProductFormAttributesTab
                      store={store}
                      handleAttributeChange={handleAttributeChange}
                      handleAttributeValuesChange={handleAttributeValuesChange}
                      handleDeleteAttribute={handleDeleteAttribute}
                      handleAddAttribute={handleAddAttribute}
                    />
                  </Tabs.Content>
                </Tabs>
              </div>
            </Form>
          </Card>
        </div>
      </Show>
    </Suspense>
  );
};
