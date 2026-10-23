import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    position: { control: "select", options: ["top", "bottom", "left", "right"] },
    variant: {
      control: "select",
      options: ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "error"],
    },
  },
  args: { tip: "Copy to clipboard", children: <Button variant="outline">Hover me</Button> },
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {};
export const AlwaysOpen: Story = { args: { open: true, variant: "primary" } };
export const Positions: Story = {
  render: () => (
    <div className="flex gap-6 p-12">
      {(["top", "bottom", "left", "right"] as const).map((p) => (
        <Tooltip key={p} tip={p} position={p} open>
          <Button variant="ghost">{p}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
