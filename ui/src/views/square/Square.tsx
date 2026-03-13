import { Component } from "solid-js";
import { Button, Card, Toast } from "@solidpb/ui-kit";
import Import from "lucide-solid/icons/import";
import { toaster } from "@kobalte/core";

import { useAuthPB } from "../../config/pocketbase";

export const Square: Component = () => {
  const { pb } = useAuthPB();

  const handleImport = async () => {
    const response = await pb.send("/square/items/import", {
      method: "POST",
      headers: {
        Accept: "text/plain",
      },
    });

    toaster.show((props) => (
      <Toast
        {...props}
        appearance="success"
        title="Import Successful"
        msg="Your Square items have been imported successfully."
      />
    ));

    console.log(response);
  };

  return (
    <Card class="space-y-1">
      <div>
        <Button variant="outline" appearance="primary" onClick={handleImport}>
          <Import /> Import products
        </Button>
      </div>
    </Card>
  );
};

export default Square;
