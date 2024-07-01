import { selectedFileAtom, openFilesAtom, themeAtom } from "@/store/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { Socket } from "socket.io-client";
import { FilePathBreadcrumb } from "./file-path-breadcrumb";
import { useEffect, useRef, useState } from "react";
import Editor, { useMonaco, loader } from "@monaco-editor/react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { themePaths } from "./CodeEditorThemes";
import { useSocket } from "@/context/socket-provider";
import { debounce } from "lodash";

interface EditorComponentProps {}

const EditorComponent = ({}: EditorComponentProps) => {
  const monaco = useMonaco();
  const editorRef = useRef(null);
  const [openFiles, setOpenFiles] = useRecoilState(openFilesAtom);
  const [currentFile, setCurrentFile] = useRecoilState(selectedFileAtom);
  const [loading, setLoading] = useState<boolean>(true);
  const [code, setCode] = useState<any>();
  const [theme, setTheme] = useRecoilState(themeAtom);

  const { isConnected, requestFileContent, workspaceLoaded } = useSocket();

  // useEffect(() => {}, []);

  useEffect(() => {
    if (monaco && theme && theme !== "vs-dark" && themePaths[theme]) {
      const themePath = themePaths[theme]; // Get the module path using the theme name
      loader.init().then((monaco) => {
        monaco.editor.defineTheme(theme, themePath);
        monaco.editor.setTheme(theme);
      });
    } else {
      console.log("monaco not loaded or theme not found");
    }
  }, [monaco, theme]);

  useEffect(() => {
    if (!currentFile) {
      return;
    }
    if (currentFile.content) {
      if (!loading) return;
      setCode(currentFile.content);
      setLoading(false);
      return;
    } else {
      setLoading(true);
      if (!isConnected) {
        toast.error("Socket not connected");
        return;
      }
      requestFileContent(currentFile.path, (data) => {
        const { content } = data;
        setCurrentFile({ ...currentFile, content });
      });
    }
  }, [currentFile, loading, setCurrentFile, isConnected, requestFileContent]);

  const debouncedSave = debounce((nextValue) => {
    console.log(nextValue);
  }, 1000);

  if (!isConnected) {
    return (
      <div className="w-full h-full grid place-items-center">
        <h1 className="text-xl font-bold">Socket not connected</h1>
      </div>
    );
  } else if (!workspaceLoaded) {
    return (
      <div className="w-full h-full grid place-items-center">
        <h1 className="text-xl font-bold animate-pulse">
          Loading workspace ...
        </h1>
      </div>
    );
  } else if (!openFiles.length) {
    return (
      <div className="w-full h-full grid place-items-center">
        <h1 className="text-xl font-bold">Open files to edit</h1>
      </div>
    );
  } else if (!currentFile) {
    return (
      <div className="w-full h-full grid place-items-center">
        <h1 className="text-xl font-bold">Open a file to edit</h1>
      </div>
    );
  } else if (loading) {
    return (
      <div className="w-full h-full grid place-items-center">
        <h1 className="text-xl font-bold animate-pulse">Fetching content</h1>
      </div>
    );
  } else {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <section
          id="editor-bar"
          className="w-full h-9 flex flex-nowrap items-center justify-start gap-1 overflow-y-scroll border-b-[1px]"
          style={{ scrollbarWidth: "none", scrollBehavior: "smooth" }}
        >
          {openFiles.map((f, index) => (
            <div
              key={index}
              className={cn(
                "border-s-[1px] w-min h-full pl-2 pr-6 group flex items-center justify-start relative",
                { " bg-foreground/20": f.path === currentFile.path }
              )}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentFile(f);
              }}
            >
              <span className="font-light w-max">
                {f.path.split("/").pop()}
              </span>
              <X
                size={16}
                strokeWidth={1.25}
                className={cn(
                  "absolute right-1 hidden rounded-sm cursor-pointer  group-hover:block text-accent-foreground group-hover:bg-accent-foreground/20"
                )}
                onClick={(e) => {
                  e.stopPropagation();

                  const currentIndex = openFiles.findIndex(
                    (_f) => _f.path === f.path
                  );

                  if (currentIndex === 0) {
                    if (openFiles.length == 1) setCurrentFile(null);
                    else setCurrentFile(openFiles[openFiles.length - 1]);
                  } else setCurrentFile(openFiles[currentIndex - 1]);

                  setOpenFiles((prevFiles) => {
                    return prevFiles.filter((_f) => _f.path !== f.path);
                  });
                }}
              />
            </div>
          ))}
        </section>
        <div
          ref={editorRef}
          className="w-full h-full flex flex-col items-center justify-start "
        >
          <FilePathBreadcrumb
            className="w-full flex-none"
            filePath={currentFile.path}
          />
          <Editor
            theme={theme}
            value={code}
            onChange={(value) => {
              setCode(value);
              // get the change
              debouncedSave(value);
            }}
            language={currentFile.lang}
            loading={<div>Fetching content</div>}
          />
        </div>
      </div>
    );
  }
};

export default EditorComponent;
