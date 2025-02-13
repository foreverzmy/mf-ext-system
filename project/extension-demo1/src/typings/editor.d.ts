declare module 'editor' {
  export type Disposable = {
    /**
     * Function to clean up resources.
     */
    dispose: () => any;
  };

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

  declare namespace extensions { }
  
  declare namespace views {
    export interface ViewsContainer {
      id: string;
      title: string;
      icon: string;
      /** 排序权重 */
      priority?: number;
    }

    export const currentActivityBar: string;
    export const currentSideBar: View | undefined;
    export const currentMainArea: View | undefined;

    export function updateContributes(extContributes?: Record<string, ExtensionContributes>): void;
    export function switchActivityBar(id?: string): void;

    export function onActivityBarActive(id: string, callback: () => void): Disposable;
    export function onSideBarChange(callback: (view: View) => void): Disposable;
    export function onMainAreaChange(callback: (view?: View) => void): Disposable;

    export function showView(uri: string, props?: Record<string, any>): View | undefined;

    export function destroyView(uri: string): void;
  
    export function getActivityBars(): Array<Activitybar>;
  
    export function registerView(uri: string, position: ViewPosition, comp: ComponentType, extra?: Record<string, any>): View;
    export function getViews(position: ViewPosition): Array<View>;
    export function getView(uri: string): View | undefined;
  
    export function clear(): void;


    // createStatusBarItem: StatusBarManager['createStatusBarItem'];
    // getStatusBarItems: StatusBarManager['getStatusBarItems'];
    // onStatusBarChange: StatusBarManager['onChange'];
  }
  
  declare namespace storage {}
}
