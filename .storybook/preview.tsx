import React from "react";
import type { Preview, Decorator } from "@storybook/react";
import "../src/index.css";
import {
  Appearance,
  DEFAULT_THEME,
  DEFAULT_THEME_CATEGORY,
  applyTheme,
} from "../src/themes/index";

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme || DEFAULT_THEME;
  const appearance = context.globals.appearance || Appearance.SYSTEM;

  React.useEffect(() => {
    applyTheme(theme, appearance);
  }, [theme, appearance]);

  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    themeGroup: {
      description: "Theme group",
    },
    theme: {
      description: "DaisyUI theme",
    },
    appearance: {
      description: "Appearance",
    },
  },
  initialGlobals: {
    themeGroup: DEFAULT_THEME_CATEGORY,
    theme: DEFAULT_THEME,
    appearance: Appearance.SYSTEM,
  },
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: "centered",
  },
};

export default preview;
