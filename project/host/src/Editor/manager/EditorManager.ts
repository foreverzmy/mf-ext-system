import { EditorEventCenter } from '../events';
import { EditorHostAPI, EditorManagerConfig, ExtensionConfig } from '../types';
import { ExtensionManager } from './ExtensionManager';
import { ViewManager } from './ViewManager';
import { StorageManager } from './StorageManager';

export class EditorManager {
  static #instance: EditorManager;

  #extensionManager = new ExtensionManager();
  #viewManager = new ViewManager();
  #storageManager = new StorageManager();

  // 单例模式
  static getInstance(): EditorManager {
    if (!EditorManager.#instance || !(globalThis as any).__editor_manager__) {
      EditorManager.#instance = new EditorManager();
      (globalThis as any).__editor_manager__ = EditorManager.#instance;
    }
    return EditorManager.#instance;
  }

  get status() {
    return this.#extensionManager.status;
  }

  get editorAPI(): EditorHostAPI {
    return {
      extensions: this.#extensionManager,
      views: this.#viewManager,
      storage: this.#storageManager,
    };
  }

  config = async ({ metadata, extensions }: EditorManagerConfig) => {
    if (!extensions.length) {
      EditorEventCenter.emit('EXTENSION_LOAD_ERROR', { message: '没有可加载的插件' });
      return;
    }
    this.#storageManager.cache.setItem('metadata', metadata as any);
    const exts = extensions.map(ext => ({
      ...ext,
      onload: async () => await ext.onload?.(this.editorAPI),
    }));
    this.#initView(exts);
    await this.#extensionManager.loadExtensions(exts);
    this.#initActivityBar();
    EditorEventCenter.emit('EDITOR_INITED');
  };

  #initView = (exts: ExtensionConfig[]) => {
    const cs = exts.reduce(
      (acc, ext) => ({
        ...acc,
        [ext.name]: ext.contributes,
      }),
      {},
    );
    this.#viewManager.updateContributes(cs);
  };


  #initActivityBar = () => {
    const initActivityBar = this.#storageManager.search.getItem<string>('activitybar');
    this.#viewManager.switchActivityBar(initActivityBar || undefined);
    this.#viewManager.onActivityBarActive('*', () => {
      const { currentActivityBar } = this.#viewManager;
      if (currentActivityBar) {
        this.#storageManager.search.setItem('activitybar', currentActivityBar);
      }
    });
  };

  destroy = () => {
    EditorEventCenter.emit('DESTROY');
    this.#extensionManager.clear();
    this.#viewManager.clear();
    this.#storageManager.clear();
  };
}
