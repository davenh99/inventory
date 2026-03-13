import { Component } from "solid-js";
import { useParams } from "@solidjs/router";

import { ProductForm } from "../modules/inventory/views/ProductForm";

export const Product: Component = () => {
  const params = useParams();

  return <ProductForm productId={params.id} />;
};

export default Product;
