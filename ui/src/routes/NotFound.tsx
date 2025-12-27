import { Component } from "solid-js";
import { A } from "@solidjs/router";

import Container from "../views/app/Container";

const NotFound: Component = () => {
  return (
    <Container>
      <h2 class="text-[var(--color-text-light-primary)] dark:text-[var(--color-dark-primary)]">
        You appear to be lost
      </h2>
      <A href="/" class="text-[var(--color-light-primary)] dark:text-[var(--color-dark-primary)] underline">
        take me back home
      </A>
    </Container>
  );
};

export default NotFound;
