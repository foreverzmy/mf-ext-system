import { createContext, useContext } from 'react';
import { EditorManager } from './manager/EditorManager';

export const EditorContext = createContext<EditorManager>(null as unknown as EditorManager);

export const useEditor = () => useContext(EditorContext);

export const useEditorAPI = () => useContext(EditorContext).editorAPI;
