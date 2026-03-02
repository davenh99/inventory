import { Component } from "solid-js";
import { A } from "@solidjs/router";

import { Link } from "@solidpb/ui-kit";
import SiteLayout from "../views/app/SiteLayout";

const NotFound: Component = () => {
  return (
    <SiteLayout>
      <h2 class="text-center text-2xl">You appear to be lost</h2>
      <Link as={A} href="/" class="underline block text-center">
        take me back home
      </Link>
    </SiteLayout>
  );
};

export default NotFound;
