import { Component, Show } from "solid-js";
import PackageOpen from "lucide-solid/icons/package-open";
import { Button } from "@solidpb/ui-kit";
import Plus from "lucide-solid/icons/plus";

interface NoProductVariantsProps {
  onCreateNew?: () => void;
}

export const NoProductVariants: Component<NoProductVariantsProps> = (props) => {
  return (
    <div class="flex flex-col items-center justify-center gap-4 p-8">
      <PackageOpen size={48} />
      <div class="text-2xl font-bold">No Product Variants Found</div>
      <Show when={props.onCreateNew}>
        <Button onClick={props.onCreateNew} appearance="success">
          <Plus size={16} /> New Product Variant
        </Button>
      </Show>
    </div>
  );
};

export default NoProductVariants;
