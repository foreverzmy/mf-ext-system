import { useEffect, useMemo, useRef } from 'react';
import { Editor, EditorManager, EditorHostAPI, ExtensionConfig } from './Editor';
import { initMF, loadExtensions, loadExtensionActivate } from './mf';
import './App.css';

const exts: Array<Omit<ExtensionConfig, 'onload'> & { manifest: string; }> = [
  {
    name: 'extension-demo1',
    title: 'demo1',
    manifest: `/extension-demo1/mf-manifest.json`,
    contributes: {
      viewsContainers: {
        activitybar: [{
          id: 'demo1',
          title: 'Demo1',
          icon: '/icons/shiba.svg',
          priority: 9999
        }]
      }
    }
  }
];

const App = () => {
  const editorRef = useRef<EditorManager>(null);

  const extensions = useMemo(() => exts.map(ext => ({
    ...ext,
    onload: async (api: EditorHostAPI) => {
      if (!ext.manifest) {
        return {};
      }
      initMF(api);

      try {
        return await loadExtensionActivate(ext.name);
      } catch (error) {
        loadExtensions([
          {
            name: ext.name,
            entry: ext.manifest,
          },
        ]);
      }

      return await loadExtensionActivate(ext.name);
    },
  })), []);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || editor.status !== 'init') {
      return;
    }
    editor.config({ extensions, metadata: {} });

    return () => editor.destroy();
  }, []);

  return (
    <div className="content">
      <Editor ref={editorRef} />
    </div>
  );
};

export default App;
