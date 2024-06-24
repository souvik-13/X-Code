import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { explorerTabsAtom } from "@/store/atoms";
import { EllipsisIcon } from "lucide-react";
import { useRecoilState } from "recoil";

const Heading = () => {
    const [explorerTabs, setExplorerTabs] = useRecoilState(explorerTabsAtom);
    return (
        <div className="w-full flex items-center justify-between p-2">
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
        </div>
    );
}

export default Heading;