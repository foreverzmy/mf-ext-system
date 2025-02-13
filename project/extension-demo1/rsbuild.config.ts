import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import Tailwind from '@tailwindcss/postcss';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

export default defineConfig({
  server: {
    port: 3001,
    open: false,
  },
  dev: {
    assetPrefix: `http://localhost:3001`,
    client: {
      port: 3001,
      host: 'localhost',
      protocol: 'ws',
    },
  },
  tools: {
    postcss: (opts, { addPlugins }) => {
      addPlugins(Tailwind);
    },
    rspack: (config, { appendPlugins }) => {
      // 需要设置一个唯一值不能和其他应用相等
      config.output!.uniqueName = 'extension-demo1';
      appendPlugins([
        new ModuleFederationPlugin({
          name: 'extension_demo1',
          shareScope: 'editor',
          exposes: {
            '.': './src/index.ts',
          },
          shared: {
            editor: {
              singleton: true,
              version: '*'
            }
          }
        })
      ]);
    }
  },
  plugins: [pluginReact()],
});
