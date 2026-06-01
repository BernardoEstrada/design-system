import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { label: "Email", placeholder: "you@example.com", type: "email" },
};

export const WithHint: Story = {
  args: { label: "Username", placeholder: "berni", hint: "Must be unique." },
};

export const WithError: Story = {
  args: { label: "Password", type: "password", placeholder: "••••••••", error: "Password too short." },
};

export const Disabled: Story = {
  args: { label: "Disabled", value: "Can't touch this", disabled: true },
};
