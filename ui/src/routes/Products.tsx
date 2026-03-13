import { Component, createResource } from "solid-js";

import ProductMultiView from "../views/inventory/ProductMultiView";
import { Collections } from "../../pocketbase-types";
import { useAuthPB } from "../config/pocketbase";

const Dashboard: Component = () => {
  const { pb } = useAuthPB();
  const [products] = createResource(async () => {
    const res = await pb.collection(Collections.Product).getFullList({ sort: "name" });
    return res;
  });

  return <ProductMultiView products={products} />;
};

export default Dashboard;
