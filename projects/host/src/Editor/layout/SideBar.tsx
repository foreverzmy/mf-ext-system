import { type FC, memo, useEffect, useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { useEditorAPI } from '../context';

export const SideBar: FC = memo(
  () => {
    const editor = useEditorAPI();
    const [view, setView] = useState(editor.views.currentSideBar);

    const handleToMain = () => {
      editor.views.switchActivityBar();
    };

    useEffect(() => {
      const off = editor.views.onSideBarChange(setView);

      return () => {
        off.dispose();
      };
    }, [editor]);

    return (
      <div className="h-full w-full overflow-hidden">
        <ErrorBoundary key={view?.uri}>
          {view?.render() ?? (
            <div className="full-center">
              <div className="flex flex-col items-center">
                <p className="link mt-6 text-xl font-medium text-slate-500" onClick={handleToMain}>
                  返回主菜单
                </p>
              </div>
            </div>
          )}
        </ErrorBoundary>
      </div>
    );
  },
  () => true,
);
