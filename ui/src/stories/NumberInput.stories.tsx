import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import NumberInput from "../components/NumberInput";

const meta: Meta<typeof NumberInput> = {
  title: "Components/NumberInput",
  component: NumberInput,
};
export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = createSignal(0);
    return <NumberInput label="Age" value={value()} onChange={(v) => setValue(Number(v))} />;
  },
};
