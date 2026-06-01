import React from "react";
import type { Preview, Decorator } from "@storybook/react";
import "../src/index.css";
import { Themes, applyTheme } from "../src/themes/index";

const allThemes = Object.values(Themes).filter(
  (t) => t !== Themes.LIGHT && t !== Themes.DARK
);

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme || Themes.NAVIGATOR;
  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "DaisyUI theme",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: allThemes.map((t) => ({ value: t, title: t })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: Themes.NAVIGATOR,
  },
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: "centered",
  },
};

export default preview;
