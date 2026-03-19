import { Component, Resource } from "solid-js";

import { BaseQueryParams } from "../../services/navigation";
import { useSearchParams } from "@solidjs/router";

interface ProductVariantMultiViewProps {
  products: Resource<ProductVariantRecord[]>;
}

export const ProductVariantMultiView: Component<ProductVariantMultiViewProps> = () => {
  const [params, setParams] = useSearchParams<BaseQueryParams>();

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Product Variants</h1>
      <p class="text-gray-600">Manage all variants of a product in one place.</p>
    </div>
  );
};

export default ProductVariantMultiView;
