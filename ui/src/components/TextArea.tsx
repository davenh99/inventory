import { Component, splitProps, Show } from "solid-js";
import { TextField, TextFieldRootProps, TextFieldInputProps } from "@kobalte/core/text-field";
import { tv } from "tailwind-variants";

interface ExtraProps {
  label?: string;
  variant?: "bordered" | "none";
  size?: "sm" | "md";
  textareaProps?: TextFieldInputProps;
}

type TextAreaRootProps = ExtraProps & TextFieldRootProps;

const root = tv({ base: "flex flex-col gap-1" });
const textarea = tv({
  base: "w-full rounded-sm outline-none px-2 py-1 min-h-[80px]",
  variants: {
    variant: {
      bordered: "border-2 border-[var(--color-light-muted)] dark:border-[var(--color-dark-muted)]",
      none: "",
    },
  },
  defaultVariants: {
    variant: "none",
  },
});

const TextArea: Component<TextAreaRootProps> = (props) => {
  const [local, others] = splitProps(props, ["label", "class", "variant", "textareaProps"]);
  return (
    <TextField class={root({ class: local.class })} {...others}>
      <Show when={local.label}>
        <TextField.Label>{local.label}</TextField.Label>
      </Show>
      <TextField.Input
        class={textarea({ variant: local.variant, class: local.textareaProps?.class })}
        {...local.textareaProps}
      />
    </TextField>
  );
};

export default TextArea;
