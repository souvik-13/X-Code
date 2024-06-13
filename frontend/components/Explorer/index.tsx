import { currentFileAtom, fileTreeAtom, openFilesAtom } from "@/store/atoms";
import React, { useEffect, useState } from "react";
import {
  RecoilState,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

import {
  ChevronDown,
  ChevronRight,
  CopyMinus,
  File,
  FilePlus2,
  Files as FilesIcon,
  Folder,
  FolderOpenIcon,
  FolderPlus,
  RotateCcw,
  EllipsisIcon,
  CopyXIcon,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { projectInfoAtom } from "@/store/atoms/projectInfo";
import { findLang } from "@/lib/find-lang";

interface ExplorerProps {
  socket: Socket;
}

type _fileTreeType = typeof fileTreeAtom;
type fileTreeType = _fileTreeType extends RecoilState<infer T> ? T : never;

type dirType = {
  name: string;
  type: string;
  path: string;
  children: fileTreeType;
};
type fileType = {
  name: string;
  type: string;
  path: string;
  content?: string;
  lang?: string;
  children?: undefined;
};
type fileTreeNodeType = dirType | fileType;

export default function Explorer({ socket }: ExplorerProps) {
  const [openFiles, setOpenFiles] = useRecoilState(openFilesAtom);
  const [currentFile, setCurrentFile] = useRecoilState(currentFileAtom);
  const [fileTree, setFileTree] = useRecoilState(fileTreeAtom);
  const projectInfo = useRecoilValue(projectInfoAtom);
  const [explorerTabs, setExplorerTabs] = useState<
    { value: string; show: boolean; collapsed: boolean }[]
  >([
    { value: "Folders", show: true, collapsed: false },
    { value: "Open Files", show: true, collapsed: false },
  ]);
  useEffect(() => {
    if (!socket) {
      toast.error("Socket not connected");
      return;
    }
    socket.on("workspace-ready", (data) => {
      setFileTree(data.fileTree);
    });
  }, [setFileTree, socket]);

  return (
    <section id="explorer" className="w-full h-full flex flex-col items-center">
      {/* heading */}
      <section className="w-full flex items-center justify-between p-2">
        <span className="text-xs text-muted-foreground ">EXPLORER</span>
        <Popover>
          <PopoverTrigger>
            <EllipsisIcon
              size={16}
              strokeWidth={1.25}
              className="hover:bg-muted-foreground/50 cursor-pointer rounded-sm"
            />
          </PopoverTrigger>
          <PopoverContent
            className="text-sm font-light w-[150px] grid gap-1 p-2 rounded-sm shadow-md"
            align="end"
          >
            {explorerTabs.map((tab, index) => (
              <div
                key={index}
                className="w-full flex items-center justify-start gap-3 cursor-pointer hover:bg-muted-foreground/50 rounded-sm p-1"
                onClick={() => {
                  setExplorerTabs((tabs) =>
                    tabs.map((innerTab, tabIndex) => {
                      if (tabIndex === index) {
                        return { ...innerTab, show: !innerTab.show };
                      }
                      return innerTab;
                    }),
                  );
                }}
              >
                <input type="checkbox" checked={tab.show} readOnly />
                <span>{tab.value}</span>
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </section>
      {/* files */}
      <section className="flex-1 w-full group">
        {/* root */}
        <div className="w-full flex items-center justify-between p-2">
          <span className="text-sm font-bold flex-grow flex items-center justify-start truncate pr-1">
            <span
              className="cursor-pointer"
              onClick={() => {
                setExplorerTabs((tabs) =>
                  tabs.map((innerTab, tabIndex) => {
                    if (tabIndex === 0) {
                      return { ...innerTab, collapsed: !innerTab.collapsed };
                    }
                    return innerTab;
                  }),
                );
              }}
            >
              {explorerTabs[0].collapsed ? (
                <ChevronRight className="p-0.5" size={20} strokeWidth={2} />
              ) : (
                <ChevronDown className="p-0.5" size={20} strokeWidth={2} />
              )}
            </span>
            {projectInfo?.name?.toUpperCase()}
          </span>
          <div
            className={cn(
              "group-hover:flex items-center justify-center gap-1 hidden",
              { hidden: explorerTabs[0].collapsed },
            )}
          >
            <FilePlus2
              className="p-0.5 text-muted-foreground cursor-pointer rounded-sm hover:scale-110 hover:bg-accent-foreground/20"
              size={20}
              strokeWidth={2}
            />
            <FolderPlus
              className="p-0.5 text-muted-foreground cursor-pointer rounded-sm hover:scale-110 hover:bg-accent-foreground/20"
              size={20}
              strokeWidth={2}
            />
            <RotateCcw
              className="p-0.5 text-muted-foreground cursor-pointer rounded-sm hover:scale-110 hover:bg-accent-foreground/20"
              size={20}
              strokeWidth={2}
            />
            <CopyMinus
              className="p-0.5 text-muted-foreground cursor-pointer rounded-sm hover:scale-110 hover:bg-accent-foreground/20"
              size={20}
              strokeWidth={2}
            />
          </div>
        </div>
        {/* folders/files */}
        <div
          className={cn(
            "w-full h-full pl-4 flex flex-col gap-1 overflow-y-scroll scroll-smooth",
          )}
        >
          {fileTree.map((node, index) => {
            return <EachNode node={node} highlight key={index} />;
          })}
        </div>
      </section>
      {/* open Files */}
      <section className="w-full group my-4">
        <div className="w-full flex items-center p-2">
          <span className="text-sm font-bold flex-grow flex items-center justify-start">
            <span
              className="cursor-pointer"
              onClick={() => {
                setExplorerTabs((tabs) =>
                  tabs.map((innerTab, tabIndex) => {
                    if (tabIndex === 0) {
                      return { ...innerTab, collapsed: !innerTab.collapsed };
                    }
                    return innerTab;
                  }),
                );
              }}
            >
              {explorerTabs[0].collapsed ? (
                <ChevronRight className="p-0.5" size={20} strokeWidth={2} />
              ) : (
                <ChevronDown className="p-0.5" size={20} strokeWidth={2} />
              )}
            </span>
            OPEN FILES
          </span>
          <div
            className={cn(
              "group-hover:flex items-center justify-center gap-1 hidden",
              { hidden: explorerTabs[0].collapsed },
            )}
          >
            <CopyXIcon
              className="p-0.5 text-muted-foreground cursor-pointer rounded-sm hover:scale-110 hover:bg-accent-foreground/20"
              size={20}
              strokeWidth={2}
              onClick={() => {
                setCurrentFile(null);
                setOpenFiles([]);
              }}
            />
          </div>
        </div>
        <div
          className={cn(
            "w-full h-full flex flex-col gap-1 overflow-y-scroll scroll-smooth",
          )}
        >
          {openFiles.map((file, index) => {
            return (
              <div
                key={index}
                className={cn(
                  "w-full pl-4 flex flex-nowrap items-center justify-start",
                  {
                    "bg-foreground/20 ": currentFile?.path === file.path,
                  },
                )}
              >
                <X
                  size={16}
                  strokeWidth={1.25}
                  className="flex-none cursor-pointer hover:bg-accent-foreground/20"
                  onClick={() => {
                    setOpenFiles((prevFiles) =>
                      prevFiles.filter((f) => f.path !== file.path),
                    );
                  }}
                />
                <EachNode node={file} />
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}

const EachNode = ({
  node,
  highlight = false,
}: {
  node: fileTreeNodeType;
  highlight?: boolean;
}) => {
  const [currentFile, setCurrentFile] = useRecoilState(currentFileAtom);
  const [openFiles, setOpenFiles] = useRecoilState(openFilesAtom);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  return (
    <div
      className="h-max transition-all cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        setCollapsed(!collapsed);
      }}
    >
      {/* name */}
      <div
        className={cn(
          "flex items-center text-sm text-muted-foreground transition-all",
          {
            "bg-foreground/20": highlight && currentFile?.path === node.path,
          },
        )}
        onClick={async (e) => {
          if (node.type === "file") {
            const _currentFile = { ...node, lang: findLang(node.name) };
            setCurrentFile(_currentFile);

            const isFileOpen = openFiles.some(
              (file) => file.path === node.path,
            );
            if (!isFileOpen) {
              setOpenFiles((prevFiles) => [...prevFiles, _currentFile]);
            }
          }
        }}
      >
        {node.type === "file" ? (
          <div className="pl-4">
            <File size={16} strokeWidth={1.25} />
          </div>
        ) : collapsed ? (
          <div className="flex items-center">
            <ChevronRight size={16} strokeWidth={1.25} />
            <Folder size={16} strokeWidth={1.25} />
          </div>
        ) : (
          <div className="flex items-center">
            <ChevronDown size={16} strokeWidth={1.25} />
            <FolderOpenIcon size={16} strokeWidth={1.25} />
          </div>
        )}
        <span
          className={cn("px-2 hover:text-accent-foreground", {
            "text-accent-foreground": currentFile?.path === node.path,
          })}
        >
          {node.name}
        </span>
      </div>

      {/* children */}
      {!collapsed && (
        <div className="pl-2 flex flex-col gap-1">
          {node.children?.map((_node, index) => {
            return <EachNode highlight node={_node} key={index} />;
          })}
        </div>
      )}
    </div>
  );
};
