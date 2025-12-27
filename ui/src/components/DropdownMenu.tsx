import { DropdownMenu as KDropdownMenu } from "@kobalte/core/dropdown-menu";
import { Component, JSX, splitProps, For } from "solid-js";
import { tv } from "tailwind-variants";

interface DropdownMenuProps {
  label?: string;
  items: { label: string; onSelect: () => void }[];
  class?: string;
}

const menu = tv({
  base: "bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] rounded shadow-md p-2 min-w-[120px]",
});
const item = tv({
  base: "px-3 py-2 cursor-pointer hover:bg-[var(--color-light-muted)] dark:hover:bg-[var(--color-dark-muted)] rounded",
});

const DropdownMenu: Component<DropdownMenuProps> = (props) => (
  <KDropdownMenu>
    <KDropdownMenu.Trigger class={props.class}>{props.label}</KDropdownMenu.Trigger>
    <KDropdownMenu.Portal>
      <KDropdownMenu.Content class={menu()}>
        <For each={props.items}>
          {(itemObj) => (
            <KDropdownMenu.Item class={item()} onSelect={itemObj.onSelect}>
              {itemObj.label}
            </KDropdownMenu.Item>
          )}
        </For>
      </KDropdownMenu.Content>
    </KDropdownMenu.Portal>
  </KDropdownMenu>
);

export default DropdownMenu;
