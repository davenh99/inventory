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

  // const [edited, setEdited] = createSignal(false);
  const [product, { refetch }] = createResource(async () => {
    if (props.productId && props.productId !== NEW_RECORD_ID) {
      const record = await pb.collection(Collections.Product).getOne(props.productId);
      setCrumbs?.([{ label: record.name }]);
      console.log("Setting product type: ", record.type);
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

  const handleSave = async (data: Partial<ProductRecord>) => {
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
    <Card>
      <Show when={product()} fallback={<LoadFullScreen />}>
        <Form data={product() ?? {}} onSave={handleSave}>
          <div class="sm:w-130 space-y-3">
            <Form.TextField field="name" label="Product Name" size="xl" />
            <Form.ImageField field="image" label="Product Image" size="md" />
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
          </div>
        </Form>
      </Show>
    </Card>
  );
};
