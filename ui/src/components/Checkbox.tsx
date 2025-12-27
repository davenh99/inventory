import { Component, createMemo, Show, ValidComponent } from "solid-js";
import { CheckboxRootProps, Checkbox as KCheckbox } from "@kobalte/core/checkbox";
import Check from "lucide-solid/icons/check";
import { PolymorphicProps } from "@kobalte/core";

import { debounce } from "../methods/debounce";

type CheckBoxProps<T extends ValidComponent = "div"> = PolymorphicProps<T, CheckboxRootProps<T>>;

interface Props extends CheckBoxProps {
  label?: string;
  saveFunc?: (v: boolean) => Promise<void>;
}

export const Checkbox: Component<Props> = (props) => {
  const debouncedSave = createMemo(() => (props.saveFunc ? debounce(props.saveFunc) : undefined));

  const handleChange = (v: boolean) => {
    props.onChange?.(v);
    debouncedSave()?.(v);
  };

  return (
    <KCheckbox checked={props.checked} onChange={handleChange} class="flex flex-row space-x-2 items-center">
      <KCheckbox.Input />
      <KCheckbox.Control class="h-5 w-5 rounded-sm border-2 border-[var(--color-light-muted)] dark:border-[var(--color-dark-muted)] bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] data-[checked]:bg-[var(--color-light-primary)] dark:data-[checked]:bg-[var(--color-dark-primary)] transition-colors">
        <KCheckbox.Indicator class="text-[var(--color-light-surface)] dark:text-[var(--color-dark-surface)]">
          <Check />
        </KCheckbox.Indicator>
      </KCheckbox.Control>
      <Show when={props.label}>
        <KCheckbox.Label class="text-[var(--color-text-light-primary)] dark:text-[var(--color-text-dark-primary)]">
          {props.label}
        </KCheckbox.Label>
      </Show>
    </KCheckbox>
  );
};

export default Checkbox;
