import { Component, createResource, Show, Suspense } from "solid-js";
import { Checkbox, Table } from "@solidpb/ui-kit";
import { ColumnDef } from "@tanstack/solid-table";

import { useAuthPB } from "../../config/pocketbase";
import { Collections } from "../../../pocketbase-types";
import LoadFullScreen from "../../views/app/LoadFullScreen";
import { camelCaseToLabel } from "../../services/getAvailableFields";

export const UomTable: Component = () => {
  const columns: ColumnDef<UomRecord>[] = [
    {
      accessorKey: "category",
      header: "Category",
      cell: (ctx) => {
        return camelCaseToLabel(ctx.getValue() as string);
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (ctx) => {
        return <p class="font-bold">{ctx.getValue() as string}</p>;
      },
    },
    {
      accessorKey: "referenceUom",
      header: "Reference UoM",
      cell: (ctx) => {
        return <Checkbox checked={ctx.getValue() as boolean} disabled />;
      },
    },
    {
      accessorKey: "ratio",
      header: "Ratio",
    },
  ];
  const { pb } = useAuthPB();

  const [data] = createResource(async () => {
    const res = await pb.collection(Collections.Uom).getFullList({ sort: "category, -referenceUom, name" });
    return res;
  });

  return (
    <Suspense fallback={<LoadFullScreen />}>
      <Show when={data()?.length} fallback={<div>No Units of Measure found</div>}>
        <Table<UomRecord> data={data() ?? []} columns={columns} headers />
      </Show>
    </Suspense>
  );
};

export default UomTable;
