import { Select as KSelect } from "@kobalte/core/select";
import { Component, For, Show } from "solid-js";
import { tv } from "tailwind-variants";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  class?: string;
}

const select = tv({
  base: "rounded border px-2 py-1 bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)]",
});

const Select: Component<SelectProps> = (props) => (
  <div class={props.class}>
    <Show when={props.label}>
      <label class="block mb-1 text-xs font-medium text-[var(--color-text-light-secondary)] dark:text-[var(--color-text-dark-secondary)]">
        {props.label}
      </label>
    </Show>
    <KSelect value={props.value} onChange={props.onChange} class={select()}>
      <KSelect.Trigger>
        {props.options.find((o) => o.value === props.value)?.label || "Select..."}
      </KSelect.Trigger>
      <KSelect.Portal>
        <KSelect.Content>
          <For each={props.options}>
            {(option) => <KSelect.Item value={option.value}>{option.label}</KSelect.Item>}
          </For>
        </KSelect.Content>
      </KSelect.Portal>
    </KSelect>
  </div>
);

export default Select;
