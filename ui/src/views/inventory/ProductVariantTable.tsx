import { Component, Show } from "solid-js";
import { Image, Table } from "@solidpb/ui-kit";
import { ColumnDef } from "@tanstack/solid-table";

import NoProducts from "./NoProducts";
import { useAuthPB } from "../../config/pocketbase";

interface ProductVariantTableProps {
  products: ProductVariantRecord[];
  onRowClick: (product: ProductVariantRecord) => void;
  onCreateNew: () => void;
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
    <Show when={props.products.length} fallback={<NoProducts onCreateNew={props.onCreateNew} />}>
      <Table<ProductVariantRecord>
        data={props.products}
        columns={columns}
        onRowClick={props.onRowClick}
        headers
      />
    </Show>
  );
};

export default ProductVariantTable;
