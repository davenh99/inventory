import { useSearchParams } from "@solidjs/router";
import { Component, createResource } from "solid-js";

import ProductVariantMultiView from "../views/inventory/ProductVariantMultiView";
import { BaseQueryParams } from "../services/navigation";
import { useAuthPB } from "../config/pocketbase";
import { Collections } from "../../pocketbase-types";

export const ProductVariants: Component = () => {
  const { pb } = useAuthPB();
  const [params, setParams] = useSearchParams<BaseQueryParams>();

  const [products] = createResource(async () => {
    const res = await pb
      .collection(Collections.ProductVariant)
      .getFullList({ sort: "name", filter: params.filter?.split("·")[1] });
    return res;
  });

  return <ProductVariantMultiView products={products} />;
};

export default ProductVariants;
