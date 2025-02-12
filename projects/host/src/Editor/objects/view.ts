import { type FC, type ComponentType, memo, createElement, useState, useLayoutEffect } from 'react';
import type { Disposable, ViewPosition } from '../types';
import { ViewManager } from '../manager/ViewManager';

interface ViewCompProps {
  comp: ComponentType;
  initProps: Record<string, any>;
  registerPropsChangeListener: (callback: (props: Record<string, any>) => void) => Disposable;
}

const ViewComp: FC<ViewCompProps> = memo(
  ({ comp, initProps, registerPropsChangeListener }) => {
    const [props, setProps] = useState(initProps);

    useLayoutEffect(() => {
      const dispose = registerPropsChangeListener(setProps);
      return () => dispose?.dispose();
    }, [registerPropsChangeListener]);

    return createElement(comp, props);
  },
  () => true,
);

export class View {
  readonly uri: string;
  readonly position: ViewPosition;
  readonly extra: Record<string, any>;
  #comp: ComponentType;
  #viewManager: ViewManager;
  #props: Record<string, any> = {};
  #propsChangeListener?: (props: Record<string, any>) => void;

  constructor(
    viewManager: ViewManager,
    uri: string,
    position: ViewPosition,
    comp: ComponentType,
    extra: Record<string, any> = {},
  ) {
    this.uri = uri;
    this.#viewManager = viewManager;
    this.position = position;
    this.#comp = comp;
    this.extra = extra;
  }

  show = (props: Record<string, any> = {}) => {
    this.#props = props;
    this.#viewManager.showView(this.uri, props);
  };

  updateProps = (newProps: Record<string, any>, replace = false) => {
    this.#props = replace ? newProps : { ...this.#props, ...newProps };
    this.#propsChangeListener?.(this.#props);
  };

  destroy = () => {
    this.#props = {};
  };

  #registerPropsChangeListener = (callback: (props: Record<string, any>) => void) => {
    this.#propsChangeListener = callback;
    return {
      dispose: () => {
        this.#propsChangeListener = undefined;
      },
    };
  };

  readonly render = () => {
    const comp = this.#comp;
    const props = { ...this.#props };
    const registerPropsChangeListener = this.#registerPropsChangeListener;

    if (!comp) {
      return null;
    }

    return createElement(ViewComp, { key: this.uri, comp, initProps: props, registerPropsChangeListener });
  };
}