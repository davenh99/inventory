import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import FileInput from "../components/FileInput";

const meta: Meta<typeof FileInput> = {
  title: "Components/FileInput",
  component: FileInput,
};
export default meta;
type Story = StoryObj<typeof FileInput>;

export const Default: Story = {
  render: () => {
    const [fileName, setFileName] = createSignal("");
    return (
      <div>
        <FileInput label="Upload file" onChange={(files) => setFileName(files?.[0]?.name || "")} />
        <div class="mt-2">Selected: {fileName()}</div>
      </div>
    );
  },
};
