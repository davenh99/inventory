import type { Meta, StoryObj } from "storybook-solidjs-vite";
import Text from "../components/Text";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
};
export default meta;
type Story = StoryObj<typeof Text>;

export const AllText: Story = {
  render: () => (
    <div class="space-y-2">
      <Text size="sm">Small Text</Text>
      <Text size="md">Medium Text</Text>
      <Text size="lg">Large Text</Text>
      <Text color="primary">Primary Color</Text>
      <Text color="secondary">Secondary Color</Text>
      <Text color="error">Error Color</Text>
      <Text color="success">Success Color</Text>
      <Text color="warning">Warning Color</Text>
      <Text color="muted">Muted Color</Text>
    </div>
  ),
};
