import type { Meta, StoryObj } from "@storybook/react";
import { AppleCore, Avocado, Camera, Heart, Pizza, Rocket, Search, Settings } from "../icons";
import { FaBeer, FaGithub } from "../icons/fa";
import { MdHome, MdSettings } from "../icons/md";
import { SiReact, SiTailwindcss } from "../icons/si";
import { DynamicIcon } from "../icons/dynamic";

const meta: Meta = {
  title: "Foundations/Icons",
  parameters: { layout: "padded" },
};
export default meta;

function Row({ title, code, children }: { title: string; code: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h3 className="font-bold">{title}</h3>
      <code className="text-sm opacity-70">{code}</code>
      <div className="mt-2 flex gap-4 text-primary">{children}</div>
    </section>
  );
}

export const Sources: StoryObj = {
  render: () => (
    <div>
      <Row title="Lucide (default)" code='import { Pizza } from "@bernardoestrada/design-system/icons"'>
        <Pizza /> <Camera /> <Heart /> <Rocket /> <Search /> <Settings />
      </Row>
      <Row title="Lucide Lab (same import)" code='import { AppleCore } from "@bernardoestrada/design-system/icons"'>
        <AppleCore /> <Avocado />
      </Row>
      <Row title="Dynamic (by name, loaded on demand)" code='import { DynamicIcon } from "@bernardoestrada/design-system/icons/dynamic"'>
        <DynamicIcon name="camera" /> <DynamicIcon name="apple-core" /> <DynamicIcon name="sailboat" />
      </Row>
      <Row title="react-icons (one path per pack)" code='import { FaBeer } from "@bernardoestrada/design-system/icons/fa"'>
        <FaBeer size={24} /> <FaGithub size={24} /> <MdHome size={24} /> <MdSettings size={24} />
        <SiReact size={24} /> <SiTailwindcss size={24} />
      </Row>
    </div>
  ),
};
