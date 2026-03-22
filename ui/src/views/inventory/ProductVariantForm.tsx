import { Component, createResource, For } from "solid-js";
import { Card, Tag } from "@solidpb/ui-kit";

import { useAuthPB } from "../../config/pocketbase";
import { EXPAND_PRODUCT_VARIANT } from "../../../constants";
import { Collections } from "../../../pocketbase-types";

interface ProductVariantFromProps {
  recordId: string;
  onSave?: (data: Partial<ProductRecordExpand>) => void;
}

export const ProductVariantForm: Component<ProductVariantFromProps> = (props) => {
  const { pb } = useAuthPB();

  const [productVariant] = createResource(async () => {
    const record = await pb
      .collection<ProductVariantRecordExpand>(Collections.ProductVariant)
      .getOne(props.recordId, { expand: EXPAND_PRODUCT_VARIANT });

    return record;
  });

  return (
    <Card>
      <p class="font-bold">Name</p>
      <h2 class="text-lg">{productVariant()?.name}</h2>
      <div class="flex gap-1">
        <For each={productVariant()?.expand.productAttributeValues}>
          {(attribute) => <Tag title={attribute.expand.attributeValue.name} />}
        </For>
      </div>
    </Card>
  );
};

export default ProductVariantForm;
