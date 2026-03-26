import { Component, Show } from "solid-js";
import { Image, Table } from "@solidpb/ui-kit";
import { ColumnDef } from "@tanstack/solid-table";

import NoProducts from "./NoProducts";
import { useAuthPB } from "../../config/pocketbase";

interface ProductTableProps {
  products: ProductRecord[];
  onRowClick: (product: ProductRecord) => void;
  onCreateNew: () => void;
}

export const ProductTable: Component<ProductTableProps> = (props) => {
  const { pb } = useAuthPB();
  const columns: ColumnDef<ProductRecord>[] = [
    {
      accessorKey: "image",
      header: "Image",
      cell: (info) => {
        const url = pb.files.getURL(info.row.original, (info.getValue() as string) || "");
        return <Image src={url} alt="Product Image" class="h-8 w-8" />;
      },
    },
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
        columns={columns}
        onRowClick={props.onRowClick}
        showHeaders
      />
    </Show>
  );
};

export default ProductTable;
