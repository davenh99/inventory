import { Component, Show } from "solid-js";
import { Table } from "@solidpb/ui-kit";
import { ColumnDef } from "@tanstack/solid-table";
import NoProducts from "./NoProducts";

interface ProductTableProps {
  products: ProductRecord[];
  onRowClick: (product: ProductRecord) => void;
  onCreateNew: () => void;
}

export const ProductTable: Component<ProductTableProps> = (props) => {
  const columns: ColumnDef<ProductRecord>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "sellPrice",
      header: "Sell Price",
    },
  ];

  return (
    <Show when={props.products.length} fallback={<NoProducts onCreateNew={props.onCreateNew} />}>
      <Table<ProductRecord>
        data={props.products}
        columns={() => columns}
        onRowClick={props.onRowClick}
        headers
      />
    </Show>
  );
};

export default ProductTable;
