import {
  explorerTabsAtom,
  fileTreeAtom,
  openFilesAtom,
  selectedFolderAtom,
} from "@/store/atoms";
import React, { useEffect, useState } from "react";
import {
  RecoilState,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

import Files from "./Files";
import OpenFiles from "./OpenFiles";
import Heading from "./Heading";
import { useSocket } from "@/context/socket-provider";
import { projectInfoAtom } from "@/store/atoms/playground/projectInfo";

interface ExplorerProps {}

export default function Explorer({}: ExplorerProps) {
  const projectInfo = useRecoilValue(projectInfoAtom);
  const [fileTree, setFileTree] = useRecoilState(fileTreeAtom);
  const [currentFolder, setCurrentFolder] = useRecoilState(selectedFolderAtom);
  const [explorerTabs, setExplorerTabs] = useRecoilState(explorerTabsAtom);
  const [loading, setLoading] = useState<boolean>(true);
  const { isConnected, requestWorkspace, requestDirectory } = useSocket();

  useEffect(() => {
    if (!isConnected) {
      toast.error("Socket not connected");
      return;
    }
    requestWorkspace(projectInfo.name, (data) => {
      if (data.error) {
        toast.error(data.error);
        return;
      }
      if (data.status === "success") {
        requestDirectory(".", ({ status, error, dirPath, content }) => {
          if (error) {
            toast.error("error fetching dir");
            return;
          }
          if (status === "success") {
            setFileTree(content!);
            setLoading(false);
          }
        });
      }
    });
  }, [isConnected]);

  return (
    <div id="explorer" className="w-full h-full flex flex-col items-center">
      {/* heading */}
      <Heading />
      {/* files */}
      <Files loading={loading} setLoading={setLoading} />
      {/* open Files */}
      <OpenFiles />
      {/* search */}
      {/* <Search /> */}
    </div>
  );
}
