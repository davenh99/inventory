import { Component } from "solid-js";
import { A } from "@solidjs/router";

import { Container } from "@solidpb/ui-kit";

const NotFound: Component = () => {
  return (
    <Container>
      <h2 class="text-text-light-primary dark:text-dark-primary">You appear to be lost</h2>
      <A href="/" class="text-light-primary dark:text-dark-primary underline">
        take me back home
      </A>
    </Container>
  );
};

export default NotFound;
