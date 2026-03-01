import { Component } from "solid-js";
import { A } from "@solidjs/router";

import { Container, Link } from "@solidpb/ui-kit";

const NotFound: Component = () => {
  return (
    <Container>
      <h2 class="">You appear to be lost</h2>
      <Link as={A} href="/" class="underline">
        take me back home
      </Link>
    </Container>
  );
};

export default NotFound;
