import type { Meta, StoryObj } from "storybook-solidjs-vite";
import TextArea from "../components/TextArea";

const meta: Meta<typeof TextArea> = {
  title: "Components/TextArea",
  component: TextArea,
};
export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  render: () => <TextArea label="Description" variant="bordered" />,
};
