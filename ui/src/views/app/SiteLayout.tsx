import { ParentComponent } from "solid-js";

import Container from "./Container";

export const SiteLayout: ParentComponent = (props) => {
  return (
    <div class="flex flex-col h-screen bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] text-[var(--color-text-light-primary)] dark:text-[var(--color-dark-primary)]">
      <main class="flex-1 flex flex-col overflow-y-auto">
        <Container class="flex flex-col items-center">{props.children}</Container>
      </main>
    </div>
  );
};

export default SiteLayout;
