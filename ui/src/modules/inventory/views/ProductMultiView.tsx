import { Component, createSignal, Resource, Show, Suspense } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Button, Card, type Filter, type FilterGroup } from "@solidpb/ui-kit";
import Rows4 from "lucide-solid/icons/rows-4";
import Columns2 from "lucide-solid/icons/columns-2";

import DataFilterBar from "../../../components/DataFilterBar";
import { getAvailableFields } from "../../../services/getAvailableFields";
import LoadFullScreen from "../../../views/app/LoadFullScreen";
import ProductTable from "./ProductTable";
import ProductKanban from "./ProductKanban";
import { NEW_RECORD_ID } from "../../../../constants";

interface ProductMultiViewProps {
  products: Resource<ProductRecord[]>;
}

export const ProductMultiView: Component<ProductMultiViewProps> = (props) => {
  const navigate = useNavigate();
  const [viewType, setViewType] = createSignal<"table" | "kanban">("kanban");
  const [filters, setFilters] = createSignal<(Filter<ProductRecord> | FilterGroup<ProductRecord>)[]>([]);

  return (
    <div>
      <div class="flex gap-3">
        <div class="flex-1 flex justify-center">
          <DataFilterBar<ProductRecord>
            filters={filters}
            setFilters={setFilters}
            availableFields={getAvailableFields<ProductRecord>("product")}
            onCreateNew={() => {
              navigate(`/products/${NEW_RECORD_ID}`);
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
              products={props.products() ?? []}
              onItemClick={(item) => navigate(`/products/${item.id}`)}
              onCreateNew={() => navigate(`/products/${NEW_RECORD_ID}`)}
            />
          }
        >
          <Card class="mt-2">
            <ProductTable
              onRowClick={(item) => navigate(`/products/${item.id}`)}
              products={props.products() ?? []}
              onCreateNew={() => navigate(`/products/${NEW_RECORD_ID}`)}
            />
          </Card>
        </Show>
      </Suspense>
    </div>
  );
};

export default ProductMultiView;
