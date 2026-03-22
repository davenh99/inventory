import { Component, Resource, Suspense } from "solid-js";

import ProductVariantTable from "./ProductVariantTable";
import LoadFullScreen from "../app/LoadFullScreen";
import { useNavigate } from "@solidjs/router";

interface ProductVariantMultiViewProps {
  products: Resource<ProductVariantRecord[]>;
}

export const ProductVariantMultiView: Component<ProductVariantMultiViewProps> = (props) => {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<LoadFullScreen />}>
      <ProductVariantTable
        products={props.products() ?? []}
        onRowClick={(record) => navigate(`/productVariant/${record.id}`)}
      />
    </Suspense>
  );
};

export default ProductVariantMultiView;
