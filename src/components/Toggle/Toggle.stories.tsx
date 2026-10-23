import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./Toggle";

const variants = ["primary", "secondary", "accent", "success", "warning", "info", "error", "neutral"] as const;

const meta: Meta<typeof Toggle> = {
  title: "Forms/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
  },
};
export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = { args: { label: "Enable notifications", defaultChecked: true } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {variants.map((v) => (
        <Toggle key={v} variant={v} label={v} defaultChecked={v === "primary"} />
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(["xs", "sm", "md", "lg"] as const).map((s) => (
        <Toggle key={s} size={s} label={s} defaultChecked />
      ))}
    </div>
  ),
};

export const Disabled: Story = { args: { label: "Disabled", disabled: true, defaultChecked: true } };
