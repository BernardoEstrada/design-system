import type { StorybookConfig } from "@storybook/react-vite";
import type { Plugin, PluginOption } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(viteConfig) {
    // react-docgen takes minutes on the generated icon modules (hundreds of
    // createLucideIcon exports) and they have no props worth documenting.
    const flat = (await Promise.all((viteConfig.plugins ?? []).flat(Infinity as 1))) as PluginOption[];
    for (const plugin of flat.flat(Infinity as 1) as Plugin[]) {
      if (plugin?.name !== "storybook:react-docgen-plugin" || typeof plugin.transform !== "function") continue;
      const transform = plugin.transform;
      plugin.transform = function (code, id, options) {
        if (id.includes("/src/icons/")) return null;
        return transform.call(this, code, id, options);
      };
    }
    return { ...viteConfig, plugins: flat };
  },
};

export default config;
