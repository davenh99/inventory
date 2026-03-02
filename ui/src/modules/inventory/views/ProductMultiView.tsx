import { FilterBar, Kanban, Table } from "@solidpb/ui-kit";
import { Component, createResource, createSignal, Show } from "solid-js";

import { Collections } from "../../../../pocketbase";
import { useAuthPB } from "../../../config/pocketbase";

export const ProductMultiView: Component = () => {
  const [viewType, setViewType] = createSignal<"table" | "kanban">("kanban");
  const { pb } = useAuthPB();

  const products = createResource(async () => {
    const res = await pb.collection(Collections.Product).getFullList();
    return res;
  });

  return (
    <div>
      {/* <FilterBar<ProductRecord> /> */}
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
