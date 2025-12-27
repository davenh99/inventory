import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import DateInput from "../components/DateInput";

const meta: Meta<typeof DateInput> = {
  title: "Components/DateInput",
  component: DateInput,
};
export default meta;
type Story = StoryObj<typeof DateInput>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = createSignal<Date | null>(null);
    return <DateInput label="Pick a date" value={date()} onChange={setDate} />;
  },
};
