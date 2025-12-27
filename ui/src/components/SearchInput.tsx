import { Component, splitProps } from "solid-js";
import { TextField } from "@kobalte/core/text-field";
import { tv } from "tailwind-variants";

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  class?: string;
}

const search = tv({
  base: "w-full rounded px-2 py-1 border border-[var(--color-light-muted)] dark:border-[var(--color-dark-muted)] bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)]",
});

const SearchInput: Component<SearchInputProps> = (props) => (
  <TextField class={search({ class: props.class })} value={props.value} onChange={props.onChange}>
    <TextField.Input placeholder={props.placeholder || "Search..."} />
  </TextField>
);

export default SearchInput;
