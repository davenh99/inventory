import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import SearchInput from "../components/SearchInput";

const meta: Meta<typeof SearchInput> = {
  title: "Components/SearchInput",
  component: SearchInput,
};
export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = createSignal("");
    return <SearchInput value={value()} onChange={setValue} />;
  },
};
