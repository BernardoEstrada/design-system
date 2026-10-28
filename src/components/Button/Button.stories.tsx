import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { ArrowRight, Download, Heart, Plus, Settings, Trash2 } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "accent",
        "ghost",
        "outline",
        "neutral",
      ],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: "Button", variant: "primary", size: "md" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="neutral">Neutral</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center flex-wrap gap-3">
      <Button size="xs">XSmall</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { children: "Loading", loading: true },
};

export const Disabled: Story = {
  args: { children: "Disabled", disabled: true },
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button>
          <Plus className="size-4" /> New project
        </Button>
        <Button variant="secondary">
          <Download className="size-4" /> Download
        </Button>
        <Button variant="outline">
          Continue <ArrowRight className="size-4" />
        </Button>
        <Button variant="ghost">
          <Trash2 className="size-4" /> Delete
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button shape="square" aria-label="Add">
          <Plus className="size-5" />
        </Button>
        <Button shape="circle" variant="secondary" aria-label="Like">
          <Heart className="size-5" />
        </Button>
        <Button shape="square" variant="outline" aria-label="Settings">
          <Settings className="size-5" />
        </Button>
        <Button shape="circle" variant="ghost" aria-label="Delete">
          <Trash2 className="size-5" />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {(["xs", "sm", "md", "lg"] as const).map((s) => (
          <Button key={s} size={s} shape="circle" aria-label={`Add (${s})`}>
            <Plus className={s === "xs" ? "size-3" : s === "sm" ? "size-4" : "size-5"} />
          </Button>
        ))}
      </div>
    </div>
  ),
};
