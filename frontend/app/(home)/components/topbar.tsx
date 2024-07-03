"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutStateAtom } from "@/store/atoms";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { CiLogout, CiSettings } from "react-icons/ci";
import { FaBell, FaPlus, FaQuestion, FaUser } from "react-icons/fa6";
import { LuMenu } from "react-icons/lu";
import { VscLayoutSidebarLeft, VscLayoutSidebarLeftOff } from "react-icons/vsc";
import { useRecoilState } from "recoil";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import CreatePlaygroundDialogue from "./create-playground";
import SearchEngine from "./search-engine";

interface ISession extends Session {
  user: {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    userName?: string;
    url?: string;
  };
}

interface TopbarProps {
  className?: string;
}

const Topbar = ({ className }: TopbarProps) => {
  const [layoutState, setLayoutState] = useRecoilState(LayoutStateAtom);
  const [session, setSession] = useState<ISession | null>(null);
  const { data, status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      // console.log(session);
      setSession(data as ISession);
    }
  }, [status]);

  const toggleSidebar = useCallback(() => {
    setLayoutState({
      ...layoutState,
      sidebarOpen: !layoutState.sidebarOpen,
    });
  }, [layoutState]);

  return (
    <header className={cn(className, "")}>
      <div className="h-topbar flex w-full items-center">
        <button
          tabIndex={1}
          className="mx-2 cursor-pointer md:mx-4"
          onClick={toggleSidebar}
        >
          {layoutState.sidebarOpen ? (
            <VscLayoutSidebarLeft />
          ) : (
            <VscLayoutSidebarLeftOff />
          )}
        </button>

        <div className="flex h-full flex-1 items-center justify-normal px-2 md:mx-4">
          <div className="mx-1">
            <Link tabIndex={2} href={"/~"} className="text-lg font-bold">
              Playground
            </Link>
          </div>

          <div className="flex h-full flex-1 items-center justify-center">
            <SearchEngine className="h-8 sm:w-16 md:w-[50%] md:min-w-48" />
          </div>

          <div className="flex items-center justify-center">
            <Button
              variant={"ghost"}
              size={"icon"}
              className="animate-in animate-out md:hidden"
            >
              <LuMenu strokeWidth={2} size={20} />
            </Button>
            <div className="hidden items-center justify-center md:flex">
              <CreatePlaygroundDialogue type="create">
                <div
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", // buttonVariants-base
                    "h-10 w-10", // size-icon
                    "hover:bg-accent hover:text-accent-foreground", // variant-ghost
                  )}
                >
                  <FaPlus strokeWidth={2} size={20} />
                </div>
              </CreatePlaygroundDialogue>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="animate-in animate-out"
              >
                <FaBell strokeWidth={2} size={20} />
              </Button>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="animate-in animate-out"
              >
                <FaQuestion strokeWidth={2} size={20} />
              </Button>

              <Popover>
                <PopoverTrigger>
                  <Avatar className="mx-1 size-8 cursor-pointer">
                    <AvatarImage src={session?.user.image ?? ""} alt="DP" />
                    <AvatarFallback>
                      <FaUser />
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="flex flex-col overflow-hidden p-0"
                >
                  <Link
                    href={`${session?.user.url || "~"}`}
                    className="flex w-full flex-none cursor-pointer items-center justify-normal p-2 hover:bg-accent/50"
                  >
                    <Avatar className="mx-1 size-10">
                      <AvatarImage src={session?.user.image ?? ""} alt="DP" />
                      <AvatarFallback>
                        <FaUser />
                      </AvatarFallback>
                    </Avatar>

                    <span className="mx-2 flex-1 truncate text-sm">
                      {/* @ts-ignore */}
                      {session?.user?.userName}
                    </span>
                  </Link>
                  <div className="w-full flex-1 border-y">
                    <Link
                      href={"/account#profile"}
                      className="flex w-full cursor-pointer items-center justify-start rounded px-4 py-1 transition-colors hover:bg-accent/70"
                    >
                      <FaUser />
                      <span className="mx-2">Profile</span>
                    </Link>
                    <Link
                      href={"/account#accounts"}
                      className="flex w-full cursor-pointer items-center justify-start rounded px-4 py-1 transition-colors hover:bg-accent/70"
                    >
                      <CiSettings strokeWidth={2} size={20} />
                      <span className="mx-2">Account</span>
                    </Link>
                  </div>
                  <div
                    className="flex w-full cursor-pointer items-center px-4 py-2 hover:bg-accent/50"
                    onClick={(e) => {
                      e.preventDefault();
                      signOut();
                    }}
                  >
                    <CiLogout strokeWidth={2} size={16} />
                    <span className="mx-2 flex-1 font-semibold">Log out</span>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
