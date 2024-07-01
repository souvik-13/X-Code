import { useOnClickOutside } from "@/hooks/clickOutside";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { FaSearchengin } from "react-icons/fa6";

interface searchEngineProps {
  className?: string;
}
const SearchEngine = ({ className }: searchEngineProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useOnClickOutside(inputRef, () => setOpen(false));
  const [open, setOpen] = useState(false);
  return (
    <div className={cn(className, "relative")}>
      <div
        ref={inputRef}
        className={cn(
          "absolute -top-4 left-0 right-0 z-20 flex flex-col rounded-lg bg-accent",
        )}
        onClick={(e) => {
          e.stopPropagation();
          console.log("Div clicked!");
        }}
        onScroll={() => console.log("Div scrolled!")}
      >
        <div className={cn("flex h-8 items-center px-2")}>
          <FaSearchengin />
          <input
            type="text"
            placeholder="Search or run command"
            className="h-full flex-1 bg-transparent px-2 outline-none"
            onFocus={() => setOpen(true)}
          />
          <span className="text-muted-foreground">/</span>
        </div>
        <div
          className={cn(
            !open ? "hidden" : "flex",
            "max-h-56 w-full flex-1 flex-col overflow-y-auto",
          )}
          style={{
            scrollbarWidth: "thin",
            scrollbarGutter: "auto",
            msScrollbarArrowColor: "transparent",
          }}
        >
          <div className="flex items-center justify-between px-2 py-1">
            <span>Recent</span>
            <span>Clear</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1">
            <span>Recent</span>
            <span>Clear</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1">
            <span>Recent</span>
            <span>Clear</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1">
            <span>Recent</span>
            <span>Clear</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1">
            <span>Recent</span>
            <span>Clear</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1">
            <span>Recent</span>
            <span>Clear</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1">
            <span>Recent</span>
            <span>Clear</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1">
            <span>Recent</span>
            <span>Clear</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1">
            <span>Recent</span>
            <span>Clear</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchEngine;
