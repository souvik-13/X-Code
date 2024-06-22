import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, CopyXIcon, X } from "lucide-react";
import { EachNode } from "./EachNode";
import { explorerTabsAtom, openFilesAtom, currentFileAtom } from "@/store/atoms";
import { useRecoilState } from "recoil";

const OpenFiles = () => {
    const [explorerTabs, setExplorerTabs] = useRecoilState(explorerTabsAtom);
    const [openFiles, setOpenFiles] = useRecoilState(openFilesAtom);
    const [currentFile, setCurrentFile] = useRecoilState(currentFileAtom);
    return (
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
    );
}

export default OpenFiles;