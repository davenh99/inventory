import { ParentComponent } from "solid-js";

import Container from "./Container";

export const SiteLayout: ParentComponent = (props) => {
  return (
    <div class="flex flex-col h-screen bg-light-background dark:bg-dark-background text-black dark:text-white">
      <main class="flex-1 flex flex-col overflow-y-auto">
        <Container class="flex flex-col items-center">{props.children}</Container>
      </main>
    </div>
  );
};

export default SiteLayout;
