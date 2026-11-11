import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FileDrop } from "./FileDrop";

const meta: Meta<typeof FileDrop> = {
  title: "Forms/FileDrop",
  component: FileDrop,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FileDrop>;

export const Default: Story = {
  render: () => {
    const [names, setNames] = useState<string[]>([]);
    return (
      <div className="max-w-md">
        <FileDrop label="Attachment" hint="Any file" onFiles={(f) => setNames(f.map((x) => x.name))} multiple />
        <p className="mt-2 text-xs">{names.join(", ")}</p>
      </div>
    );
  },
};

export const ImageWithPreview: Story = {
  render: () => {
    const [url, setUrl] = useState<string | null>(null);
    return (
      <div className="max-w-xs">
        <FileDrop label="Icon" accept="image/png" hint="PNG only" onFiles={([f]) => f && setUrl(URL.createObjectURL(f))}>
          {url ? <img src={url} alt="" className="size-32 rounded-box object-cover" /> : undefined}
        </FileDrop>
      </div>
    );
  },
};

export const WithError: Story = { args: { label: "Upload", error: "That file is too large.", onFiles: () => {} } };
export const Disabled: Story = { args: { disabled: true, onFiles: () => {} } };
