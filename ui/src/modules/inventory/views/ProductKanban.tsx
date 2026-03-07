import { Component, Show } from "solid-js";
import NoProducts from "./NoProducts";
import { Image, Kanban } from "@solidpb/ui-kit";

interface ProductKanbanProps {
  products: ProductRecord[];
  onItemClick: (product: ProductRecord) => void;
  onCreateNew: () => void;
}

export const ProductKanban: Component<ProductKanbanProps> = (props) => {
  return (
    <Show when={props.products.length} fallback={<NoProducts onCreateNew={props.onCreateNew} />}>
      <Kanban<ProductRecord, {}>
        columns={[]}
        items={props.products}
        onCardClick={props.onItemClick}
        columnClass="w-full grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] bg-base-100"
        cardClass="border border-base-200"
        renderItem={(item) => (
          <div class="flex gap-2">
            <Image src={item.image} size="sm" class="rounded-sm" />
            <div>
              <p class="font-bold">{item.name}</p>
            </div>
          </div>
        )}
      />
    </Show>
  );
};

export default ProductKanban;
