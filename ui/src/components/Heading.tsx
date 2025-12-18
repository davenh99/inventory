import { splitProps, createMemo, JSX } from "solid-js";
import { tv } from "tailwind-variants";

interface Props extends JSX.HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  appearance?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
}

const heading = tv({
  base: "font-sans text-balance tracking-tight",
  variants: {
    appearance: {
      h1: "text-4xl font-bold",
      h2: "text-3xl font-semibold",
      h3: "text-2xl font-semibold",
      h4: "text-xl font-medium",
      h5: "text-lg font-medium",
      h6: "text-base font-medium",
      p: "text-base font-normal",
    },
  },
  defaultVariants: {
    appearance: "p",
  },
});

export const Heading = (props: Props) => {
  const [local, others] = splitProps(props, ["as", "appearance", "class", "children"]);
  const Tag = (local.as ?? "p") as keyof JSX.IntrinsicElements;

  const classes = createMemo(() =>
    heading({ appearance: local.appearance ?? (local.as as any) ?? "p", class: local.class })
  );

  return (
    <Tag class={classes()} {...others}>
      {local.children}
    </Tag>
  );
};

export default Heading;
