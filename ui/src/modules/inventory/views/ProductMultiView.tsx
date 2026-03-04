import { Kanban, Table, type Filter, type FilterGroup } from "@solidpb/ui-kit";
import { Component, createResource, createSignal, Show } from "solid-js";

import { Collections } from "../../../../pocketbase";
import { useAuthPB } from "../../../config/pocketbase";
import DataFilterBar from "../../../components/DataFilterBar";

export const ProductMultiView: Component = () => {
  const [viewType, setViewType] = createSignal<"table" | "kanban">("kanban");
  const [filters, setFilters] = createSignal<(Filter<ProductRecord> | FilterGroup<ProductRecord>)[]>([]);
  const { pb } = useAuthPB();

  const products = createResource(async () => {
    const res = await pb.collection(Collections.Product).getFullList();
    return res;
  });

  return (
    <div>
      <DataFilterBar<ProductRecord> filters={filters} setFilters={setFilters} availableFields={[]} />
      <p>This is the Product Multi View page.</p>
      <Show
        when={viewType() === "table"}
        fallback={
          <div>
            {/* <Kanban<ProductRecord, {}> /> */}
            <p>Kanban view coming soon...</p>
          </div>
        }
      >
        <p>Table view coming soon...</p>
        {/* <Table<ProductRecord> /> */}
      </Show>
    </div>
  );
};

export default ProductMultiView;
