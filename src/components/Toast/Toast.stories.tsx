import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { ToastProvider, useToast } from "./Toast";

function Demo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast({ message: "Profile updated.", variant: "success" })}>Success</Button>
      <Button variant="secondary" onClick={() => toast({ title: "Heads up", message: "New version available.", variant: "info" })}>
        Info
      </Button>
      <Button variant="outline" onClick={() => toast({ message: "Stays until closed.", variant: "warning", duration: 0 })}>
        Sticky
      </Button>
      <Button variant="ghost" onClick={() => toast({ message: "Something went wrong.", variant: "error" })}>
        Error
      </Button>
    </div>
  );
}

const meta: Meta<typeof ToastProvider> = {
  title: "Feedback/Toast",
  component: ToastProvider,
  tags: ["autodocs"],
  argTypes: {
    vertical: { control: "select", options: ["top", "middle", "bottom"] },
    horizontal: { control: "select", options: ["start", "center", "end"] },
  },
  render: (args) => (
    <ToastProvider {...args}>
      <Demo />
    </ToastProvider>
  ),
};
export default meta;
type Story = StoryObj<typeof ToastProvider>;

export const Default: Story = {};
export const TopCenter: Story = { args: { vertical: "top", horizontal: "center" } };
