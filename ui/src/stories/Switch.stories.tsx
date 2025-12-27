import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import Switch from "../components/Switch";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => {
    const [on, setOn] = createSignal(false);
    return <Switch label="Enable notifications" checked={on()} onChange={setOn} />;
  },
};
