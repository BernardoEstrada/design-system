import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { Button } from "../Button/Button";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: "Card Title",
    children: "A card component using DaisyUI. Great for grouping related content.",
  },
};

export const WithActions: Story = {
  args: {
    title: "Buy Now",
    children: "This item is available for purchase.",
    actions: <Button variant="primary" size="sm">Purchase</Button>,
  },
};

export const Compact: Story = {
  args: {
    title: "Compact Card",
    compact: true,
    children: "Less padding for denser layouts.",
  },
};
