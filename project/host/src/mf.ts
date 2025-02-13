import React, { type ComponentType } from 'react';
import ReactDOM from 'react-dom';
import { init, loadRemote, registerRemotes } from '@module-federation/enhanced/runtime';
import type { EditorHostAPI, ExtensionModule } from './Editor';

interface ExtensionsRemmote {
  name: string;
  entry: string;
}

export const initMF = (api: EditorHostAPI) => {
  init({
    name: 'editor-host',
    plugins: [],
    remotes: [],
    shared: {
      'editor': {
        version: '0.0.1',
        lib: () => api,
        shareConfig: {
          singleton: true,
          eager: true,
          requiredVersion: '0.0.1',
        },
      },
      react: {
        version: '^19.0.0',
        lib: () => React,
        shareConfig: {
          singleton: true,
          eager: true,
          requiredVersion: '19.0.0',
        },
      },
      'react-dom': {
        version: '19.0.0',
        lib: () => ReactDOM,
        shareConfig: {
          singleton: true,
          eager: true,
          requiredVersion: '19.0.0',
        },
      },
    }
  });
};

export const loadExtensionActivate = async (extensionName: string) =>
  (await loadRemote(extensionName)) as ExtensionModule;

export const loadExtensions = (remotes: ExtensionsRemmote[]) => {
  registerRemotes(remotes);
};

export const loadExtensionComponent = async (extensionName: string, path: string) =>
  (await loadRemote(`${extensionName}/${path}`)) as { default: ComponentType<any> };
