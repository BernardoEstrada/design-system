import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";
import { AlertTriangle, Check, Clock, Info, Sparkles, X } from "lucide-react";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: "Badge", variant: "primary" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(
        [
          "primary",
          "secondary",
          "accent",
          "success",
          "error",
          "warning",
          "info",
          "neutral",
          "ghost",
          "outline",
        ] as const
      ).map((v) => (
        <Badge key={v} variant={v}>
          {v}
        </Badge>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="xs">xs</Badge>
      <Badge size="sm">sm</Badge>
      <Badge size="md">md</Badge>
      <Badge size="lg">lg</Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="success">
          <Check className="size-3.5" /> Paid
        </Badge>
        <Badge variant="warning">
          <Clock className="size-3.5" /> Pending
        </Badge>
        <Badge variant="error">
          <X className="size-3.5" /> Failed
        </Badge>
        <Badge variant="info">
          <Info className="size-3.5" /> Beta
        </Badge>
        <Badge variant="primary">
          <Sparkles className="size-3.5" /> New
        </Badge>
        <Badge variant="outline">
          <AlertTriangle className="size-3.5" /> Deprecated
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {(["xs", "sm", "md", "lg"] as const).map((s) => (
          <Badge key={s} size={s} variant="secondary">
            <Sparkles className={s === "lg" ? "size-4" : "size-3"} /> {s}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="success" aria-label="Done">
          <Check className="size-3.5" />
        </Badge>
        <Badge variant="error" aria-label="Error">
          <X className="size-3.5" />
        </Badge>
      </div>
    </div>
  ),
};
