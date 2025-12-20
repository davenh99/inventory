import { Component } from "solid-js";
import { A } from "@solidjs/router";

import Container from "../views/app/Container";

const NotFound: Component = () => {
  return (
    <Container>
      <h2>You appear to be lost</h2>
      <A href="/">take me back home</A>
    </Container>
  );
};

export default NotFound;
