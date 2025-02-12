import { ObservableObject } from 'jsoncargo';
import type { Disposable } from '../types';

interface StatusBarItemStatus {
  show: boolean;
  alignment: 'left' | 'right';
  priority: number;
  icon?: string;
  text: string;
  tooltip: string;
  color: string;
  backgroundColor: string;
  handleClick?: () => void;
}

const defaultStatus: StatusBarItemStatus = {
  show: false,
  alignment: 'left',
  priority: 0,
  text: '',
  tooltip: '',
  color: '',
  backgroundColor: '',
};

export class StatusBarItem {
  #uri: string;

  #status = new ObservableObject(defaultStatus);

  constructor(uri: string, alignment: 'left' | 'right' = 'left', priority = 0) {
    this.#uri = uri;
    this.alignment = alignment;
    this.priority = priority;
  }

  get uri() {
    return this.#uri;
  }

  get status() {
    return this.#status.value;
  }

  onStatusChange = (callback: (status: StatusBarItemStatus) => void): Disposable => {
    const off = this.#status.watch('*', callback);
    return {
      dispose: off,
    };
  };

  set alignment(alignment: 'left' | 'right') {
    this.#status.set('alignment', alignment);
  }

  get alignment() {
    return this.#status.get('alignment');
  }

  set priority(priority: number) {
    this.#status.set('priority', priority);
  }

  get priority() {
    return this.#status.get('priority');
  }

  set icon(icon: string | undefined) {
    this.#status.set('icon', icon);
  }

  get icon() {
    return this.#status.get('icon');
  }

  set text(text: string) {
    this.#status.set('text', text);
  }

  get text() {
    return this.#status.get('text');
  }

  set tooltip(tooltip: string) {
    this.#status.set('tooltip', tooltip);
  }

  get tooltip() {
    return this.#status.get('tooltip');
  }

  set color(color: string) {
    this.#status.set('color', color);
  }

  get color() {
    return this.#status.get('color');
  }

  set backgroundColor(backgroundColor: string) {
    this.#status.set('backgroundColor', backgroundColor);
  }

  get backgroundColor() {
    return this.#status.get('backgroundColor');
  }

  onClick = (handler: () => void): Disposable => {
    this.#status.set('handleClick', handler);

    return {
      dispose: () => {
        this.#status.unset('handleClick');
      },
    };
  };

  show() {
    this.#status.set('show', true);
  }

  hide() {
    this.#status.set('show', false);
  }

  dispose() {
    this.hide();
    this.#status = new ObservableObject(defaultStatus);
  }
}

export class StatusBarManager {
  #items = new Map<string, StatusBarItem>();
  #listeners = new Set<() => void>();

  createStatusBarItem = (uri: string, alignment: 'left' | 'right' = 'left', priority = 0): StatusBarItem => {
    if (this.#items.has(uri)) {
      return this.#items.get(uri)!;
    }
    const item = new StatusBarItem(uri, alignment, priority);
    this.#items.set(uri, item);
    this.#notify();
    return item;
  };

  getStatusBarItems = (alignment: 'left' | 'right') =>
    [...this.#items.values()].filter(item => item.alignment === alignment).sort((a, b) => b.priority - a.priority);

  onChange = (cb: () => void) => {
    this.#listeners.add(cb);

    return {
      dispose: () => this.#listeners.delete(cb),
    };
  };

  #notify = () => {
    this.#listeners.forEach(cb => cb());
  };

  clear() {
    this.#items.forEach(item => item.dispose());
    this.#items.clear();
  }
}
