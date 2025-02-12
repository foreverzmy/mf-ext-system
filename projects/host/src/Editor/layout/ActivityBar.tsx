import { type FC, memo, useEffect, useMemo, useState } from 'react';
import { useEditorAPI } from '../context';
import { EditorEventCenter } from '../events';

export const ActivityBar: FC = memo(() => {
  const editor = useEditorAPI();
  const viewAPI = editor.views;
  const [current, setCurrent] = useState(viewAPI.currentActivityBar ?? '');

  const activitybars = useMemo(() => viewAPI.getActivityBars(), [viewAPI]);

  const handleClick = (id: string) => {
    setCurrent(id);
    EditorEventCenter.emit('ACTIVITY_BAR_CLICK', { id });
    viewAPI.switchActivityBar(id);
  };

  useEffect(() => {
    editor.views.onActivityBarActive('*', () => {
      setCurrent(editor.views.currentActivityBar!);
    });
  }, [editor]);

  return (
    <div
      className="menu h-full shadow shadow-slate-300 border-r border-slate-200"
      style={{ width: '56px', minWidth: '56px', marginRight: '1px' }}
    >
      {activitybars.map(menu => (
        <div
          key={menu.id}
          className="menu_item flex flex-col justify-center items-center w-full cursor-pointer"
          style={{
            height: '72px',
            padding: '3px',
            margin: '10px 0',
            background: current === menu.id ? 'blue' : '',
          }}
          onClick={() => handleClick(menu.id)}
        >
          <img width="25px" height="25px" src={menu.icon} />
          <span className="title text-sm mt-2">{menu.title}</span>
        </div>
      ))}
    </div>
  );
});
