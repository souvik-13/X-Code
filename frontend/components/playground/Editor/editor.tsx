import Editor, { useMonaco, loader, Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useEffect, useRef } from "react";

interface EditorComponentProps {
  code: string;
  setCode: (code: string) => void;
  theme?: string;
  setTheme?: (theme: string) => void;
}

const EditorComponent = ({
  code,
  setCode,
  theme = "vs-dark",
  setTheme,
}: EditorComponentProps) => {
    const monaco = useMonaco();

    useEffect(() => {
      // do conditional chaining
      monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
      // or make sure that it exists by other ways
      if (monaco) {
        console.log('here is the monaco instance:', monaco);
      }
    }, [monaco]);
  
    return <Editor height="90vh" defaultValue="// some comment" defaultLanguage="javascript" />;
};

export default EditorComponent;
