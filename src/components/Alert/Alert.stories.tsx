import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";
import { Rocket, ShieldCheck, Sparkles, Wrench } from "lucide-react";

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

export const CustomIcon: Story = {
  args: {
    variant: "info",
    icon: <Rocket className="size-5 shrink-0" />,
    title: "Deploy started",
    children: "We'll let you know when it's live.",
  },
};

export const CustomIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert variant="success" icon={<ShieldCheck className="size-5 shrink-0" />}>
        Two-factor authentication is on.
      </Alert>
      <Alert variant="warning" appearance="soft" icon={<Wrench className="size-5 shrink-0" />}>
        Scheduled maintenance tonight at 22:00.
      </Alert>
      <Alert variant="info" appearance="outline" icon={<Sparkles className="size-5 shrink-0" />}>
        New: export to PDF.
      </Alert>
    </div>
  ),
};

export const NoIcon: Story = { args: { icon: null, children: "Pass icon={null} to hide the icon." } };
