import { ObservableObject, Json } from 'jsoncargo';
import { Disposable } from '../types';

abstract class Storage {
  abstract readonly length: number;
  #listeners: Map<string, Set<(value: Json) => void>> = new Map();

  abstract getItem<T extends Json = Json>(key: string): T | null;

  abstract setItem(key: string, value: Json): void;

  abstract removeItem(key: string): void;
  abstract clear: () => void;

  onKeyChange(key: string, listener: (value: Json) => void): Disposable {
    if (!this.#listeners.has(key)) {
      this.#listeners.set(key, new Set());
    }
    this.#listeners.get(key)?.add(listener);
    return {
      dispose: () => {
        const listeners = this.#listeners.get(key);
        if (listeners) {
          listeners.delete(listener);
        }
      },
    };
  }

  protected triggerListeners(key: string) {
    const listeners = this.#listeners.get(key);
    if (listeners) {
      const value = this.getItem(key);
      listeners.forEach(listener => listener(value));
    }
  }
}

class SearchStorage extends Storage {
  #search = location.search;
  #usp = new URLSearchParams(this.#search);

  get usp() {
    if (this.#search !== location.search) {
      this.#search = location.search;
      this.#usp = new URLSearchParams(this.#search);
    }
    return this.#usp;
  }

  get length() {
    return this.usp.size;
  }

  keys = () => {
    const keys: string[] = [];
    this.usp.forEach((_, key) => {
      keys.push(key);
    });
    return keys;
  };

  getItem<T extends Json = Json>(key: string): T | null {
    const value = this.usp.get(key);
    if (value === null) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (error) {}

    return value as T;
  }

  setItem(key: string, value: Json): void {
    let v = '';
    if (typeof value === 'string') {
      v = value;
    } else {
      v = JSON.stringify(v);
    }
    this.usp.set(key, v);
    window.history.replaceState({}, '', `${window.location.pathname}?${this.usp.toString()}`);
    this.triggerListeners(key);
  }

  removeItem(key: string): void {
    this.usp.delete(key);
    window.history.pushState({}, '', `${window.location.pathname}?${this.usp.toString()}`);
    this.triggerListeners(key);
  }

  clear = () => {
    this.#search = '';
    this.#usp = new URLSearchParams();
    window.history.pushState({}, '', window.location.pathname);
  };
}

class LocalStorage extends Storage {
  get length() {
    return localStorage.length;
  }

  key = (index: number) => localStorage.key(index);

  keys = () => {
    const keys: string[] = [];
    for (let i = 0; i < this.length; i++) {
      const key = this.key(i);
      if (key) {
        keys.push();
      }
    }
    return keys;
  };

  getItem<T extends Json = Json>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (!value) {
      return null;
    }
    try {
      const { type, content } = JSON.parse(value);
      if (type === 'string') {
        return content;
      }
      return JSON.parse(content);
    } catch (error) {
      console.warn('localStorage get Item not valid：', key, value);
    }
    return null;
  }

  setItem(key: string, value: Json): void {
    let content = '';
    if (typeof value === 'string') {
      content = value;
    } else {
      content = JSON.stringify(value);
    }

    localStorage.setItem(key, JSON.stringify({ type: typeof value, content }));

    this.triggerListeners(key);
  }

  removeItem = (key: string) => {
    localStorage.removeItem(key);
    this.triggerListeners(key);
  };

  clear = localStorage.clear;
}

class CacheStorage extends Storage {
  readonly length = 0;
  #observableObject = new ObservableObject({});

  keys = () => Object.keys(this.#observableObject);

  getItem<T extends Json = Json>(key: string): T | null {
    return this.#observableObject.get<T>(key) ?? null;
  }

  setItem(key: string, value: Json): void {
    this.#observableObject.set(key, value);
  }

  removeItem = (key: string) => {
    this.#observableObject.unset(key);
  };

  clear = () => {
    this.#observableObject = new ObservableObject({});
  };

  onKeyChange(key: string, listener: (v: Json) => void): Disposable {
    const off = this.#observableObject.watch(key, listener);

    return {
      dispose: off,
    };
  }
}

export class StorageManager {
  #search = new SearchStorage();
  #local = new LocalStorage();
  #cache = new CacheStorage();

  get search() {
    return this.#search;
  }

  get local() {
    return this.#local;
  }

  get cache() {
    return this.#cache;
  }

  get metadata() {
    return this.cache.getItem('metadata') || {};
  }

  clear = () => {
    this.#cache.clear();
    this.#search.clear();
    this.#cache.clear();
  };
}
