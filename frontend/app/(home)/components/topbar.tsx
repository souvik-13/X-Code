"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutStateAtom } from "@/store/atoms";
import { useRecoilState } from "recoil";
import { VscLayoutSidebarLeft, VscLayoutSidebarLeftOff } from "react-icons/vsc";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  FaBell,
  FaPlus,
  FaQuestion,
  FaSearchengin,
  FaUser,
} from "react-icons/fa6";
import { CiLogout, CiSettings, CiSearch } from "react-icons/ci";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { Input } from "@/components/ui/input";
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
  return (
    <header className={cn(className, "")}>
      <div className="flex h-full w-full items-center">
        <div className="mx-2 cursor-pointer">
          {layoutState.sidebarOpen ? (
            <VscLayoutSidebarLeft
              onClick={() =>
                setLayoutState({ ...layoutState, sidebarOpen: false })
              }
            />
          ) : (
            <VscLayoutSidebarLeftOff
              onClick={() =>
                setLayoutState({ ...layoutState, sidebarOpen: true })
              }
            />
          )}
        </div>
        <div className="flex flex-1 items-center justify-normal px-4">
          <div className="mx-1">
            <Link href={"/~"} className="text-lg font-bold">
              Playground
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <SearchEngine className="w-[50%] min-w-48" />
          </div>
          <div className="flex items-center justify-center">
            <Button
              variant={"ghost"}
              size={"icon"}
              className="animate-in animate-out"
            >
              <FaPlus strokeWidth={2} size={20} />
            </Button>
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
    </header>
  );
};

export default Topbar;
