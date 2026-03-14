import { Component, createResource, createSignal, For, Show } from "solid-js";
import { Card, createForm, Table, Tabs, Toast } from "@solidpb/ui-kit";
import { toaster } from "@kobalte/core/toast";
import ClipboardList from "lucide-solid/icons/clipboard-list";

import { camelCaseToLabel, getSelectOptions } from "../../services/getAvailableFields";
import { Collections } from "../../../pocketbase-types";
import { useAuthPB } from "../../config/pocketbase";
import LoadFullScreen from "../../views/app/LoadFullScreen";
import { EXPAND_PRODUCT, NEW_RECORD_ID } from "../../../constants";
import { useCrumbs } from "../../views/app/AppLayout";

interface ProductFromProps {
  productId?: string;
  onSave?: (data: Partial<ProductRecordExpand>) => void;
}

export const ProductForm: Component<ProductFromProps> = (props) => {
  const Form = createForm<Partial<ProductRecordExpand>>();
  const { pb, createTag } = useAuthPB();
  const { setCrumbs } = useCrumbs();

  const [product, { refetch, mutate: mutateProduct }] = createResource(async () => {
    if (props.productId && props.productId !== NEW_RECORD_ID) {
      const record = await pb
        .collection<ProductRecordExpand>(Collections.Product)
        .getOne(props.productId, { expand: EXPAND_PRODUCT });

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

      // setEdited(false);
    } catch (e) {
      console.error("Error saving product: ", e);
    }
  };

  // const handleCancel = () => {
  //   props.onCancel?.();
  //   setEdited(false);
  // };

  // onCleanup(() => {});

  return (
    <Show when={product() && uomOptions() && tagOptions()} fallback={<LoadFullScreen />}>
      <div class="flex flex-col sm:flex-row shadow-sm rounded-2xl w-fit">
        <div class="join-item bg-base-200 not-sm:rounded-t-2xl sm:rounded-l-2xl sm:min-w-40">
          <ul class="menu w-full">
            <li>
              <a href={`/recipes/${product()!.expand?.bom_via_product?.[0]?.id || NEW_RECORD_ID}`}>
                <ClipboardList /> Recipe
              </a>
            </li>
          </ul>
        </div>
        <Card class="join-item shadow-none sm:rounded-l-none not-sm:rounded-t-none">
          <Form data={product()!} onSave={handleSave}>
            <div class="sm:min-w-130 space-y-3">
              <div class="flex flex-col sm:flex-row justify-between space-y-2">
                <div class="space-y-2">
                  <Form.TextField field="name" label="Product Name" size="xl" variant="ghost" />
                  <Form.SwitchField field="canPurchase" label="Can Purchase" />
                  <Form.SwitchField field="canSell" label="Can Sell" />
                </div>
                <Form.ImageField field="image" label="Product Image" size="md" src={pbImageUrl()} />
              </div>
              <Tabs>
                <Tabs.List>
                  <Tabs.Trigger value="general">General</Tabs.Trigger>
                  <Tabs.Trigger value="variants">Attributes</Tabs.Trigger>
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
                        return { ...prev, expand: { ...prev.expand, uom: value } } as ProductRecordExpand;
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
                  <Table<ProductAttributeRecordExpand>
                    headers
                    data={product()!.expand?.productAttribute_via_product || []}
                    columns={[
                      {
                        header: "Attribute",
                        id: "name",
                        cell: (ctx) => <p>{ctx.row.original.expand?.attribute?.name}</p>,
                      },
                      {
                        header: "Values",
                        id: "values",
                        cell: (ctx) => (
                          <p>
                            <For each={ctx.row.original.expand?.productAttributeValue_via_productAttribute}>
                              {(val) => (
                                <span class="badge badge-outline mr-1">
                                  {val.expand?.attributeValue?.name}
                                </span>
                              )}
                            </For>
                          </p>
                        ),
                      },
                    ]}
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
