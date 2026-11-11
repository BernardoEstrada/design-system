import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MaskableIcon, MaskablePreview } from "./MaskablePreview";

// A simple logo with a transparent background.
const logo =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#6d28d9"/><path d="M35 30 L72 50 L35 70 Z" fill="white"/></svg>',
  );

const meta: Meta<typeof MaskablePreview> = {
  title: "Display/MaskablePreview",
  component: MaskablePreview,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof MaskablePreview>;

export const AllShapes: Story = { args: { src: logo, background: "#fde68a", padding: 0.12, showSafeZone: true } };

export const Interactive: Story = {
  render: () => {
    const [padding, setPadding] = useState(0.1);
    const [bg, setBg] = useState("#fde68a");
    const [safe, setSafe] = useState(true);
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <input type="range" className="range range-sm w-48" min={0} max={0.4} step={0.01} value={padding} onChange={(e) => setPadding(Number(e.target.value))} />
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
          <label className="label gap-2"><input type="checkbox" className="checkbox checkbox-sm" checked={safe} onChange={(e) => setSafe(e.target.checked)} />Safe zone</label>
        </div>
        <MaskableIcon src={logo} size={192} padding={padding} background={bg} showSafeZone={safe} />
        <MaskablePreview src={logo} padding={padding} background={bg} showSafeZone={safe} />
      </div>
    );
  },
};
