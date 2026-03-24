import { Component, createResource, createSignal, Show } from "solid-js";
import { Card, createForm, Tabs, Toast } from "@solidpb/ui-kit";
import { toaster } from "@kobalte/core/toast";
import ClipboardList from "lucide-solid/icons/clipboard-list";
import Blocks from "lucide-solid/icons/blocks";

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
  onSave?: (data: Partial<ProductRecordExpand>) => void;
}

export const ProductForm: Component<ProductFromProps> = (props) => {
  const Form = createForm<Partial<ProductRecordExpand>>();
  const { pb, createTag } = useAuthPB();
  const { setCrumbs } = useCrumbs();

  const [product, { refetch, mutate: mutateProduct }] = createResource(async () => {
    if (props.recordId && props.recordId !== NEW_RECORD_ID) {
      const record = await pb
        .collection<ProductRecordExpand>(Collections.Product)
        .getOne(props.recordId, { expand: EXPAND_PRODUCT });

      // console.log(record);

      setCrumbs?.([{ label: record.name }]);
      setProductType({ value: record.type, label: camelCaseToLabel(record.type) });
      return record;
    } else {
      setCrumbs?.([{ label: "New Product" }]);
      return { type: "consumable", active: true } as Partial<ProductRecordExpand>;
    }
  });
  const [productType, setProductType] = createSignal<{ label: string; value: string } | null>({
    value: product()?.type ?? "consumable",
    label: camelCaseToLabel(product()?.type ?? "consumable"),
  });
  const pbImageUrl = () => {
    if (product()?.image) {
      return pb.files.getURL(product()!, product()!.image!);
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

  const handleSave = async (data: Partial<ProductRecordExpand>) => {
    try {
      let prod: ProductRecordExpand;
      if (data.id) {
        prod = await pb.collection(Collections.Product).update(data.id, data);
      } else {
        prod = await pb.collection(Collections.Product).create(data);
      }
      refetch();
      props.onSave?.(prod);
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
    prodAttr: ProductAttributeRecord | null,
  ) => {
    if (!attr || !prodAttr) return;

    mutateProduct((prev) => {
      if (!prev) return prev;
      const updatedAttr = prev.expand?.productAttribute_via_product?.map((pa, i) => {
        if (i === ind) {
          return { ...pa, attribute: attr.id, expand: { ...pa.expand, attribute: attr } };
        }
        return pa;
      });
      return {
        ...prev,
        expand: { ...prev.expand, productAttribute_via_product: updatedAttr },
      };
    });
  };

  const handleAttributeValuesChange = (
    ind: number,
    attrVal: AttributeValueRecord | AttributeValueRecord[] | null,
    prodAttr: ProductAttributeRecord | null,
  ) => {
    if (!attrVal || !prodAttr) return;

    mutateProduct((prev) => {
      if (!prev) return prev;
      const updatedAttr = prev.expand?.productAttribute_via_product?.map((pa, i) => {
        if (i === ind) {
          return {
            ...pa,
            expand: {
              ...pa.expand,
              productAttributeValue_via_productAttribute: (Array.isArray(attrVal) ? attrVal : [attrVal]).map(
                (val) => ({
                  product: pa.product,
                  attributeValue: val.id,
                  productAttribute: pa.id,
                  expand: { attributeValue: val },
                }),
              ),
            },
          };
        }
        return pa;
      });

      return {
        ...prev,
        expand: { ...prev.expand, productAttribute_via_product: updatedAttr },
      };
    });
  };

  const handleDeleteAttribute = (ind: number) => {
    mutateProduct((prev) => {
      if (!prev) return prev;
      const updatedAttr = prev.expand?.productAttribute_via_product?.filter((_, i) => i !== ind);
      return {
        ...prev,
        expand: { ...prev.expand, productAttribute_via_product: updatedAttr },
      };
    });
  };

  const handleAddAttribute = () => {
    mutateProduct((prev) => {
      if (!prev) return prev;
      const newAttr = {
        product: prev.id!,
        attribute: "",
        expand: { attribute: {}, productAttributeValue_via_productAttribute: [] },
      } as any;
      return {
        ...prev,
        expand: {
          ...prev.expand,
          productAttribute_via_product: [...(prev.expand?.productAttribute_via_product || []), newAttr],
        },
      };
    });
  };

  const selectedTab = sessionStorage.getItem("productFormSelectedTab") || "general";

  return (
    <Show when={product() !== undefined && uomOptions() && tagOptions()} fallback={<LoadFullScreen />}>
      <div class="flex flex-col sm:flex-row shadow-sm rounded-2xl w-fit">
        <div class="join-item bg-base-200 not-sm:rounded-t-2xl sm:rounded-l-2xl sm:min-w-40">
          <ul class="menu w-full">
            <li>
              <a
                href={`/bom/${product()!.expand?.bom_via_product?.[0]?.id || NEW_RECORD_ID}?product=${product()!.id}`}
              >
                <ClipboardList /> Recipe
              </a>
            </li>
            <Show when={product()?.id}>
              <li>
                <a
                  href={buildUrl(
                    "productVariant",
                    "Product Variants",
                    undefined,
                    undefined,
                    pb.filter(`${product()!.name}·product = {:prod}`, {
                      prod: product()!.id,
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
          <Form
            data={product()!}
            setData={(data) => mutateProduct(data as ProductRecordExpand)}
            onSave={handleSave}
          >
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
                    <Show when={product()!.canSell}>
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
                      value={product()!.expand?.tags ?? []}
                      onChange={(tags) => {
                        mutateProduct((prev) => {
                          if (!prev) return prev;
                          return { ...prev, expand: { ...prev.expand, tags } } as ProductRecordExpand;
                        });
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
                    value={product()!.expand?.uom ?? null}
                    onChange={(value) => {
                      mutateProduct((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          uom: (value as UomRecord).id,
                          expand: { ...prev.expand, uom: value },
                        } as ProductRecordExpand;
                      });
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
                    product={product}
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
  );
};
