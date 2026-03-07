import { Component } from "solid-js";

import UomTable from "../modules/base/views/UomTable";
import { Card } from "@solidpb/ui-kit";

const Uom: Component = () => {
  return (
    <Card>
      <UomTable />
    </Card>
  );
};

export default Uom;
