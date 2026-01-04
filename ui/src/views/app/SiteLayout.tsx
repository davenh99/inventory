import { ParentComponent } from "solid-js";

import { Container } from "@solidpb/ui-kit";

export const SiteLayout: ParentComponent = (props) => {
  return (
    <div class="flex flex-col h-screen">
      <main class="flex-1 flex flex-col overflow-y-auto">
        <Container class="flex flex-col items-center">{props.children}</Container>
      </main>
    </div>
  );
};

export default SiteLayout;
