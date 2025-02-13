import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import Tailwind from '@tailwindcss/postcss';

export default defineConfig({
  tools: {
    postcss: (opts, { addPlugins }) => {
      addPlugins(Tailwind);
    },
  },

  server: {
    proxy: {
      '/extension-demo1': {
        target: 'http://localhost:3001',
        pathRewrite: { '^/extension-demo1': '' },
      },
    },
  },
  plugins: [pluginReact()],
});
