import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Film, HardDrive, Layers } from "lucide-react";
import { ChipGroup, type ChipOption } from "./ChipGroup";

const options: ChipOption[] = [
  { value: "all", label: "All", icon: <Layers className="size-4" />, meta: 12 },
  { value: "media", label: "Media", icon: <Film className="size-4" />, meta: 5 },
  { value: "storage", label: "Storage", icon: <HardDrive className="size-4" />, meta: 3 },
  { value: "off", label: "Disabled", disabled: true },
];

const meta: Meta<typeof ChipGroup> = {
  title: "Forms/ChipGroup",
  component: ChipGroup,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ChipGroup>;

function Demo(props: Partial<React.ComponentProps<typeof ChipGroup>>) {
  const [value, setValue] = useState<string[]>(["media"]);
  return (
    <div className="flex flex-col gap-3">
      <ChipGroup aria-label="Bundles" options={options} value={value} onChange={setValue} {...props} />
      <code className="text-xs">{JSON.stringify(value)}</code>
    </div>
  );
}

export const MultiSelect: Story = { render: () => <Demo /> };
export const SingleSelect: Story = { render: () => <Demo single required /> };
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Demo size="xs" />
      <Demo size="sm" />
      <Demo size="md" variant="secondary" />
    </div>
  ),
};
