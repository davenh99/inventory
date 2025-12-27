import { Component, Show, splitProps } from "solid-js";
import { tv } from "tailwind-variants";

interface FileInputProps {
  label?: string;
  onChange: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  class?: string;
}

const root = tv({ base: "flex flex-col gap-1" });
const input = tv({
  base: "block w-full text-sm text-[var(--color-text-light-primary)] dark:text-[var(--color-text-dark-primary)] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-light-muted)] dark:file:bg-[var(--color-dark-muted)] file:text-[var(--color-light-primary)] dark:file:text-[var(--color-dark-primary)] hover:file:bg-[var(--color-light-surface)] dark:hover:file:bg-[var(--color-dark-surface)] transition",
});

const FileInput: Component<FileInputProps> = (props) => {
  const [local, others] = splitProps(props, ["label", "class"]);
  return (
    <div class={root({ class: local.class })}>
      <Show when={local.label}>
        <label class="block mb-1 text-xs font-medium text-[var(--color-text-light-secondary)] dark:text-[var(--color-text-dark-secondary)]">
          {local.label}
        </label>
      </Show>
      <input
        type="file"
        class={input()}
        onChange={(e) => props.onChange(e.currentTarget.files)}
        accept={props.accept}
        multiple={props.multiple}
        {...others}
      />
    </div>
  );
};

export default FileInput;
