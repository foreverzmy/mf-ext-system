import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import Tailwind from '@tailwindcss/postcss';

export default defineConfig({
  tools: {
    postcss: (opts, { addPlugins }) => {
      addPlugins(Tailwind);
    },
  },
  plugins: [pluginReact()],
});
