"use client";
import { currentFileAtom, fileTreeAtom } from "@/store/atoms";
import { cn } from "@/lib/utils";
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
} from "lucide-react";
import { useEffect, useState } from "react";
import { RecoilState, useRecoilState } from "recoil";

interface FilesProps {
  collapsed: boolean;
  className?: string;
  projectName: string;
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
  children?: undefined;
};
type fileTreeNodeType = dirType | fileType;
const Files = ({ collapsed, className, projectName }: FilesProps) => {
  const [fileTree, setFileTree] = useRecoilState(fileTreeAtom);

  useEffect(() => {}, []);

  return collapsed ? (
    <div className="w-full h-full flex flex-col items-center justify-start py-5">
      <FilesIcon />
    </div>
  ) : (
    <>
      <div className="w-full flex items-center justify-between p-2">
        <span className="text-sm font-bold flex-grow">
          {projectName.toUpperCase()}
        </span>
        <div className="flex items-center justify-center gap-0">
          <FilePlus2 className="p-0.5" size={20} strokeWidth={2} />
          <FolderPlus className="p-0.5" size={20} strokeWidth={2} />
          <RotateCcw className="p-0.5" size={20} strokeWidth={2} />
          <CopyMinus className="p-0.5" size={20} strokeWidth={2} />
        </div>
      </div>
      <div
        className={cn(
          className,
          "w-full h-full p-2 flex flex-col gap-1 overflow-y-scroll scroll-smooth",
        )}
      >
        {fileTree.map((node, index) => {
          return <EachNode node={node} key={index} />;
        })}
      </div>
    </>
  );
};

const EachNode = ({ node }: { node: fileTreeNodeType }) => {
  const [currentFile, setCurrentFile] = useRecoilState(currentFileAtom);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  return (
    <div
      className="h-max transition-all cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        setCollapsed(!collapsed);
      }}
    >
      <div
        className={cn("flex items-center text-sm", {
          "bg-foreground/50": currentFile?.path === node.path,
        })}
        onClick={async (e) => {
          // e.stopPropagation();

          if (node.type === "file") {
            // setCurrentFile(node as fileType);
            // getFileContent(node.path);
            // onFileContent((data) => {
            //   const { content, message } = data;

            //   // let currFile: fileType = { ...(node as fileType), content };
            //   setCurrentFile({ ...(node as fileType), content });
            // });
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
        <span className={cn("px-2")}>{node.name}</span>
      </div>
      {!collapsed && (
        <div className="ml-2 flex flex-col gap-1">
          {node.children?.map((_node, index) => {
            return <EachNode node={_node} key={index} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Files;
