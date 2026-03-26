import { Component, createResource, ErrorBoundary, Suspense } from "solid-js";
import { Button, Card, RelationPicker, Table, Link, Toast } from "@solidpb/ui-kit";
import { createStore } from "solid-js/store";
import { useSearchParams } from "@solidjs/router";
import { ColumnDef } from "@tanstack/solid-table";
import Plus from "lucide-solid/icons/plus";
import { toaster } from "@kobalte/core/toast";

import { useAuthPB } from "../../config/pocketbase";
import { EXPAND_BOM, EXPAND_PRODUCT, EXPAND_PRODUCT_VARIANT, NEW_RECORD_ID } from "../../../constants";
import { Collections } from "../../../pocketbase-types";
import { BaseQueryParams } from "../../services/navigation";
import LoadFullScreen from "../app/LoadFullScreen";

interface BomFormProps {
  recordId?: string;
}

type BomSearchParams = BaseQueryParams & {
  product: string;
};

export const BomForm: Component<BomFormProps> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams<BomSearchParams>();
  const [bomLines, setBomLines] = createStore<Partial<BomLineRecordExpand>[]>([]);
  const { pb } = useAuthPB();

  const [bom] = createResource<Partial<BomRecordExpand>>(async () => {
    if (props.recordId && props.recordId !== NEW_RECORD_ID) {
      const record = await pb
        .collection<BomRecordExpand>(Collections.Bom)
        .getOne(props.recordId, { expand: EXPAND_BOM });

      return record;
    } else {
      let data = { active: true, product: searchParams.product } as Partial<BomRecordExpand>;

      if (searchParams.product) {
        const productRecord = await pb
          .collection<ProductRecordExpand>(Collections.Product)
          .getOne(searchParams.product, { expand: EXPAND_PRODUCT });

        data.expand = {
          product: productRecord,
        };
      } else {
        throw new Error("no product id supplied");
      }

      return data;
    }
  });
  const [bomLinesResource] = createResource(async () => {
    let records: BomLineRecordExpand[] = [];

    if (bom()?.id) {
      records = await pb
        .collection(Collections.BomLine)
        .getFullList({ filter: pb.filter("bom = {:bom}", { bom: bom()!.id }) });
    }

    setBomLines(records);
    return records;
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

  const handleBomLineProductVariantChange = (ind: number, pv: ProductVariantRecordExpand) => {
    setBomLines(ind, "qty", 1);
    setBomLines(ind, "productVariant", pv.id);
    setBomLines(ind, "uom", pv.expand?.product.uom ?? "");
    setBomLines(ind, "expand", "productVariant", pv);
    setBomLines(ind, "expand", "uom", pv.expand?.product.expand.uom);
  };
  const handleBomLineProductAttributeValuesChange = (
    ind: number,
    vals: ProductAttributeValueRecordExpand[],
  ) => {
    setBomLines(
      ind,
      "productAttributeValues",
      vals.map((val) => val.id),
    );
    setBomLines(ind, "expand", "productAttributeValues", vals);
  };

  const handleCreateBomLine = () => {
    setBomLines((prev) => [...prev, { qty: 1 }]);
  };

  const handleSave = async () => {
    if (!bom()) return;

    let bomId = props.recordId;

    if (bomId && bomId !== NEW_RECORD_ID) {
    } else {
      const createdBom = await pb.collection(Collections.Bom).create(bom() as BomUpdatePayload);
      bomId = createdBom.id;

      // todo navigate to the id here probably
    }

    // Save bom lines
    const batch = pb.createBatch();
    for (const line of bomLines) {
      const data: BomLineUpdatePayload = {
        ...line,
        bom: bomId,
      };

      if (!line.id) {
        batch.collection(Collections.BomLine).create(data);
      } else {
        batch.collection(Collections.BomLine).update(line.id, data);
      }
    }

    await batch.send();

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
            value={ctx.row.original.expand.productVariant ?? null}
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
        return <p>{ctx.row.original.expand.uom?.name ?? ""}</p>;
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
            value={ctx.row.original.expand.productAttributeValues ?? null}
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
      <Suspense fallback={<LoadFullScreen />}>
        <Card>
          <h2 class="text-md">
            Recipe for <Link href={`/product/${bom()?.product}`}>{bom()?.expand?.product.name}</Link>
          </h2>

          <Table<BomLineRecordExpand>
            showHeaders
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
      </Suspense>
    </ErrorBoundary>
  );
};

export default BomForm;
