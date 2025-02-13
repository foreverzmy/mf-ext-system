import { type ComponentType } from 'react';
import type { Disposable, ExtensionContributes, ViewPosition, ViewsContainer } from '../types';
import { View } from '../objects/view';
import { StatusBarManager } from './StatusBarManager';

type Activitybar = ViewsContainer & { extensionName: string };

export class ViewManager {
  #views = new Map<string, View>();
  #activitybars: Array<Activitybar> = [];
  #currentActivityBar: string = '';
  #currentSideBar?: View;
  #currentMainArea?: View;
  #activitybarListeners = new Map<string, Set<() => void>>();
  #sidebarListeners = new Set<(view: View) => void>();
  #statusbarManager = new StatusBarManager();
  #mainareaListeners = new Set<(view?: View) => void>();
  
  get currentActivityBar() {
    return this.#currentActivityBar;
  }

  get currentSideBar() {
    return this.#currentSideBar;
  }

  get currentMainArea() {
    return this.#currentMainArea;
  }

  updateContributes = (extContributes: Record<string, ExtensionContributes> = {}) => {
    const activitybars = [...this.#activitybars];
    Object.entries(extContributes).forEach(([extensionName, { viewsContainers } = {}]) => {
      if (viewsContainers) {
        const { activitybar } = viewsContainers;
        if (activitybar) {
          activitybars.push(...activitybar.map((bar: ViewsContainer) => ({ ...bar, extensionName })));
        }
      }
    });

    this.#activitybars = activitybars.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  };

  switchActivityBar = (id?: string) => {
    if (id && this.#currentActivityBar === id) {
      return;
    }

    if (id && this.#activitybars.some(bar => bar.id === id)) {
      this.#currentActivityBar = id;
    } else {
      this.#currentActivityBar = this.#activitybars[0]?.id;
    }

    if (this.#currentActivityBar) {
      const allListeners = this.#activitybarListeners.get('*');
      allListeners?.forEach(cb => cb());
      const idListeners = this.#activitybarListeners.get(this.#currentActivityBar);
      idListeners?.forEach(cb => cb());
    }
  };


  createStatusBarItem = this.#statusbarManager.createStatusBarItem;
  getStatusBarItems = this.#statusbarManager.getStatusBarItems;
  onStatusBarChange = this.#statusbarManager.onChange;
  
  onActivityBarActive = (id: string, callback: () => void): Disposable => {
    if (!this.#activitybarListeners.has(id)) {
      this.#activitybarListeners.set(id, new Set());
    }
    this.#activitybarListeners.get(id)?.add(callback);

    return {
      dispose: () => this.#activitybarListeners.get(id)?.delete(callback),
    };
  };

  onSideBarChange = (callback: (view: View) => void) => {
    this.#sidebarListeners.add(callback);
    return {
      dispose: () => this.#sidebarListeners.delete(callback),
    };
  };

  onMainAreaChange = (callback: (view?: View) => void) => {
    this.#mainareaListeners.add(callback);
    return {
      dispose: () => this.#mainareaListeners.delete(callback),
    };
  };

  showView = (uri: string, props: Record<string, any> = {}) => {
    const view = this.#views.get(uri);
    if (!view) {
      return;
    }
    view.updateProps(props, true);

    if (view.position === 'sidebar') {
      this.#currentSideBar = view;
      this.#sidebarListeners.forEach(cb => cb(view));
    }
    if (view.position === 'mainarea') {
      this.#currentMainArea = view;
      this.#mainareaListeners.forEach(cb => cb(view));
    }

    return view;
  };

  destroyView = (uri: string) => {
    const view = this.#views.get(uri);
    if (!view) {
      return;
    }

    if (view.position === 'mainarea') {
      this.#currentMainArea = undefined;
      this.#mainareaListeners.forEach(cb => cb());
    }
  };


  getActivityBars = () => this.#activitybars;

  registerView = (uri: string, position: ViewPosition, comp: ComponentType, extra?: Record<string, any>) => {
    const view = new View(this, uri, position, comp, extra);
    this.#views.set(uri, view);
    return view;
  };

  getViews = (position: ViewPosition) =>
    [...this.#views.values()].filter(view => view.position === position);

  getView = (uri: string) => this.#views.get(uri);

  clear = () => {
    this.#currentActivityBar = '';
    this.#currentSideBar = undefined;
    this.#currentMainArea = undefined;
    this.#activitybars = [];
    this.#activitybarListeners.clear();
    this.#sidebarListeners.clear();
    this.#mainareaListeners.clear();
    this.#statusbarManager.clear();
  };
}
