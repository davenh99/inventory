import { Button, Card, type Filter, type FilterGroup, type BreadCrumb, BreadCrumbs } from "@solidpb/ui-kit";
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
import ProductKanban from "./ProductKanban";
import { useSearchParams } from "@solidjs/router";
import { NEW_RECORD_ID } from "../../../../constants";

type ProductMultiViewSearchParams = {
  product: string; // product id
};

export const ProductMultiView: Component = () => {
  const [searchParams, setSearchParams] = useSearchParams<ProductMultiViewSearchParams>();
  const [viewType, setViewType] = createSignal<"table" | "kanban">("kanban");
  const [filters, setFilters] = createSignal<(Filter<ProductRecord> | FilterGroup<ProductRecord>)[]>([]);
  const { pb } = useAuthPB();

  const [products, { refetch }] = createResource(async () => {
    const res = await pb.collection(Collections.Product).getFullList();
    return res;
  });

  return (
    <Show
      when={searchParams.product === undefined}
      fallback={<ProductForm onSave={refetch} productId={searchParams.product} />}
    >
      <div>
        <div class="flex gap-3">
          <div class="flex-1 flex justify-center">
            <DataFilterBar<ProductRecord>
              filters={filters}
              setFilters={setFilters}
              availableFields={getAvailableFields<ProductRecord>("product")}
              onCreateNew={() => {
                setSearchParams({ product: NEW_RECORD_ID });
              }}
            />
          </div>
          <div class="join">
            <Button
              class="join-item"
              modifier="square"
              appearance={viewType() === "table" ? "neutral" : undefined}
              onClick={() => setViewType("table")}
            >
              <Rows4 class="h-[1.2em] w-[1.2em]" />
            </Button>
            <Button
              class="join-item"
              modifier="square"
              appearance={viewType() === "kanban" ? "neutral" : undefined}
              onClick={() => setViewType("kanban")}
            >
              <Columns2 class="h-[1.2em] w-[1.2em]" />
            </Button>
          </div>
        </div>
        <Suspense fallback={<LoadFullScreen />}>
          <Show
            when={viewType() === "table"}
            fallback={
              <ProductKanban
                products={products() ?? []}
                onItemClick={() => {}}
                onCreateNew={() => setSearchParams({ product: NEW_RECORD_ID })}
              />
            }
          >
            <Card class="mt-2">
              <ProductTable
                onRowClick={() => {}}
                products={products() ?? []}
                onCreateNew={() => setSearchParams({ product: NEW_RECORD_ID })}
              />
            </Card>
          </Show>
        </Suspense>
      </div>
    </Show>
  );
};

export default ProductMultiView;
