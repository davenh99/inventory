import { Component, createResource, Resource, Show } from "solid-js";
import { Button, RelationPicker, Table } from "@solidpb/ui-kit";
import Plus from "lucide-solid/icons/plus";
import X from "lucide-solid/icons/x";

import { useAuthPB } from "../../config/pocketbase";
import { Collections } from "../../../pocketbase-types";

interface ProductFormAttributesTabProps {
  product: Resource<Partial<ProductRecordExpand>>;
  handleAttributeChange: (
    ind: number,
    attr: AttributeRecord | null,
    prodAttr: ProductAttributeRecord | null,
  ) => void;
  handleAttributeValuesChange: (
    ind: number,
    attrVals: AttributeValueRecord | AttributeValueRecord[] | null,
    prodAttr: ProductAttributeRecord | null,
  ) => void;
  handleDeleteAttribute: (ind: number) => void;
  handleAddAttribute: () => void;
}

export const ProductFormAttributesTab: Component<ProductFormAttributesTabProps> = (props) => {
  const { pb, upsertAttribute, upsertAttributeValue } = useAuthPB();

  const [attributeOptions, { refetch: refetchAttributeOptions }] = createResource(async () => {
    const data = await pb.collection(Collections.Attribute).getFullList();
    return data;
  });
  const [attributeValueOptions, { refetch: refetchAttributeValueOptions }] = createResource(async () => {
    const data = await pb.collection(Collections.AttributeValue).getFullList();
    return data;
  });

  const filteredAttributeValueOptions = (pattributeId: string) => {
    return attributeValueOptions()?.filter((val) => val.attribute === pattributeId) ?? [];
  };

  return (
    <Show when={attributeOptions() && attributeOptions()}>
      <Table<ProductAttributeRecordExpand>
        headers
        emptyState="No attributes"
        data={props.product()!.expand?.productAttribute_via_product || []}
        columns={[
          {
            header: "Attribute",
            id: "name",
            cell: (ctx) => (
              <RelationPicker
                options={attributeOptions() ?? []}
                valueKey="id"
                labelKey="name"
                value={ctx.row.original.expand?.attribute ?? null}
                listboxAction={
                  <div class="px-1.25 pb-1.25">
                    <p class="text-sm italic p-1 text-center">Create new (enter)</p>
                  </div>
                }
                onChange={(val) =>
                  props.handleAttributeChange(ctx.row.index, val as AttributeRecord | null, ctx.row.original)
                }
                onCreateInline={async (text) => {
                  const rec = await upsertAttribute(text, ctx.row.original.id);
                  await refetchAttributeOptions();
                  return rec ?? undefined;
                }}
              />
            ),
          },
          {
            header: "Options",
            id: "values",
            cell: (ctx) => (
              <RelationPicker
                multi
                options={filteredAttributeValueOptions(ctx.row.original.attribute) ?? []}
                valueKey="id"
                labelKey="name"
                value={
                  ctx.row.original.expand.productAttributeValue_via_productAttribute?.map(
                    (val) => val.expand.attributeValue,
                  ) ?? null
                }
                listboxAction={
                  <div class="px-1.25 pb-1.25">
                    <p class="text-sm italic p-1 text-center">Create new (enter)</p>
                  </div>
                }
                onChange={(val) =>
                  props.handleAttributeValuesChange(
                    ctx.row.index,
                    val as AttributeValueRecord | AttributeValueRecord[] | null,
                    ctx.row.original,
                  )
                }
                onCreateInline={async (text) => {
                  if (!ctx.row.original.attribute) return undefined;
                  const rec = await upsertAttributeValue(
                    text,
                    ctx.row.original.attribute,
                    ctx.row.original.id,
                  );
                  await refetchAttributeValueOptions();
                  return rec ?? undefined;
                }}
              />
            ),
          },
          {
            header: "",
            id: "delete",
            cell: (ctx) => (
              <Button
                appearance="error"
                modifier="circle"
                variant="soft"
                onClick={() => props.handleDeleteAttribute(ctx.row.index)}
              >
                <X size={16} />
              </Button>
            ),
          },
        ]}
      />
      <div class="w-full flex mt-2">
        <Button onClick={props.handleAddAttribute} appearance="success">
          <Plus class="w-[1em] h-[1em]" /> New Attribute
        </Button>
      </div>
    </Show>
  );
};

export default ProductFormAttributesTab;
