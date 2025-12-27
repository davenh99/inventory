import type { Meta, StoryObj } from "storybook-solidjs-vite";
import Tooltip from "../components/Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip content={<span>Tooltip content</span>}>
      <button class="px-3 py-1 bg-blue-500 text-white rounded">Hover me</button>
    </Tooltip>
  ),
};
