import { Component } from "solid-js";

import ProductMultiView from "../modules/inventory/views/ProductMultiView";
import { BreadCrumbs } from "@solidpb/ui-kit";
import { useCrumbs } from "../config/Crumbs";

const Dashboard: Component = () => {
  // const { crumbs } = useCrumbs();

  return (
    <>
      {/* <BreadCrumbs items={crumbs()} /> */}
      <ProductMultiView />
    </>
  );
};

export default Dashboard;
