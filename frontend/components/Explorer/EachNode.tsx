import { findLang } from "@/lib/find-lang";
import { cn } from "@/lib/utils";
import { currentFileAtom, fileTreeAtom, openFilesAtom } from "@/store/atoms";
import { FileIcon, ChevronRightIcon, FolderIcon, ChevronDownIcon, FolderOpenIcon } from "lucide-react";
import { useState } from "react";
import { RecoilState, useRecoilState } from "recoil";
import { NodeType } from "@/types";

interface EachNodeProps {
  node: NodeType;
  highlight?: boolean;
  fetchChildren?: (node: NodeType) => any;
}

export const EachNode = ({
    node,
    highlight = false,
    fetchChildren,
  }: EachNodeProps) => {
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
            e.stopPropagation();
            if (!node.isFolder) {
              const lang = findLang(node.path);
              setCurrentFile({
                ...node,
                lang,
                content: "",
              });
              if (!openFiles.includes(node)) {
                setOpenFiles([...openFiles, node]);
              }
            }
            else {
              setCollapsed(!collapsed);
              fetchChildren && fetchChildren(node);
            }
          }}
        >
          {!node.isFolder ? (
            <div className="pl-4">
              <FileIcon size={16} strokeWidth={1.25} />
            </div>
          ) : collapsed ? (
            <div className="flex items-center">
              <ChevronRightIcon size={16} strokeWidth={1.25} />
              <FolderIcon size={16} strokeWidth={1.25} fill="red" />
            </div>
          ) : (
            <div className="flex items-center">
              <ChevronDownIcon size={16} strokeWidth={1.25} />
              <FolderOpenIcon size={16} strokeWidth={1.25} />
            </div>
          )}
          <span
            className={cn("px-2 hover:text-accent-foreground", {
              "text-accent-foreground": currentFile?.path === node.path,
            })}
          >
            {node.path.split("/").pop()}
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