import type { Meta, StoryObj } from "@storybook/react";
import { ChevronDown, Copy, Pencil, Trash2 } from "lucide-react";
import { Dropdown } from "./Dropdown";

const items = [
  { label: "Edit", icon: <Pencil className="size-4" /> },
  { label: "Duplicate", icon: <Copy className="size-4" /> },
  { label: "Archive", disabled: true },
  { label: "Delete", icon: <Trash2 className="size-4" /> },
];

const meta: Meta<typeof Dropdown> = {
  title: "Overlays/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    position: { control: "select", options: ["bottom", "top", "left", "right"] },
    align: { control: "select", options: ["start", "center", "end"] },
  },
  args: {
    items,
    trigger: (
      <>
        Actions <ChevronDown className="size-4" />
      </>
    ),
  },
};
export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {};
export const Primary: Story = { args: { triggerVariant: "primary" } };
export const CustomContent: Story = {
  args: {
    children: (
      <div className="card bg-base-100 w-64 p-4 shadow-sm">
        <p className="text-sm">Any content can go in a dropdown.</p>
      </div>
    ),
  },
};
