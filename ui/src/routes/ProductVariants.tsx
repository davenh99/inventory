import { useParams } from "@solidjs/router";
import { Component } from "solid-js";

import ProductVariantMultiView from "../views/inventory/ProductVariantMultiView";

export const ProductVariants: Component = () => {
  const params = useParams();

  return <ProductVariantMultiView />;
};

export default ProductVariants;
