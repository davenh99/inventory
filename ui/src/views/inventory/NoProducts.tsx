import { Component } from "solid-js";
import PackageOpen from "lucide-solid/icons/package-open";
import { Button } from "@solidpb/ui-kit";
import Plus from "lucide-solid/icons/plus";

interface NoProductsProps {
  onCreateNew: () => void;
}

export const NoProducts: Component<NoProductsProps> = (props) => {
  return (
    <div class="flex flex-col items-center justify-center gap-4 p-8">
      <PackageOpen size={48} />
      <div class="text-2xl font-bold">No Products Found</div>
      <Button onClick={props.onCreateNew} appearance="success">
        <Plus size={16} /> New Product
      </Button>
    </div>
  );
};

export default NoProducts;
