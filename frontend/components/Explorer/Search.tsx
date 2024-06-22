import { cn } from "@/lib/utils";
import { explorerTabsAtom } from "@/store/atoms";
import { ChevronRight, ChevronDown, CopyMinus } from "lucide-react";
import { useRecoilState } from "recoil";

const Search = () => {
    const [explorerTabs, setExplorerTabs] = useRecoilState(explorerTabsAtom);
    return (
        <section className="w-full group my-4">
        <div className="w-full flex items-center p-2">
          <span className="text-sm font-bold flex-grow flex items-center justify-start">
            <span
              className="cursor-pointer"
              onClick={() => {
                setExplorerTabs((tabs) =>
                  tabs.map((innerTab, tabIndex) => {
                    if (tabIndex === 2) {
                      return { ...innerTab, collapsed: !innerTab.collapsed };
                    }
                    return innerTab;
                  }),
                );
              }}
            >
              {explorerTabs[2].collapsed ? (
                <ChevronRight className="p-0.5" size={20} strokeWidth={2} />
              ) : (
                <ChevronDown className="p-0.5" size={20} strokeWidth={2} />
              )}
            </span>
            SEARCH
          </span>
          <div
            className={cn(
              "group-hover:flex items-center justify-center gap-1 hidden",
              { hidden: explorerTabs[2].collapsed },
            )}
          >
            <CopyMinus
              className="p-0.5 text-muted-foreground cursor-pointer rounded-sm hover:scale-110 hover:bg-accent-foreground/20"
              size={20}
              strokeWidth={2}
            />
          </div>
        </div>
        <div
          className={cn(
            "w-full h-full flex flex-col gap-1 overflow-y-scroll scroll-smooth",
          )}
        >
          <div className="w-full pl-4 flex flex-nowrap items-center justify-start">
            <span className="text-xs text-muted-foreground">Search</span>
          </div>
        </div>
      </section>
    );
}

export default Search;