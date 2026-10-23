import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { Modal } from "./Modal";

type ModalArgs = Omit<React.ComponentProps<typeof Modal>, "open" | "onClose">;

function Demo(args: ModalArgs) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        actions={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </>
        }
      />
    </>
  );
}

const meta: Meta<ModalArgs> = {
  title: "Overlays/Modal",
  tags: ["autodocs"],
  argTypes: { position: { control: "select", options: ["middle", "top", "bottom"] } },
  args: { title: "Delete project?", children: "This permanently removes the project and its data." },
  render: (args) => <Demo {...args} />,
};
export default meta;
type Story = StoryObj<ModalArgs>;

export const Default: Story = {};
export const Persistent: Story = { args: { persistent: true, children: "Backdrop clicks are ignored. Use Esc or a button." } };
export const Bottom: Story = { args: { position: "bottom" } };
