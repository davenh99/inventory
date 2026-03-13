import { Component, createResource, createSignal, onCleanup, Show } from "solid-js";
import { Card, createForm, Toast, type BreadCrumb } from "@solidpb/ui-kit";
import { toaster } from "@kobalte/core/toast";

import { camelCaseToLabel, getSelectOptions } from "../../../services/getAvailableFields";
import { Collections } from "../../../../pocketbase-types";
import { useAuthPB } from "../../../config/pocketbase";
import LoadFullScreen from "../../../views/app/LoadFullScreen";
import { NEW_RECORD_ID } from "../../../../constants";
import { useCrumbs } from "../../../views/app/AppLayout";

interface ProductFromProps {
  productId?: string;
  onSave?: (data: Partial<ProductRecord>) => void;
}

export const ProductForm: Component<ProductFromProps> = (props) => {
  const Form = createForm<Partial<ProductRecord>>();
  const { pb } = useAuthPB();
  const { setCrumbs } = useCrumbs();

  const [product, { refetch, mutate }] = createResource(async () => {
    if (props.productId && props.productId !== NEW_RECORD_ID) {
      const record = await pb
        .collection(Collections.Product)
        .getOne(props.productId, { expand: "category, uom, tags" });
      setCrumbs?.([{ label: record.name }]);
      setProductType({ value: record.type, label: camelCaseToLabel(record.type) });
      return record;
    } else {
      setCrumbs?.([{ label: "New Product" }]);
      return { type: "consumable" } as Partial<ProductRecord>;
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
  const [categories] = createResource(async () => {
    const data = await pb.collection(Collections.ProductCategory).getFullList();
    return data;
  });
  const [tagOptions] = createResource(async () => {
    const data = await pb.collection(Collections.Tag).getFullList();
    return data;
  });
  const [uomOptions] = createResource(async () => {
    const data = await pb.collection(Collections.Uom).getFullList();
    return data;
  });

  const handleSave = async (data: Partial<ProductRecord>) => {
    console.log(data);
    try {
      let prod: ProductRecord;
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
    <Show when={product()} fallback={<LoadFullScreen />}>
      <Card>
        <Form data={product() ?? {}} onSave={handleSave}>
          <div class="sm:w-130 space-y-3">
            <Form.TextField field="name" label="Product Name" size="xl" />
            <Form.ImageField field="image" label="Product Image" size="md" src={pbImageUrl()} />
            <Show when={product()?.canSell}>
              <Form.NumberField
                field="sellPrice"
                label="Sell Price"
                inputProps={{ class: "w-30" }}
                formatOptions={{ style: "currency", currency: "AUD" }}
              />
            </Show>
            <Form.SwitchField field="canPurchase" label="Purchasable" />
            <Form.SwitchField field="canSell" label="Sellable" />
            <Form.TextAreaField field="description" label="Description" />
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
              value={product()?.expand?.uom}
              onChange={(value) => {
                mutate((prev) => {
                  if (!prev) return prev;
                  return { ...prev, expand: { ...prev.expand, uom: value } };
                });
              }}
              placeholder="Unit of Measure"
            />
            <Form.RelationField
              field="category"
              label="Category"
              placeholder="Category"
              options={categories() ?? []}
              valueKey="id"
              labelKey="name"
              value={product()?.expand?.category}
              onChange={(value) => {
                mutate((prev) => {
                  if (!prev) return prev;
                  return { ...prev, expand: { ...prev.expand, category: value } };
                });
              }}
            />
            <Form.RelationField
              field="tags"
              label="Tags"
              placeholder="Tags"
              options={tagOptions() ?? []}
              valueKey="id"
              labelKey="name"
              value={product()?.expand?.tags ?? []}
              onChange={(tags) => {
                mutate((prev) => {
                  if (!prev) return prev;
                  return { ...prev, expand: { ...prev.expand, tags } };
                });
              }}
              multi
            />
          </div>
        </Form>
      </Card>
    </Show>
  );
};
