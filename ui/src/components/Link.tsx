import { A } from "@solidjs/router";
import { Component, JSX } from "solid-js";
import { tv } from "tailwind-variants";

interface LinkProps {
  href: string;
  children: JSX.Element;
  class?: string;
}

const link = tv({
  base: "text-[var(--color-light-primary)] dark:text-[var(--color-dark-primary)] hover:underline underline-offset-4 transition",
});

const Link: Component<LinkProps> = (props) => (
  <A href={props.href} class={link({ class: props.class })}>
    {props.children}
  </A>
);

export default Link;
