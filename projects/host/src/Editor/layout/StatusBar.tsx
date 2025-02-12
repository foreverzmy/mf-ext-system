import { type FC, memo, useEffect, useState } from 'react';
import { useEditorAPI } from '../context';
import { StatusBarItem } from '../manager/StatusBarManager';

const Item: FC<{ item: StatusBarItem }> = memo(
  ({ item }) => {
    const [status, setStatus] = useState(item.status);

    useEffect(() => {
      const dispose = item.onStatusChange(setStatus);
      return () => dispose.dispose();
    }, [item]);

    if (!status.show) {
      return null;
    }

    return (
      <div
        className={`cursor-pointer inline-flex gap-1 h-full px-4 items-center`}
        style={{ color: item.color, backgroundColor: item.backgroundColor }}
        onClick={status.handleClick}
      >
        {status.icon && (
          <span className="inline-block overflow-hidden" style={{ width: '20px', height: '20px' }}>
            <img width={20} height={20} src={status.icon} />
          </span>
        )}
        <span style={{ fontSize: '14px', lineHeight: '16px' }}>{status.text}</span>
      </div>
    );
  },
  () => false,
);

export const StatusBar: FC = memo(
  () => {
    const editor = useEditorAPI();
    const [leftItems, setLeftItems] = useState(() => editor.views.getStatusBarItems('left'));
    const [rightItems, setRightItems] = useState(() => editor.views.getStatusBarItems('right'));

    useEffect(() => {
      editor.views.onStatusBarChange(() => {
        setLeftItems(editor.views.getStatusBarItems('left'));
        setRightItems(editor.views.getStatusBarItems('right'));
      });
    }, [editor]);

    return (
      <div
        className="w-full flex flex-row justify-between bg-cyan-50 shadow shadow-slate-400"
        style={{ height: '26px' }}
      >
        <div className="flex flex-row items-center justify-start">
          {leftItems.map(item => (
            <Item key={item.uri} item={item} />
          ))}
        </div>
        <div className="flex flex-row-reverse justify-start">
          {rightItems.map(item => (
            <Item key={item.uri} item={item} />
          ))}
        </div>
      </div>
    );
  },
  () => false,
);
