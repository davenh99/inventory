import { Component, createResource, createSignal, onCleanup, Suspense } from "solid-js";

import { Card, createForm, type BreadCrumb } from "@solidpb/ui-kit";
import { camelCaseToLabel, getSelectOptions } from "../../../services/getAvailableFields";
import { Collections } from "../../../../pocketbase-types";
import { useAuthPB } from "../../../config/pocketbase";
import LoadFullScreen from "../../../views/app/LoadFullScreen";
import { NEW_RECORD_ID } from "../../../../constants";
import { useCrumbs } from "../../../config/Crumbs";

interface ProductFromProps {
  productId?: string;
  onSave?: (data: Partial<ProductRecord>) => void;
}

export const ProductForm: Component<ProductFromProps> = (props) => {
  const Form = createForm<Partial<ProductRecord>>();
  const { pb } = useAuthPB();
  // const { setCrumbs } = useCrumbs();

  // const [edited, setEdited] = createSignal(false);
  const [product, { refetch }] = createResource(async () => {
    if (props.productId && props.productId !== NEW_RECORD_ID) {
      const res = await pb.collection(Collections.Product).getOne(props.productId);
      // setCrumbs?.([{ label: res.name }]);
      return res;
    } else {
      // setCrumbs?.([{ label: "New Product" }]);
      return { type: "stockable" } as Partial<ProductRecord>;
    }
  });
  const [productType, setProductType] = createSignal<{ label: string; value: string } | null>({
    value: product()?.type ?? "stockable",
    label: camelCaseToLabel(product()?.type ?? "stockable"),
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
      <Suspense fallback={<LoadFullScreen />}>
        <Form data={product() ?? {}} onSave={handleSave}>
          <div class="sm:w-130 space-y-3">
            <Form.TextField field="name" label="Product Name" size="xl" />
            <Form.ImageField field="image" label="Product Image" size="md" />
            <Form.NumberField
              field="sellPrice"
              label="Sell Price"
              inputProps={{ class: "w-30" }}
              formatOptions={{ style: "currency", currency: "AUD" }}
            />
            <Form.SwitchField field="canPurchase" label="Purchasable" />
            <Form.SwitchField field="canSell" label="Sellable" />
            <Form.TextAreaField field="description" label="Description" />
            <Form.SelectField
              field="type"
              label="Product Type"
              value={productType()}
              onChange={(option) => setProductType(option)}
              options={getSelectOptions(["stockable", "consumable"])}
            />
          </div>
        </Form>
      </Suspense>
    </Card>
  );
};
