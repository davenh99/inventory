import { Component, Show } from "solid-js";
import { Table } from "@solidpb/ui-kit";
import { ColumnDef } from "@tanstack/solid-table";

import NoProductVariants from "./NoProductVariants";

interface ProductVariantTableProps {
  products: ProductVariantRecord[];
  onRowClick: (product: ProductVariantRecord) => void;
}

export const ProductVariantTable: Component<ProductVariantTableProps> = (props) => {
  const columns: ColumnDef<ProductVariantRecord>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "sellPrice",
      header: "Sell Price",
    },
    {
      accessorKey: "sku",
      header: "SKU",
    },
    {
      accessorKey: "sellPrice",
      header: "Sell Price",
    },
  ];

  return (
    <Show when={props.products.length} fallback={<NoProductVariants />}>
      <Table<ProductVariantRecord>
        data={props.products}
        columns={columns}
        onRowClick={props.onRowClick}
        showHeaders
      />
    </Show>
  );
};

export default ProductVariantTable;
