import { Component, JSX } from "solid-js";
import { tv } from "tailwind-variants";

interface TextProps {
  children: JSX.Element;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "error" | "success" | "warning" | "muted";
  class?: string;
}

const text = tv({
  base: "font-normal",
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
    color: {
      primary: "text-[var(--color-text-light-primary)] dark:text-[var(--color-text-dark-primary)]",
      secondary: "text-[var(--color-text-light-secondary)] dark:text-[var(--color-text-dark-secondary)]",
      error: "text-[var(--color-light-error)] dark:text-[var(--color-dark-error)]",
      success: "text-[var(--color-light-success)] dark:text-[var(--color-dark-success)]",
      warning: "text-[var(--color-light-warning)] dark:text-[var(--color-dark-warning)]",
      muted: "text-[var(--color-light-muted)] dark:text-[var(--color-dark-muted)]",
    },
  },
  defaultVariants: {
    size: "md",
    color: "primary",
  },
});

const Text: Component<TextProps> = (props) => (
  <span class={text({ size: props.size, color: props.color, class: props.class })}>{props.children}</span>
);

export default Text;
