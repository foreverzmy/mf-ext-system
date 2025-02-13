import { useEffect, useRef } from 'react';
import { Editor, EditorManager } from './Editor';
import './App.css';

const App = () => {
  const editorRef = useRef<EditorManager>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    editor.config({ extensions: [] });
  }, []);

  return (
    <div className="content">
      <Editor ref={editorRef} />
    </div>
  );
};

export default App;
