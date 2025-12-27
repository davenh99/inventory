import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import Select from "../components/Select";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = createSignal("");
    return (
      <Select
        label="Choose option"
        options={[
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ]}
        value={value()}
        onChange={setValue}
      />
    );
  },
};
