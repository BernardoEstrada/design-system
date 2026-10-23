import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";

const items = [
  { id: "overview", label: "Overview", content: <p>Project overview and recent activity.</p> },
  { id: "settings", label: "Settings", content: <p>Configure how the project behaves.</p> },
  { id: "billing", label: "Billing", content: <p>Plans and invoices.</p>, disabled: true },
  { id: "members", label: "Members", content: <p>Invite and manage teammates.</p> },
];

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: { control: "select", options: ["border", "box", "lift", "plain"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
  },
  args: { items },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {};
export const Box: Story = { args: { variant: "box" } };
export const Lift: Story = { args: { variant: "lift" } };
