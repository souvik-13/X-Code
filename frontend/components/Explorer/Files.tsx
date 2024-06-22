import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, FilePlus2, FolderPlus, RotateCcw, CopyMinus } from "lucide-react";
import { EachNode } from "./EachNode";
import { currentFileAtom, explorerTabsAtom, fileTreeAtom } from "@/store/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { projectInfoAtom } from "@/store/atoms/projectInfo";
import { Socket } from "socket.io-client";
import { useCallback, useEffect } from "react";
import { NodeType } from "@/types";
import { toast } from "sonner";

interface FilesProps {
    explorerTabs: {
        value: string;
        show: boolean;
        collapsed: boolean;
    }[];
    setExplorerTabs: (tabs: { value: string; show: boolean; collapsed: boolean }[]) => void;
    socket: Socket;
}

const Files = ({socket}: Partial<FilesProps>) => {
    const [explorerTabs, setExplorerTabs] = useRecoilState(explorerTabsAtom);
    const [currentFile, setCurrentFile] = useRecoilState(currentFileAtom);
    const [fileTree, setFileTree] = useRecoilState(fileTreeAtom);
    const projectInfo = useRecoilValue(projectInfoAtom);


    const fetchChildren = useCallback(async (node: NodeType) => {
        if(!socket || !socket.connected) {
            toast.error("Socket not connected");
            return;
        }
        if (socket && socket.connected) {
            socket.emit("get-dir", { dirPath: node.path });
        }
    }, [fileTree]);

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on("dir-content", (data : {message: string; dirPath: string; content: NodeType[]}) => {
            setFileTree((tree) => {
                return tree.map((node) => {
                    if (node.path === data.dirPath) {
                        return {
                            ...node,
                            children: data.content,
                        };
                    }
                    return node;
                });
            });
        })

        return () => {
            if (socket) {
                socket.off("workspace-ready");
            }
        };
    }, [socket]);

    return (
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
                    return <EachNode node={node} highlight key={index} fetchChildren={fetchChildren} />;
                })}
            </div>
        </section>
    );
}

export default Files;