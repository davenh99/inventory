import { DatePicker } from "@kobalte/core/date-picker";
import { Component, Show } from "solid-js";
import { tv } from "tailwind-variants";

interface DateInputProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  class?: string;
}

const dateInput = tv({
  base: "rounded border px-2 py-1 bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)]",
});

const DateInput: Component<DateInputProps> = (props) => (
  <div class={props.class}>
    <Show when={props.label}>
      <label class="block mb-1 text-xs font-medium text-[var(--color-text-light-secondary)] dark:text-[var(--color-text-dark-secondary)]">
        {props.label}
      </label>
    </Show>
    <DatePicker value={props.value} onChange={props.onChange} class={dateInput()} />
  </div>
);

export default DateInput;
