import { currentFileAtom, fileTreeAtom, openFilesAtom } from "@/store/atoms";
import React, { useEffect, useState } from "react";
import {
  RecoilState,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

import {
  ChevronDown,
  ChevronRight,
  CopyMinus,
  File,
  FilePlus2,
  Files as FilesIcon,
  Folder,
  FolderOpenIcon,
  FolderPlus,
  RotateCcw,
  EllipsisIcon,
  CopyXIcon,
  X,
  Search,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { projectInfoAtom } from "@/store/atoms/projectInfo";
import { findLang } from "@/lib/find-lang";
import { EachNode } from "./EachNode";
import Files from "./Files";
import { explorerTabsAtom } from "@/store/atoms/explorerTabs";
import OpenFiles from "./OpenFiles";
import Head from "next/head";
import Heading from "./Heading";

interface ExplorerProps {
  socket: Socket;
}

export default function Explorer({ socket }: ExplorerProps) {
  const [fileTree, setFileTree] = useRecoilState(fileTreeAtom);
  const [explorerTabs, setExplorerTabs] = useRecoilState(explorerTabsAtom);
  useEffect(() => {
    if (!socket) {
      toast.error("Socket not connected");
      return;
    }
    socket.on("workspace-ready", (data) => {
      setFileTree(data.fileTree);
    });

    return () => {
      if (socket) {
        socket.off("workspace-ready");
      }
    }
  }, [setFileTree, socket]);

  return (
    <section id="explorer" className="w-full h-full flex flex-col items-center">
      {/* heading */}
      <Heading />
      {/* files */}
      <Files socket={socket} />
      {/* open Files */}
      <OpenFiles />
      {/* search */}
      {/* <Search /> */}
    </section>
  );
}
