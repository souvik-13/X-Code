import { useOnClickOutside } from "@/hooks/clickOutside";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { FaPlus, FaSearchengin } from "react-icons/fa6";

import {
  Calculator,
  CreditCard,
  SearchIcon,
  Settings,
  User,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

interface searchEngineProps {
  className?: string;
  tabIndex?: number;
}
const SearchEngine = ({ className, tabIndex }: searchEngineProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useOnClickOutside(inputRef, () => setOpen(false));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      e.stopPropagation();

      if (e.key === "." && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "/") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className={cn(className, "")}>
      <div className="flex h-full w-full items-center">
        {/* small screen */}
        <button
          tabIndex={tabIndex}
          className="mx-auto w-full flex-none rounded-lg bg-accent/70 px-4 py-1 md:hidden"
          onClick={() => setOpen(true)}
        >
          <FaSearchengin size={20} />
        </button>

        {/* large scree */}
        <button
          tabIndex={tabIndex}
          className="hidden w-full cursor-pointer items-center rounded-lg border px-2 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:flex"
          onClick={(e) => {
            setOpen(true);
          }}
        >
          <div className="flex flex-1 items-center space-x-2 px-2">
            <FaSearchengin size={18} />
            <span className="flex-1">Search or type command</span>
          </div>

          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">/</span>
          </kbd>
        </button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <SearchIcon className="mr-2 h-4 w-4" />
                <span>Search playground</span>
              </CommandItem>
              <CommandItem>
                <FaPlus strokeWidth={2} className="mr-2 h-4 w-4" />
                <span>New playground</span>
              </CommandItem>
              <CommandItem>
                <Calculator className="mr-2 h-4 w-4" />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    </div>
  );
};

export default SearchEngine;

// export function CommandDialogDemo() {
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const down = (e: KeyboardEvent) => {
//       if (e.key === "." && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault();
//         setOpen((open) => !open);
//       }
//     };

//     document.addEventListener("keydown", down);
//     return () => document.removeEventListener("keydown", down);
//   }, []);

//   return (
//     <>
//       <p className="text-sm text-muted-foreground">
//         Press{" "}
//         <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
//           <span className="text-xs">⌘</span>J
//         </kbd>
//       </p>
//     </>
//   );
// }
