import { Component, createResource, ErrorBoundary } from "solid-js";
import { Button, Card, RelationPicker, Table, Link, Toast } from "@solidpb/ui-kit";
import { useSearchParams } from "@solidjs/router";
import { ColumnDef } from "@tanstack/solid-table";
import Plus from "lucide-solid/icons/plus";
import { toaster } from "@kobalte/core/toast";

import { useAuthPB } from "../../config/pocketbase";
import { EXPAND_BOM, EXPAND_PRODUCT, EXPAND_PRODUCT_VARIANT, NEW_RECORD_ID } from "../../../constants";
import { Collections } from "../../../pocketbase-types";
import { BaseQueryParams } from "../../services/navigation";

interface BomFormProps {
  recordId?: string;
}

type BomSearchParams = BaseQueryParams & {
  product: string;
};

export const BomForm: Component<BomFormProps> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams<BomSearchParams>();
  const { pb } = useAuthPB();

  const [bom, { mutate: mutateBom }] = createResource<BomRecordExpand | BomUpdatePayload>(async () => {
    if (props.recordId && props.recordId !== NEW_RECORD_ID) {
      const record = await pb
        .collection<BomRecordExpand>(Collections.Bom)
        .getOne(props.recordId, { expand: EXPAND_BOM });

      return record;
    } else {
      let data = { active: true, product: searchParams.product } as BomUpdatePayload;

      if (searchParams.product) {
        const productRecord = await pb
          .collection<ProductRecordExpand>(Collections.Product)
          .getOne(searchParams.product, { expand: EXPAND_PRODUCT });

        data.expand = {
          product: productRecord,
          bomLine_via_bom: [],
        };
      } else {
        throw new Error("no product id supplied");
      }

      return data;
    }
  });
  const [productVariantOptions] = createResource(async () => {
    const records = await pb.collection<ProductVariantRecordExpand>(Collections.ProductVariant).getFullList({
      filter: pb.filter("product != {:prod}", {
        prod: searchParams.product,
      }),
      expand: EXPAND_PRODUCT_VARIANT,
    });
    return records;
  });
  const productAttributeValueOptions = () => {
    let options = [] as ProductAttributeValueRecordExpand[];

    for (const pa of bom()?.expand?.product.expand.productAttribute_via_product ?? []) {
      options.push(...(pa.expand.productAttributeValue_via_productAttribute ?? []));
    }

    return options;
  };

  const handleBomLineProductVariantChange = (ind: number, pv: ProductVariantRecord) => {
    mutateBom((prev) => {
      if (!prev) return prev;
      let updatedBomLine = bom()!.expand!.bomLine_via_bom[ind];

      if (updatedBomLine) {
        updatedBomLine.productVariant = pv.id;
        updatedBomLine.qty = 1; // Reset qty to 1 when product variant changes
        updatedBomLine.uom = pv.expand?.product.uom ?? ""; // Auto fill uom based on product
        updatedBomLine.expand = {
          ...updatedBomLine.expand,
          productVariant: pv,
          uom: pv.expand?.product.expand.uom, // Auto fill uom based on product
        };
      }

      let newBomlines = [...(prev.expand?.bomLine_via_bom ?? [])];
      newBomlines.splice(ind, 1, updatedBomLine);

      return {
        ...prev,
        expand: {
          ...prev.expand,
          bomLine_via_bom: newBomlines,
        },
      } as BomRecordExpand;
    });
  };

  const handleBomLineProductAttributeValuesChange = (
    ind: number,
    vals: ProductAttributeValueRecordExpand[],
  ) => {
    mutateBom((prev) => {
      if (!prev) return prev;
      let updatedBomLine = bom()!.expand!.bomLine_via_bom[ind];

      if (updatedBomLine) {
        updatedBomLine.productAttributeValues = vals.map((val) => val.id);
        updatedBomLine.expand = { ...updatedBomLine.expand, productAttributeValues: vals };
      }

      let newBomlines = [...(prev.expand?.bomLine_via_bom ?? [])];
      newBomlines.splice(ind, 1, updatedBomLine);

      return {
        ...prev,
        expand: {
          ...prev.expand,
          bomLine_via_bom: newBomlines,
        },
      } as BomRecordExpand;
    });
  };

  const handleCreateBomLine = () => {
    mutateBom((prev) => {
      if (!prev) return prev;
      const newBomLine = {
        productAttributeValues: [],
        qty: 1,
        uom: "",
        expand: {
          productVariant: {},
          productAttributeValues: [],
          uom: { name: "" },
        },
      };

      return {
        ...prev,
        expand: {
          ...prev.expand,
          bomLine_via_bom: [...(prev.expand?.bomLine_via_bom ?? []), newBomLine],
        },
      } as BomRecordExpand;
    });
  };

  const handleSave = async () => {
    if (!bom()) return;

    let bomId = props.recordId;

    if (bomId && bomId !== NEW_RECORD_ID) {
      await pb.collection(Collections.Bom).update(bomId, bom() as BomUpdatePayload);
    } else {
      const createdBom = await pb.collection(Collections.Bom).create(bom() as BomUpdatePayload);
      bomId = createdBom.id;
    }

    // Save bom lines
    for (const line of bom()!.expand!.bomLine_via_bom) {
      if (!line.id) {
        await pb.collection(Collections.BomLine).create({
          productVariant: line.productVariant,
          productAttributeValues: line.productAttributeValues,
          qty: line.qty,
          uom: line.uom,
          bom: bomId!,
        } as BomLineUpdatePayload);
      } else {
        await pb.collection(Collections.BomLine).update(line.id, {
          productVariant: line.productVariant,
          productAttributeValues: line.productAttributeValues,
          qty: line.qty,
          uom: line.uom,
          bom: bomId,
        } as BomLineUpdatePayload);
      }
    }
    toaster.show((props) => (
      <Toast {...props} appearance="success" title="Saved" msg="Recipe saved successfully" />
    ));
  };

  const bomLineColumns: ColumnDef<BomLineRecordExpand>[] = [
    {
      id: "productVariant",
      header: "Product Variant",
      cell: (ctx) => {
        return (
          <RelationPicker<ProductVariantRecordExpand>
            options={productVariantOptions() ?? []}
            value={ctx.row.original.expand.productVariant}
            labelKey="name"
            valueKey="id"
            onChange={(val) =>
              handleBomLineProductVariantChange(ctx.row.index, val as ProductVariantRecordExpand)
            }
          />
        );
      },
    },
    {
      accessorKey: "qty",
      header: "Qty",
    },
    {
      id: "uom",
      header: "UOM",
      cell: (ctx) => {
        return <p>{ctx.row.original.expand.uom.name}</p>;
      },
    },
    {
      accessorKey: "productAttributeValues",
      header: "Match Attribute Values",
      cell: (ctx) => {
        return (
          <RelationPicker<ProductAttributeValueRecordExpand>
            multi
            options={productAttributeValueOptions()}
            value={ctx.row.original.expand.productAttributeValues}
            labelKey="name"
            valueKey="id"
            onChange={(vals) =>
              handleBomLineProductAttributeValuesChange(
                ctx.row.index,
                vals as ProductAttributeValueRecordExpand[],
              )
            }
          />
        );
      },
    },
  ];

  return (
    <ErrorBoundary fallback={(err) => <p>{err.message}</p>}>
      <Card>
        <h2 class="text-md">
          Recipe for <Link href={`/product/${bom()?.product}`}>{bom()?.expand?.product.name}</Link>
        </h2>

        <Table<BomLineRecordExpand>
          headers
          emptyState={<p class="w-full text-center italic">No Recipe Lines</p>}
          data={bom()?.expand?.bomLine_via_bom ?? []}
          columns={bomLineColumns}
        />
        <div class="flex justify-center">
          <Button appearance="success" onClick={handleCreateBomLine}>
            <Plus class="w-[1.3em] h-[1.3em]" /> New line
          </Button>
        </div>
        <div class="flex justify-end">
          <Button appearance="success" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Card>
    </ErrorBoundary>
  );
};

export default BomForm;
