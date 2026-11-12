import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Appearance, applyTheme } from "../../themes";
import { ThemePicker } from "./ThemePicker";

const meta: Meta<typeof ThemePicker> = { title: "Display/ThemePicker", component: ThemePicker, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof ThemePicker>;

function Demo(props: Partial<React.ComponentProps<typeof ThemePicker>>) {
  const [family, setFamily] = useState("navigator");
  const [appearance, setAppearance] = useState(Appearance.SYSTEM);
  useEffect(() => {
    applyTheme(family, appearance);
  }, [family, appearance]);
  return <ThemePicker family={family} appearance={appearance} onFamilyChange={setFamily} onAppearanceChange={setAppearance} {...props} />;
}

export const Default: Story = { render: () => <Demo /> };
export const AppThemesOnly: Story = { render: () => <Demo categories={["app"]} grouped={false} /> };
