import mitt from 'mitt';

type Events = {
  EDITOR_INITED: void;
  EXTENSION_INIT_START: { uri: string; title: string };
  EXTENSION_INIT_DONE: { uri: string; title: string };
  EXTENSION_ACTIVATE_START: { uri: string; title: string };
  EXTENSION_ACTIVATE_DONE: { uri: string; title: string };
  EXTENSION_ACTIVATE_FAIL: { uri: string; title: string };
  EXTENSION_LOADED: void;
  DATA_UPDATED: void;
  ACTIVITY_BAR_CLICK: { id: string };
  DESTROY: void;
};

export const EditorEventCenter = mitt<Events>();
