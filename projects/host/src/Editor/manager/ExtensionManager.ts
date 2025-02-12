import { EditorEventCenter } from '../events';
import type { ExtensionConfig } from '../types';
import { ExtensionHost } from './ExtensionHost';

export class ExtensionManager {
  #extensions = new Map<string, ExtensionHost>();
  #extensionsOrder: string[] = []; // 维护加载顺序
  #status: 'loading' | 'active' = 'loading';

  get status() {
    return this.#status;
  }

  loadExtensions = async (extensions: ExtensionConfig[]) => {
    extensions.forEach(config => {
      const ext = new ExtensionHost(config);
      if (this.#extensions.has(ext.uri)) {
        throw new Error(`register ${ext.uri} more than one times`);
      }
      this.#extensions.set(ext.uri, ext);
      this.#extensionsOrder.push(ext.uri); // 记录加载顺序
    });

    for (const extName of this.#extensionsOrder) {
      const ext = this.#extensions.get(extName)!;
      try {
        EditorEventCenter.emit('EXTENSION_INIT_START', { uri: ext.uri, title: ext.title });
        await ext.init();
        EditorEventCenter.emit('EXTENSION_INIT_DONE', { uri: ext.uri, title: ext.title });
      } catch (error) {
        EditorEventCenter.emit('EXTENSION_ACTIVATE_FAIL', { uri: ext.uri, title: ext.title });
      }
    }

    await this.activate();
  };

  getExtension = <T>(name: string) => this.#extensions.get(name) as ExtensionHost<T> | undefined;

  private activate = async () => {
    for (const uri of this.#extensionsOrder) {
      const ext = this.#extensions.get(uri);
      if (ext) {
        EditorEventCenter.emit('EXTENSION_ACTIVATE_START', { uri: ext.uri, title: ext.title });
        await ext.activate();
        EditorEventCenter.emit('EXTENSION_ACTIVATE_DONE', { uri: ext.uri, title: ext.title });
      }
    }
    this.#status = 'active';
    EditorEventCenter.emit('EXTENSION_LOADED');
  };

  clear = () => {
    this.#extensions.forEach(ext => ext.dispose());
    this.#extensionsOrder = [];
    this.#extensions.clear();
    this.#status = 'loading';
  };
}
