import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Forms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = { args: { label: "Bio", placeholder: "Tell us about yourself" } };
export const WithHint: Story = { args: { label: "Bio", placeholder: "Tell us about yourself", hint: "Max 280 characters." } };
export const WithError: Story = { args: { label: "Bio", defaultValue: "Hi", error: "Too short." } };
export const Disabled: Story = { args: { label: "Bio", defaultValue: "Read only", disabled: true } };
