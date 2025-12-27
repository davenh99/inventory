import type { Meta, StoryObj } from "storybook-solidjs-vite";
import DropdownMenu from "../components/DropdownMenu";

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
};
export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <DropdownMenu
      label="Open Menu"
      items={[
        { label: "Item 1", onSelect: () => alert("Item 1 selected") },
        { label: "Item 2", onSelect: () => alert("Item 2 selected") },
      ]}
    />
  ),
};
