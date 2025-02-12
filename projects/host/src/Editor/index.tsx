import { useMemo, useEffect, useImperativeHandle, forwardRef, ReactNode, memo } from 'react';
import { EditorManagerExtensionConfig } from './types';
import { Layout } from './layout/Layout';
import { EditorManager } from './manager/EditorManager';
import { EditorContext } from './context';
import { EditorLoading } from './layout/Loading';

export * from './types';
export * from './manager/EditorManager';

interface EditorProps {
  title?: ReactNode;
  data?: Record<string, any>;
  extensions?: EditorManagerExtensionConfig[];
}

export const Editor = memo(
  forwardRef<EditorManager, EditorProps>(({ title }, ref) => {
    const editor = useMemo(() => EditorManager.getInstance(), []);

    useImperativeHandle(ref, () => editor);

    useEffect(() => () => editor.destroy(), [editor]);

    return (
      <EditorContext.Provider value={editor}>
        <EditorLoading>
          <Layout title={title} />
        </EditorLoading>
      </EditorContext.Provider>
    );
  }),
);
