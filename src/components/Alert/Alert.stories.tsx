import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";

const variants = ["info", "success", "warning", "error"] as const;

const meta: Meta<typeof Alert> = {
  title: "Feedback/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: { control: "select", options: variants },
    appearance: { control: "select", options: ["solid", "soft", "outline", "dash"] },
  },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = { args: { children: "A new version is available." } };

export const WithTitle: Story = {
  args: { variant: "success", title: "Saved", children: "Your changes have been saved." },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(["solid", "soft", "outline", "dash"] as const).map((a) =>
        variants.map((v) => (
          <Alert key={`${a}-${v}`} variant={v} appearance={a}>
            {a} {v}
          </Alert>
        )),
      )}
    </div>
  ),
};

export const Dismissible: Story = {
  args: { variant: "warning", children: "Your trial ends in 3 days.", onClose: () => {} },
};
