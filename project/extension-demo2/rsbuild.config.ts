import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import Tailwind from '@tailwindcss/postcss';

export default defineConfig({
  server: {
    port: 3002,
    open: false,
  },
  dev: {
    assetPrefix: 'http://localhost:3002',
    client: {
      port: 3002,
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
      config.output!.uniqueName = 'extension-demo2';
      appendPlugins([
        new ModuleFederationPlugin({
          name: 'extension_demo2',
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
