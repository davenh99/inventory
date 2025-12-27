import type { Meta, StoryObj } from "storybook-solidjs-vite";
import Heading from "../components/Heading";

const meta: Meta<typeof Heading> = {
  title: "Components/Heading",
  component: Heading,
};
export default meta;
type Story = StoryObj<typeof Heading>;

export const AllHeadings: Story = {
  render: () => (
    <div>
      <Heading as="h1">Heading 1</Heading>
      <Heading as="h2">Heading 2</Heading>
      <Heading as="h3">Heading 3</Heading>
      <Heading as="h4">Heading 4</Heading>
      <Heading as="h5">Heading 5</Heading>
      <Heading as="h6">Heading 6</Heading>
      <Heading as="p">Paragraph</Heading>
    </div>
  ),
};
