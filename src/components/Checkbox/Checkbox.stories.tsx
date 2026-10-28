import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";
import { Bell, Lock, Mail, Moon } from "lucide-react";

const variants = ["primary", "secondary", "accent", "success", "warning", "info", "error", "neutral"] as const;

const meta: Meta<typeof Checkbox> = {
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = { args: { label: "Enable notifications", defaultChecked: true } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {variants.map((v) => (
        <Checkbox key={v} variant={v} label={v} defaultChecked={v === "primary"} />
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(["xs", "sm", "md", "lg"] as const).map((s) => (
        <Checkbox key={s} size={s} label={s} defaultChecked />
      ))}
    </div>
  ),
};

export const Disabled: Story = { args: { label: "Disabled", disabled: true, defaultChecked: true } };

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Checkbox
        defaultChecked
        label={
          <span className="flex items-center gap-2">
            <Mail className="size-4 opacity-70" /> Email updates
          </span>
        }
      />
      <Checkbox
        variant="secondary"
        label={
          <span className="flex items-center gap-2">
            <Bell className="size-4 opacity-70" /> Push notifications
          </span>
        }
      />
      <Checkbox
        variant="accent"
        defaultChecked
        label={
          <span className="flex items-center gap-2">
            <Moon className="size-4 opacity-70" /> Quiet hours
          </span>
        }
      />
      <Checkbox
        disabled
        label={
          <span className="flex items-center gap-2">
            <Lock className="size-4 opacity-70" /> Admin only
          </span>
        }
      />
    </div>
  ),
};
