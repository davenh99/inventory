import { Button, Card, Kanban, Table, type Filter, type FilterGroup } from "@solidpb/ui-kit";
import { Component, createResource, createSignal, Show, Suspense } from "solid-js";
import Rows4 from "lucide-solid/icons/rows-4";
import Columns2 from "lucide-solid/icons/columns-2";

import { Collections } from "../../../../pocketbase-types";
import { useAuthPB } from "../../../config/pocketbase";
import DataFilterBar from "../../../components/DataFilterBar";
import { getAvailableFields } from "../../../services/getAvailableFields";
import LoadFullScreen from "../../../views/app/LoadFullScreen";
import ProductTable from "./ProductTable";
import { ProductForm } from "./ProductForm";

export const ProductMultiView: Component = () => {
  const [viewType, setViewType] = createSignal<"table" | "kanban">("kanban");
  const [filters, setFilters] = createSignal<(Filter<ProductRecord> | FilterGroup<ProductRecord>)[]>([]);
  const [creatingNew, setCreatingNew] = createSignal(false);
  const { pb } = useAuthPB();

  const [products, { refetch }] = createResource(async () => {
    const res = await pb.collection(Collections.Product).getFullList();
    return res;
  });

  const saveProduct = async (data: Partial<ProductRecord>) => {
    try {
      if (data.id) {
        await pb.collection(Collections.Product).update(data.id!, data);
      } else {
        await pb.collection(Collections.Product).create(data);
      }
      refetch();
    } catch (e) {
      console.error("Error saving product: ", e);
    } finally {
      setCreatingNew(false);
    }
  };

  return (
    <Show when={!creatingNew()} fallback={<ProductForm product={{} as ProductRecord} onSave={saveProduct} />}>
      <div>
        <div class="flex gap-3">
          <div class="flex-1 flex justify-center">
            <DataFilterBar<ProductRecord>
              filters={filters}
              setFilters={setFilters}
              availableFields={getAvailableFields<ProductRecord>("product")}
              onCreateNew={() => setCreatingNew(true)}
            />
          </div>
          <div class="join">
            <Button
              class="join-item"
              modifier="square"
              appearance={viewType() === "table" ? "primary" : undefined}
              onClick={() => setViewType("table")}
            >
              <Rows4 class="h-[1.5em] w-[1.5em]" />
            </Button>
            <Button
              class="join-item"
              modifier="square"
              appearance={viewType() === "kanban" ? "primary" : undefined}
              onClick={() => setViewType("kanban")}
            >
              <Columns2 class="h-[1.5em] w-[1.5em]" />
            </Button>
          </div>
        </div>
        <Suspense fallback={<LoadFullScreen />}>
          <Show
            when={viewType() === "table"}
            fallback={<Kanban<ProductRecord, null> columns={[]} items={products() ?? []} />}
          >
            <Card class="mt-2">
              <ProductTable onRowClick={() => {}} products={products() ?? []} />
            </Card>
          </Show>
        </Suspense>
      </div>
    </Show>
  );
};

export default ProductMultiView;
