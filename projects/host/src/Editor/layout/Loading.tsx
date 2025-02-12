import { type FC, PropsWithChildren, useState, useEffect, useRef } from 'react';
import { useEditor } from '../context';
import { EditorEventCenter, Events } from '../events';
import './loading.css';

export const SwitchLoading: FC = () => (
  <div className="loading relative inline-block border-box">
    <div className="switch" />
  </div>
);


export const EditorLoading: FC<PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const extensionLoaded = useRef(false);
  const dataUpdated = useRef(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const editor = useEditor();

  useEffect(() => {
    if (editor.status === 'active') {
      setLoading(false);
    }

    const eventHandler = (event: keyof Events, params: any) => {
      if (event === 'DESTROY') {
        setLoading(true);
        extensionLoaded.current = false;
        dataUpdated.current = false;
        return;
      }

      if (extensionLoaded.current && dataUpdated.current) {
        return;
      }

      switch (event) {
        case 'EXTENSION_INIT_START':
          textRef.current && (textRef.current.innerText = `插件「${params?.title}」初始化中...`);
          break;
        case 'EXTENSION_INIT_DONE':
          textRef.current && (textRef.current.innerText = `插件「${params?.title}」初始化完成.`);
          break;
        case 'EXTENSION_ACTIVATE_START':
          textRef.current && (textRef.current.innerText = `插件「${params?.title}」初始化中...`);
          break;
        case 'EXTENSION_ACTIVATE_DONE':
          textRef.current && (textRef.current.innerText = `插件「${params?.title}」初始化完成.`);
          break;
        case 'EXTENSION_ACTIVATE_FAIL':
          textRef.current && (textRef.current.innerText = `插件「${params?.title}」初始化失败.`);
          EditorEventCenter.off('*', eventHandler);
          break;
        case 'EDITOR_INITED':
          textRef.current && (textRef.current.innerText = `等待数据同步中...`);
          extensionLoaded.current = true;
          break;
        case 'DATA_UPDATED':
          textRef.current && (textRef.current.innerText = `数据同步完成🎉🎉🎉`);
          dataUpdated.current = true;
          break;
        default:
      }

      if (extensionLoaded.current && dataUpdated.current) {
        setLoading(false);
      }
    }

    EditorEventCenter.on('*', eventHandler);

    return () => {
      EditorEventCenter.off('*', eventHandler);
    };
  }, [editor]);

  if (loading) {
    return (
      <div className="w-full h-full centered flex flex-col">
        <div className="w-32 h-64 flex justify-center items-center">
          <SwitchLoading />
        </div>
        <div className="flex flex-col items-center h-40">
          <p className="mt-20">编辑器初始化中...</p>
          <p ref={textRef} className="mt-2">
            加载插件中...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
