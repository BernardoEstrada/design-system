import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ColorPicker } from "./ColorPicker";

const meta: Meta<typeof ColorPicker> = {
  title: "Forms/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: { size: { control: "select", options: ["long", "sm", "md"] } },
  args: { label: "Color", defaultValue: "#3b82f6" },
};
export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Long: Story = { args: { size: "long" } };
export const Small: Story = { args: { size: "sm", label: undefined, "aria-label": "Color" } };
export const Medium: Story = { args: { size: "md" } };
export const AllowNone: Story = { args: { allowNone: true, defaultValue: null } };
export const PresetsOnly: Story = { args: { allowCustom: false, hint: "No custom colors." } };
export const ThemeColors: Story = {
  args: {
    label: "Theme color",
    defaultValue: "var(--color-primary)",
    allowCustom: false,
    presets: [
      { value: "var(--color-primary)", label: "Primary" },
      { value: "var(--color-secondary)", label: "Secondary" },
      { value: "var(--color-accent)", label: "Accent" },
      { value: "var(--color-info)", label: "Info" },
      { value: "var(--color-success)", label: "Success" },
      { value: "var(--color-warning)", label: "Warning" },
      { value: "var(--color-error)", label: "Error" },
    ],
  },
};
export const Disabled: Story = { args: { disabled: true } };

export const AllSizes: Story = {
  render: () => {
    const [color, setColor] = useState<string | null>("#22c55e");
    return (
      <div className="flex flex-col gap-6">
        <ColorPicker label="long" size="long" allowNone value={color} onChange={setColor} />
        <ColorPicker label="md" size="md" allowNone value={color} onChange={setColor} />
        <ColorPicker label="sm" size="sm" allowNone value={color} onChange={setColor} />
        <code className="text-sm">{JSON.stringify(color)}</code>
      </div>
    );
  },
};
