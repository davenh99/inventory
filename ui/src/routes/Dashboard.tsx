import { Component } from "solid-js";
import { Button, Card, Link } from "@solidpb/ui-kit";
import { A } from "@solidjs/router";

const Dashboard: Component = () => {
  return (
    <div class="flex-1 overflow-y-auto space-y-3 max-w-150">
      <Card>
        <h2 class="mb-2 text-center">App for mobile</h2>
        <p>
          The App is available for any device with a web browser. For convenience, it can be downloaded as an
          app on any device.{" "}
          <Link
            as={A}
            href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing"
            class="underline"
          >
            Read here
          </Link>{" "}
          about how to install the app (it's not too hard 😊).
        </p>
        <Button appearance="primary">Button</Button>
      </Card>
    </div>
  );
};

export default Dashboard;
