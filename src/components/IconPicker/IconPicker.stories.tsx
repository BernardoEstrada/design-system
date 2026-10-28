import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DynamicIcon, type IconName } from "../DynamicIcon/DynamicIcon";
import { IconPicker } from "./IconPicker";

const meta: Meta<typeof IconPicker> = {
  title: "Forms/IconPicker",
  component: IconPicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { label: "Icon" },
};
export default meta;
type Story = StoryObj<typeof IconPicker>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: "apple-core", hint: "Lab icons are included." } };
export const Inline: Story = { args: { inline: true, label: undefined } };
export const LabOnly: Story = { args: { sources: ["lab"], label: "Lab icon" } };
export const NoLoadMore: Story = { args: { loadMore: false, hint: "Only the first 160 icons; search for the rest." } };
export const WithError: Story = { args: { error: "Pick an icon." } };

export const Controlled: Story = {
  render: () => {
    const [icon, setIcon] = useState<string | null>("rocket");
    return (
      <div className="flex items-end gap-4">
        <IconPicker label="Project icon" value={icon} onChange={setIcon} />
        <div className="flex items-center gap-2 pb-3">
          {icon && <DynamicIcon name={icon as IconName} className="text-primary size-8" />}
          <code className="text-sm">{JSON.stringify(icon)}</code>
        </div>
      </div>
    );
  },
};
