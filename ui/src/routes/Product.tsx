import { Component } from "solid-js";
import { useParams } from "@solidjs/router";

import { ProductForm } from "../views/inventory/ProductForm";

export const Product: Component = () => {
  const params = useParams();

  return <ProductForm productId={params.id} />;
};

export default Product;
