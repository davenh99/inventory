import { useParams } from "@solidjs/router";
import { Component } from "solid-js";

import { ProductVariantForm } from "../views/inventory/ProductVariantForm";

export const ProductVariant: Component = () => {
  const params = useParams();

  return <ProductVariantForm recordId={params.id} />;
};

export default ProductVariant;
