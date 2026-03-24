import { useParams } from "@solidjs/router";
import { Component } from "solid-js";

import { BomForm } from "../views/inventory/BomForm";

export const Bom: Component = () => {
  const params = useParams();

  return <BomForm recordId={params.id} />;
};

export default Bom;
