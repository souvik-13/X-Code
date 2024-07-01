import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronDown,
  FilePlus2,
  FolderPlus,
  RotateCcw,
  CopyMinus,
} from "lucide-react";
import { EachNode } from "./EachNode";
import {
  selectedFileAtom,
  explorerTabsAtom,
  fileTreeAtom,
  selectedFolderAtom,
} from "@/store/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { projectInfoAtom } from "@/store/atoms/playground/projectInfo";
import { useCallback, useEffect, useState } from "react";
import { NodeType } from "@/types";
import { Socket } from "socket.io-client";
import { toast } from "sonner";
import { set } from "zod";
import { useSocket } from "@/context/socket-provider";

interface FilesProps {
  // socket: Socket;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const Files = ({ loading, setLoading }: FilesProps) => {
  const [explorerTabs, setExplorerTabs] = useRecoilState(explorerTabsAtom);
  const [currentFolder, setCurrentFolder] = useRecoilState(selectedFolderAtom);
  const [currentFile, setCurrentFile] = useRecoilState(selectedFileAtom);
  const [fileTree, setFileTree] = useRecoilState(fileTreeAtom);
  const projectInfo = useRecoilValue(projectInfoAtom);

  const { isConnected, requestDirectory } = useSocket();

  const [addfileTrigger, setAddfileTrigger] = useState<boolean>(false);
  const [addfolderTrigger, setAddfolderTrigger] = useState<boolean>(false);
  const [renameTrigger, setRenameTrigger] = useState<boolean>(false);

  
  const fetchChildren = useCallback(
    async (node: NodeType) => {
      if (!isConnected) {
        toast.error("Socket not connected");
        return;
      }
      setLoading(true);
      requestDirectory(node.path, (data) => {
        setLoading(false);
        if (data.error) {
          toast.error(data.error);
          return;
        }
        if (data.status === "success") {
          setFileTree((tree) => {
            if (tree) {
              let newTree = { ...tree };

              const updateChildren = (node: NodeType): NodeType => {
                if (node.path === data.dirPath) {
                  return {
                    ...node,
                    children: data.content!.children,
                  };
                }
                if (node.children) {
                  return {
                    ...node,
                    children: node.children.map(updateChildren),
                  };
                }
                return node;
              };

              newTree = updateChildren(newTree);
              return newTree;
            }
            return tree;
          });
        }
      });
    },
    [fileTree, isConnected, requestDirectory]
  );

  // useEffect(() => {
  //   socket.on(
  //     "dir-content",
  //     (data: { message: string; dirPath: string; content: NodeType }) => {
  //       try {
  //         setFileTree((tree) => {
  //           if (tree) {
  //             // console.log(data);
  //             let newTree = { ...tree };
  //             // update the children of the parent node
  //             const updateChildren = (node: NodeType): NodeType => {
  //               if (node.path === data.dirPath) {
  //                 // Create a new node with updated children
  //                 return {
  //                   ...node,
  //                   children: data.content.children,
  //                 };
  //               }
  //               if (node.children) {
  //                 // Recursively update children by creating a new array of children
  //                 return {
  //                   ...node,
  //                   children: node.children.map(updateChildren),
  //                 };
  //               }
  //               return node;
  //             };
  //             newTree = updateChildren(newTree);
  //             return newTree;
  //           }
  //           return tree;
  //         });
  //       } catch (error) {
  //         console.log(error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   );

  //   return () => {
  //     if (socket) {
  //       socket.off("dir-content");
  //     }
  //   };
  // }, [isConnected]);

  return (
    <div className="flex-1 w-full h-full group">
      {fileTree && (
        <EachNode
          node={fileTree}
          highlight
          root
          fetchChildren={fetchChildren}
          addfileTrigger={addfileTrigger}
          setAddfileTrigger={setAddfileTrigger}
          addfolderTrigger={addfolderTrigger}
          setAddfolderTrigger={setAddfolderTrigger}
          renameTrigger={renameTrigger}
          setRenameTrigger={setRenameTrigger}
        />
      )}
    </div>
  );
};

export default Files;
