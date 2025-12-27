import type { Meta, StoryObj } from "storybook-solidjs-vite";
import Tag from "../components/Tag";

const meta: Meta<typeof Tag> = {
  title: "Components/Tag",
  component: Tag,
};
export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  render: () => <Tag title="Example Tag" colorHex="#3b82f6" onClick={() => alert("Tag clicked")} />,
};
