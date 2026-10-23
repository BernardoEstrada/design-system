import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "angular", label: "Angular", disabled: true },
];

const meta: Meta<typeof Select> = {
  title: "Forms/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: { size: { control: "select", options: ["xs", "sm", "md", "lg"] } },
  args: { options, defaultValue: "" },
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = { args: { label: "Framework", placeholder: "Pick one" } };
export const WithHint: Story = { args: { label: "Framework", placeholder: "Pick one", hint: "You can change this later." } };
export const WithError: Story = { args: { label: "Framework", placeholder: "Pick one", error: "Required." } };
export const Disabled: Story = { args: { label: "Framework", placeholder: "Pick one", disabled: true } };
