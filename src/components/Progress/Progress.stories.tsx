import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./Progress";

const variants = ["primary", "secondary", "accent", "success", "warning", "info", "error", "neutral"] as const;

const meta: Meta<typeof Progress> = {
  title: "Feedback/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: { control: "select", options: variants },
    value: { control: { type: "range", min: 0, max: 100 } },
  },
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = { args: { value: 40 } };
export const Indeterminate: Story = { args: {} };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {variants.map((v, i) => (
        <Progress key={v} variant={v} value={(i + 1) * 12} />
      ))}
    </div>
  ),
};
