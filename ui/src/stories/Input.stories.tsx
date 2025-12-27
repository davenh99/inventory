import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import Input from "../components/Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = createSignal("");
    return <Input label="Name" value={value()} onChange={setValue} variant="bordered" />;
  },
};
