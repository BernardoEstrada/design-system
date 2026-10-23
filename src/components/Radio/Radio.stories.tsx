import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "./Radio";

const variants = ["primary", "secondary", "accent", "success", "warning", "info", "error", "neutral"] as const;

const meta: Meta<typeof Radio> = {
  title: "Forms/Radio",
  component: Radio,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
  },
};
export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = { args: { label: "Enable notifications", defaultChecked: true } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {variants.map((v) => (
        <Radio key={v} variant={v} label={v} name="variants" defaultChecked={v === "primary"} />
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(["xs", "sm", "md", "lg"] as const).map((s) => (
        <Radio key={s} size={s} label={s} defaultChecked />
      ))}
    </div>
  ),
};

export const Disabled: Story = { args: { label: "Disabled", disabled: true, defaultChecked: true } };
