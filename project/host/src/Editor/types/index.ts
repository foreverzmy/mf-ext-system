import { ExtensionManager } from '../manager/ExtensionManager';
import { ViewManager } from '../manager/ViewManager';
import { StorageManager } from '../manager/StorageManager';

export type Disposable = {
	/**
	 * Function to clean up resources.
	 */
	dispose: () => any;
};

export interface Resource {
  readonly uri: string;
  readonly resourceType: string;
}

export interface ExtensionModule {
  activate?: (ctx: ExtensionContext) => Promise<void>;
  deactivate?: () => void;
}

export interface ViewsContainer {
  id: string;
  title: string;
  icon: string;
  /** 排序权重 */
  priority?: number;
}

export interface ExtensionContributes {
  viewsContainers?: Record<string, ViewsContainer[]>;
}

export interface ExtensionConfig {
  name: string;
  title: string;
  /**
   * @link - https://code.visualstudio.com/api/references/contribution-points
   */
  contributes?: ExtensionContributes;
  onload: () => Promise<ExtensionModule | undefined>;
}

export type EditorManagerExtensionConfig = Omit<ExtensionConfig, 'onload'> & {
  onload?: (api: EditorHostAPI) => Promise<ExtensionModule>;
};

export interface EditorManagerConfig {
  metadata?: Record<string, any>;
  extensions: Array<EditorManagerExtensionConfig>;
}

export interface ExtensionContext {
  /**
   * An array to which disposables can be added. When this
   * extension is deactivated the disposables will be disposed.
   *
   * *Note* that asynchronous dispose-functions aren't awaited.
   */
  readonly subscriptions: Disposable[];

  /**
   * The uri of the directory containing the extension.
   */
  readonly uri: string;

  /**
   * The current `Extension` instance.
   */
  readonly extension: Extension;
}

export interface Extension<T = any> {
  /**
   * The uri of the directory containing the extension.
   */
  readonly uri: string;

  /**
   * `true` if the extension has been activated.
   */
  readonly isActive: boolean;

  readonly exports: T;

  /**
   * The parsed contents of the extension's package.json.
   */
  readonly contributes?: ExtensionContributes;

  /**
   * Activates this extension and returns its public API.
   *
   * @returns A promise that will resolve when this extension has been activated.
   */
  activate: () => Promise<void>;

  deactivate?: () => void;
}

export interface EditorHostAPI {
  extensions: ExtensionManager;
  views: ViewManager;
  storage: StorageManager;
}

export interface EditorCommandAPI {
  registerCommand: any;
}

export type ViewPosition = 'sidebar' | 'mainarea' | 'custom';
