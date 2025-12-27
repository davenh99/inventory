import type { Meta, StoryObj } from "storybook-solidjs-vite";
import Link from "../components/Link";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
};
export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  render: () => <Link href="https://example.com">Example Link</Link>,
};
