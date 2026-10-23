import type { Meta, StoryObj } from "@storybook/react";
import { Loading } from "./Loading";

const types = ["spinner", "dots", "ring", "ball", "bars", "infinity"] as const;

const meta: Meta<typeof Loading> = {
  title: "Feedback/Loading",
  component: Loading,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: types },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
};
export default meta;
type Story = StoryObj<typeof Loading>;

export const Default: Story = {};

export const AllTypes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-primary">
      {types.map((t) => (
        <Loading key={t} type={t} size="lg" />
      ))}
    </div>
  ),
};
