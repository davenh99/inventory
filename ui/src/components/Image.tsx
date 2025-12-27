import { Component } from "solid-js";
import { tv } from "tailwind-variants";

interface ImageProps {
  src: string;
  alt?: string;
  class?: string;
  rounded?: boolean;
}

const image = tv({
  base: "object-cover",
  variants: {
    rounded: {
      true: "rounded-full",
      false: "rounded-none",
    },
  },
  defaultVariants: {
    rounded: false,
  },
});

const Image: Component<ImageProps> = (props) => (
  <img src={props.src} alt={props.alt} class={image({ rounded: props.rounded, class: props.class })} />
);

export default Image;
