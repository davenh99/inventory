import { Component, Show } from "solid-js";
import NoProducts from "./NoProducts";
import { Kanban } from "@solidpb/ui-kit";

interface ProductKanbanProps {
  products: ProductRecord[];
  onItemClick: (product: ProductRecord) => void;
  onCreateNew: () => void;
}

export const ProductKanban: Component<ProductKanbanProps> = (props) => {
  return (
    <Show when={props.products.length} fallback={<NoProducts onCreateNew={props.onCreateNew} />}>
      <div>Product Kanban View</div>
      <Kanban<ProductRecord, null> columns={[]} items={props.products} onCardClick={props.onItemClick} />
    </Show>
  );
};

export default ProductKanban;
