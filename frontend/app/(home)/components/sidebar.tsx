"use client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutStateAtom } from "@/store/atoms";
import { useRecoilValue } from "recoil";
import { LuPlus } from "react-icons/lu";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { useEffect } from "react";

// icons
import { LuHome, LuFolder } from "react-icons/lu";

interface SidebarProps {
  className?: string;
  // sidebarOpen: boolean;
}

const Sidebar = ({ className }: SidebarProps) => {
  const isSidebarOpen = useRecoilValue(LayoutStateAtom).sidebarOpen;

  const currentPath = usePathname();
  return (
    <nav
      className={cn(
        className,
        "w-0",
        { "w-56 border": isSidebarOpen },
        "overflow-hidden",
      )}
    >
      <div
        className="flex h-full w-full flex-col items-center justify-start space-y-4 overflow-hidden p-4"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="w-full space-y-2">
          <div className="flex w-full cursor-pointer items-center justify-center text-nowrap rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-accent/50 hover:animate-in">
            <span className="mx-2">
              <LuPlus />
            </span>
            <span>Create Playground</span>
          </div>

          <div className="flex w-full cursor-pointer items-center justify-center text-nowrap rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-accent/50 hover:animate-in">
            <span className="mx-2">
              <FaGithub />
            </span>
            <span>Import from GitHub</span>
          </div>
        </div>

        <div className="w-full space-y-2">
          <Link
            href={"/~"}
            className={cn(
              "flex w-full cursor-pointer items-center justify-start gap-4 text-nowrap rounded-lg px-4 py-2 text-base transition-colors",
              currentPath === "/~" ? "bg-accent" : "hover:bg-accent/50",
            )}
          >
            <LuHome strokeWidth={2} />
            <span>Home</span>
          </Link>

          <Link
            href="/playgrounds"
            className={cn(
              "flex w-full cursor-pointer items-center justify-start gap-4 text-nowrap rounded-lg px-4 py-2 text-base transition-colors",
              currentPath === "/playgrounds"
                ? "bg-accent"
                : "hover:bg-accent/50",
            )}
          >
            <LuFolder strokeWidth={2} />
            <span>Playgrounds</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
