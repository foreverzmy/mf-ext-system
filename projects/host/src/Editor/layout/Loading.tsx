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
  const [loadStatue, setLoadStatus] = useState(0);
  const extensionLoaded = useRef(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const editor = useEditor();

  useEffect(() => {
    if (editor.status === 'active') {
      setLoadStatus(0);
    }

    const eventHandler = (event: keyof Events, params: any) => {
      if (event === 'DESTROY') {
        setLoadStatus(0);
        extensionLoaded.current = false;
        return;
      }

      if (extensionLoaded.current) {
        return;
      }

      switch (event) {
        case 'EXTENSION_LOAD_ERROR':
          textRef.current && (textRef.current.innerText = `${params?.message}`);
          setLoadStatus(2);
          break;
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
          textRef.current && (textRef.current.innerText = `编辑器初始化完成🎉🎉🎉`);
          extensionLoaded.current = true;
          break;
        default:
      }

      if (extensionLoaded.current) {
        setLoadStatus(0);
      }
    }

    EditorEventCenter.on('*', eventHandler);

    return () => {
      EditorEventCenter.off('*', eventHandler);
    };
  }, [editor]);

  if (loadStatue === 0 || loadStatue === 2) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-32 h-fit flex justify-center items-center">
          { 
            loadStatue === 0 ? 
              <SwitchLoading /> : 
              <p className='text-5xl font-black w-10 h-18 border-3 border-red-400 text-red-400 rounded-full flex items-center justify-center'>!</p> 
          }
        </div>
        <div className="flex flex-col items-center mt-10">
          <p className="mb-2">{ loadStatue === 0 ? '编辑器初始化中...' : '编辑器加载失败' }</p>
          <p ref={textRef} className="mt-2">
            加载插件中...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
