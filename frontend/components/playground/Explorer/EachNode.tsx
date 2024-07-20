import { Input } from "@/components/ui/input";
import { useOnClickOutside } from "@/hooks/clickOutside";
import { cn, findLang } from "@/lib/utils";
import {
  explorerTabsAtom,
  openFilesAtom,
  selectedFileAtom,
  selectedFolderAtom,
} from "@/store/atoms";
import { projectInfoAtom } from "@/store/atoms/playground/projectInfo";
import { NodeType } from "@/types";
import { fileNameSchema, folderNameSchema } from "@/validations";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CopyMinusIcon,
  FileIcon,
  FilePlus2Icon,
  FolderIcon,
  FolderOpenIcon,
  FolderPlusIcon,
  RotateCcwIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";

interface EachNodeProps {
  root?: boolean;
  node: NodeType;
  highlight?: boolean;
  fetchChildren?: (node: NodeType) => any;

  addfolderTrigger?: boolean;
  setAddfolderTrigger?: (trigger: boolean) => void;

  addfileTrigger?: boolean;
  setAddfileTrigger?: (trigger: boolean) => void;

  renameTrigger?: boolean;
  setRenameTrigger?: (trigger: boolean) => void;
}

export const EachNode = ({
  node,
  root,
  highlight = false,
  fetchChildren,
  addfolderTrigger,
  setAddfolderTrigger,
  addfileTrigger,
  setAddfileTrigger,
  renameTrigger,
  setRenameTrigger,
}: EachNodeProps) => {
  const projectInfo = useRecoilValue(projectInfoAtom);
  const [explorerTabs, setExplorerTabs] = useRecoilState(explorerTabsAtom);
  const [selectedFolder, setSelectedFolder] =
    useRecoilState(selectedFolderAtom);
  const [currentFile, setCurrentFile] = useRecoilState(selectedFileAtom);
  const [openFiles, setOpenFiles] = useRecoilState(openFilesAtom);
  const [collapsed, setCollapsed] = useState<boolean>(root ? false : true);

  const [newNodeName, setNewNodeName] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(inputRef, (ev) => {
    if (addfileTrigger || addfolderTrigger) {
      setAddfileTrigger && setAddfileTrigger(false);
      setAddfolderTrigger && setAddfolderTrigger(false);
    }
  });

  useEffect(() => {
    if (addfileTrigger || addfolderTrigger) {
      inputRef.current?.focus();
    }
  }, [renameTrigger, addfileTrigger, addfolderTrigger]);

  const createNewNode = async (name: string) => {
    if (!newNodeName) return;
    if (addfileTrigger) {
      const res = fileNameSchema.safeParse(newNodeName); // create file
      if (!res.success) {
        console.log();
        toast.error(JSON.parse(res.error.message)[0].message);
        return;
      }
      setAddfileTrigger && setAddfileTrigger(false);
    } else {
      const res = folderNameSchema.safeParse(newNodeName);
      if (!res.success) {
        toast.error(JSON.parse(res.error.message)[0].message);
        return;
      }
      setAddfolderTrigger && setAddfolderTrigger(false);
    }
  };

  return (
    <div
      className={cn(
        root ? "h-full" : "h-max",
        "transition-all flex flex-col items-start justify-start w-full",
      )}
      onClick={(e) => {
        e.stopPropagation();
        // setCollapsed(!collapsed);
        if (node.isFolder) {
          console.log(node);
          setSelectedFolder(node);
        }
      }}
    >
      {root ? (
        // Root node
        <div className="w-full flex items-center justify-between p-2 cursor-pointer">
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
                setCollapsed(!collapsed);
              }}
            >
              {explorerTabs[0].collapsed ? (
                <ChevronRightIcon className="p-0.5" size={20} strokeWidth={2} />
              ) : (
                <ChevronDownIcon className="p-0.5" size={20} strokeWidth={2} />
              )}
            </span>
            {projectInfo?.name?.toUpperCase()}
          </span>
          {/* buttons */}
          <div
            className={cn(
              "group-hover:flex items-center justify-center gap-1 hidden ",
              { hidden: explorerTabs[0].collapsed },
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <FilePlus2Icon
              className="p-0.5 text-muted-foreground cursor-pointer rounded-sm hover:scale-110 hover:bg-accent-foreground/20"
              size={20}
              strokeWidth={2}
              onClick={() => {
                setAddfileTrigger && setAddfileTrigger(true);
              }}
            />
            <FolderPlusIcon
              className="p-0.5 text-muted-foreground cursor-pointer rounded-sm hover:scale-110 hover:bg-accent-foreground/20"
              size={20}
              strokeWidth={2}
              onClick={() => {
                setAddfolderTrigger && setAddfolderTrigger(true);
              }}
            />
            <RotateCcwIcon
              className="p-0.5 text-muted-foreground cursor-pointer rounded-sm hover:scale-110 hover:bg-accent-foreground/20"
              size={20}
              strokeWidth={2}
            />
            <CopyMinusIcon
              className="p-0.5 text-muted-foreground cursor-pointer rounded-sm hover:scale-110 hover:bg-accent-foreground/20"
              size={20}
              strokeWidth={2}
            />
          </div>
        </div>
      ) : (
        // Child node
        <div
          className={cn(
            "w-full flex items-center text-sm text-muted-foreground transition-all cursor-pointer",
            {
              "bg-foreground/20": highlight && currentFile?.path === node.path,
            },
          )}
          onClick={async (e) => {
            // e.stopPropagation();
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
            } else {
              setCollapsed(!collapsed);
              // setSelectedFolder(node);
              if (!node.children) {
                fetchChildren && fetchChildren(node);
              }
            }
          }}
        >
          {!node.isFolder ? (
            <div className="pl-4">
              <FileIcon size={16} strokeWidth={1.25} />
            </div>
          ) : collapsed ? (
            <div className="flex items-center ">
              <ChevronRightIcon size={16} strokeWidth={1.25} />
              <FolderIcon
                size={16}
                strokeWidth={1}
                fill="grey"
                className="text-accent"
              />
            </div>
          ) : (
            <div className="flex items-center">
              <ChevronDownIcon size={16} strokeWidth={1.25} />
              <FolderOpenIcon
                size={16}
                strokeWidth={1}
                fill="grey"
                className="text-accent"
              />
            </div>
          )}
          <span
            className={cn("w-full px-2 hover:text-accent-foreground ", {
              "text-accent-foreground": currentFile?.path === node.path,
            })}
          >
            {/* {node.path.split("/").pop()} */}
            {node.name}
          </span>
        </div>
      )}

      {/* children */}
      {!collapsed && (
        <div className={cn("flex flex-col gap-1 pl-2 w-full")}>
          {/* add node */}
          <div
            className={cn(
              " items-center text-sm text-muted-foreground transition-all cursor-pointer hidden",
              {
                flex:
                  (addfileTrigger || addfolderTrigger) &&
                  node.isFolder &&
                  selectedFolder?.path === node.path,
              },
            )}
          >
            <span className="pl-4">
              {addfileTrigger ? (
                <FileIcon size={16} strokeWidth={1.25} />
              ) : (
                <FolderIcon
                  size={16}
                  strokeWidth={1}
                  fill="grey"
                  className="text-accent"
                />
              )}
            </span>
            <Input
              ref={inputRef}
              value={newNodeName}
              type="text"
              className=" mx-2 h-5 px-0 flex-1 rounded-none focus-visible:ring-0 bg-accent-foreground/10"
              onChange={(e) => setNewNodeName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createNewNode(newNodeName);
                }
              }}
            />
          </div>

          {/* current childern */}
          {node.children?.map((_node, index) => {
            return (
              <EachNode
                root={false}
                highlight
                node={_node}
                key={index}
                fetchChildren={fetchChildren}
                addfileTrigger={addfileTrigger}
                setAddfileTrigger={setAddfileTrigger}
                addfolderTrigger={addfolderTrigger}
                setAddfolderTrigger={setAddfolderTrigger}
                renameTrigger={renameTrigger}
                setRenameTrigger={setRenameTrigger}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
